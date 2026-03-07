<?php

/**
 * export_to_json.php
 *
 * Exports all PC builder tables to a single JSON file for analysis.
 * Run from anywhere — reads DB credentials from Laravel's .env automatically.
 *
 * Usage:
 *   php export_to_json.php
 *   php export_to_json.php --out=my_export.json
 *   php export_to_json.php --table=cpus
 *   php export_to_json.php --table=cpus,gpus,psus
 *
 * Output: pc_builder_export.json (next to this script, or path from --out)
 */

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

$args = [];
foreach (array_slice($argv, 1) as $arg) {
  if (str_starts_with($arg, '--')) {
    [$key, $val] = explode('=', ltrim($arg, '--'), 2) + [1 => true];
    $args[$key] = $val;
  }
}

$outputFile = $args['out']    ?? __DIR__ . '/pc_builder_export.json';
$onlyTables = isset($args['table'])
  ? array_map('trim', explode(',', $args['table']))
  : null;

// ---------------------------------------------------------------------------
// Load .env  (walks up from this file's directory to find Laravel's .env)
// ---------------------------------------------------------------------------

function load_env(string $startDir): array
{
  $dir = $startDir;
  for ($i = 0; $i < 5; $i++) {
    $path = $dir . '/.env';
    if (file_exists($path)) {
      $env = [];
      foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        [$k, $v] = explode('=', $line, 2) + [1 => ''];
        $env[trim($k)] = trim($v, " \t\"'");
      }
      return $env;
    }
    $dir = dirname($dir);
  }
  return [];
}

$env = load_env(__DIR__);

$host     = $env['DB_HOST']     ?? '127.0.0.1';
$port     = $env['DB_PORT']     ?? '3306';
$dbname   = $env['DB_DATABASE'] ?? '';
$username = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

if (!$dbname) {
  fwrite(STDERR, "[ERROR] DB_DATABASE not found. Make sure .env exists in the project root.\n");
  exit(1);
}

// ---------------------------------------------------------------------------
// Connect
// ---------------------------------------------------------------------------

try {
  $pdo = new PDO(
    "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4",
    $username,
    $password,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );
} catch (PDOException $e) {
  fwrite(STDERR, "[ERROR] DB connection failed: {$e->getMessage()}\n");
  exit(1);
}

// ---------------------------------------------------------------------------
// Tables to export (matches migration exactly)
// ---------------------------------------------------------------------------

$allTables = [
  'cpus',
  'motherboards',
  'ram',
  'gpus',
  'ssds',
  'hdds',
  'cases',
  'fans',
  'psus',
  'coolers',
];

$tables = $onlyTables
  ? array_values(array_intersect($allTables, $onlyTables))
  : $allTables;

$unknown = $onlyTables ? array_diff($onlyTables, $allTables) : [];
if ($unknown) {
  fwrite(STDERR, "[WARN] Unknown tables ignored: " . implode(', ', $unknown) . "\n");
}

// ---------------------------------------------------------------------------
// Type casting (PDO returns everything as strings — mirrors migration types)
// ---------------------------------------------------------------------------

function cast_row(array $row): array
{
  static $intCols = [
    'id',
    'dateks_id',
    // cpus
    'cores',
    'threads',
    'tdp',
    'passmark',
    // motherboards
    'memory_slots',
    'memory_max_speed',
    'm2_slots',
    'sata_ports',
    // ram
    'capacity',
    'frequency',
    'cl_latency',
    'modules_count',
    // gpus
    'vram',
    'min_psu',
    'length_mm',
    // ssds / hdds
    'read_speed',
    'write_speed',
    // cases
    'max_gpu_length',
    'max_cpu_cooler_height',
    'bays_25',
    'bays_35',
    // fans
    'size_mm',
    'rpm_max',
    'rpm_min',
    'units_in_package',
    // psus
    'wattage',
    'fan_size_mm',
    'pcie_connectors',
    'eps_connectors',
    'sata_connectors',
    // coolers
    'tdp_support',
    'height_mm',
  ];

  static $floatCols = [
    'price',
    'clock_rate',
    'turbo_frequency',
    'pcie_version',
    'noise_db',
  ];

  static $boolCols = [
    'in_stock',
    'integrated_graphics',
    'cooler_included',
    'wifi',
    'modular',
    'psu_included',
  ];

  foreach ($row as $col => &$val) {
    if ($val === null) {
      continue;
    } elseif (in_array($col, $intCols, true)) {
      $val = (int) $val;
    } elseif (in_array($col, $floatCols, true)) {
      $val = (float) $val;
    } elseif (in_array($col, $boolCols, true)) {
      $val = (bool) $val;
    }
    // strings and timestamps kept as-is
  }

  return $row;
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

$export = [
  'exported_at' => date('Y-m-d H:i:s'),
  'database'    => $dbname,
  'tables'      => [],
];

foreach ($tables as $table) {
  echo "Exporting {$table}... ";

  try {
    $rows = $pdo
      ->query("SELECT * FROM `{$table}` ORDER BY id")
      ->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    fwrite(STDERR, "\n[ERROR] Failed to query {$table}: {$e->getMessage()}\n");
    continue;
  }

  $rows = array_map('cast_row', $rows);

  $export['tables'][$table] = [
    'count' => count($rows),
    'rows'  => $rows,
  ];

  echo count($rows) . " rows\n";
}

// ---------------------------------------------------------------------------
// Write JSON
// ---------------------------------------------------------------------------

$json = json_encode(
  $export,
  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if ($json === false) {
  fwrite(STDERR, "[ERROR] JSON encoding failed: " . json_last_error_msg() . "\n");
  exit(1);
}

if (file_put_contents($outputFile, $json) === false) {
  fwrite(STDERR, "[ERROR] Could not write to {$outputFile}\n");
  exit(1);
}

$kb = round(filesize($outputFile) / 1024, 1);
echo "\nDone. Exported to: {$outputFile} ({$kb} KB)\n";
