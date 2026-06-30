import difflib
import re

# per-table cache: { table: [(product_code, name_tokens, brand_lower)] }
_cache: dict[str, list] = {}
# per-table set of product codes for O(1) exact-code lookup
_code_sets: dict[str, set] = {}

SIMILARITY_THRESHOLD = 0.82


def _load(conn, table: str):
    if table in _cache:
        return
    cursor = conn.cursor()
    cursor.execute(f"SELECT product_code, name, brand FROM `{table}` WHERE name IS NOT NULL")
    rows = cursor.fetchall()
    cursor.close()
    entries = [
        (pc, _tokenize(_normalize_db_name(name, brand or "")), (brand or "").strip().lower())
        for pc, name, brand in rows
        if name
    ]
    # also keep a set of all product codes for fast exact-code lookup
    _cache[table] = entries
    _code_sets[table] = {pc.lower() for pc, _, _ in entries}


def _tokenize(text: str) -> str:
    """Lowercase, strip punctuation, sort words — makes word-order differences irrelevant."""
    words = re.sub(r"[^\w\s]", " ", text.lower()).split()
    return " ".join(sorted(words))


def _normalize_db_name(name: str, brand: str) -> str:
    """
    Strip brand prefix and parenthetical suffixes from DB names so they better
    match rdveikals names that have neither (e.g. dateks stores
    "Asus GeForce RTX 5070, 12GB GDDR7, Prime OC (DLSS 4)" — strip "Asus " prefix
    and "(DLSS 4)" suffix before tokenizing).
    """
    s = name.strip()
    # strip leading brand word(s) — e.g. "Gigabyte " or "MSI "
    if brand:
        brand_stripped = brand.strip()
        if s.lower().startswith(brand_stripped.lower()):
            s = s[len(brand_stripped):].lstrip()
    # strip trailing parentheticals like "(DLSS 4)", "(Resizable BAR)"
    s = re.sub(r"\s*\(.*?\)\s*$", "", s).strip()
    return s


_CPU_CODE_RE = re.compile(
    r'\b(BX\d{7,}[A-Z0-9]*|CM\d{9,}[A-Z0-9]*|100[-\d]{9,}[A-Z0-9]*)\b',
    re.IGNORECASE,
)


def find_product_code(conn, table: str, name: str, brand: str) -> str | None:
    """
    Return the product_code for the best-matching component in `table`, or None.

    For CPUs (and any product whose name embeds an explicit product code), tries
    a direct code extraction first.  Falls back to brand-filtered fuzzy matching.
    """
    _load(conn, table)

    # --- fast path: name contains an embedded product code (e.g. CPU names) ---
    codes_in_name = _CPU_CODE_RE.findall(name)
    for code in codes_in_name:
        if code.lower() in _code_sets.get(table, set()):
            # find and return the matching entry's product_code (preserving original case)
            for pc, _, _ in _cache[table]:
                if pc.lower() == code.lower():
                    return pc

    brand_lower = brand.strip().lower()
    query_tokens = _tokenize(name)

    # narrow to same brand (skip brand filter if brand is empty)
    # use prefix match so "pny" matches "pny technologies" and vice versa
    candidates = [
        (pc, name_tokens)
        for pc, name_tokens, b in _cache[table]
        if not brand_lower or b == brand_lower or b.startswith(brand_lower) or brand_lower.startswith(b)
    ]

    if not candidates:
        return None

    # extract 4-digit model numbers from the query (e.g. "3050", "5060", "4070")
    query_model_nums = set(re.findall(r'\b\d{4}\b', name.lower()))

    best_pc = None
    best_score = 0.0
    for pc, name_tokens in candidates:
        # if query contains a 4-digit model number, the candidate must contain
        # the same set — prevents "3050" matching "5050" via high fuzzy score
        if query_model_nums:
            candidate_model_nums = set(re.findall(r'\b\d{4}\b', name_tokens))
            if query_model_nums != candidate_model_nums:
                continue

        score = difflib.SequenceMatcher(None, query_tokens, name_tokens).ratio()
        if score > best_score:
            best_score = score
            best_pc = pc

    if best_score >= SIMILARITY_THRESHOLD:
        return best_pc
    return None


def clear_cache():
    """Call between categories so stale data isn't reused across table switches."""
    _cache.clear()
    _code_sets.clear()
