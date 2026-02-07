# PC Build Generation Logic Documentation

## Overview

The PC build generator creates balanced computer builds based on a user's budget. It intelligently allocates budget across components, ensures hardware compatibility, and follows best practices for component selection.

---

## Budget Allocation Strategy

The system uses percentage-based budget allocation with priority ordering to ensure critical components get appropriate funding.

### Base Allocation Percentages

```php
$allocation = [
    'processor' => 0.20,    // 20% - CPU is core performance
    'gpu' => 0.30,          // 30% - Largest allocation (gaming/graphics)
    'motherboard' => 0.10,  // 10% - Must match CPU socket
    'ram' => 0.10,          // 10% - Memory for multitasking
    'ssd' => 0.10,          // 10% - Primary storage
    'case' => 0.05,         // 5%  - Housing
    'psu' => 0.08,          // 8%  - Power supply
    'cooler' => 0.07        // 7%  - CPU cooling (if needed)
];
```

### Selection Priority Order

Components are selected in this specific order to ensure compatibility:

1. **Processor** - Selected first as it determines socket type and platform
2. **Motherboard** - Must match processor socket
3. **RAM** - Must match motherboard memory type (DDR4/DDR5)
4. **GPU** - Independent, gets largest budget share
5. **SSD** - Primary storage
6. **Case** - Must accommodate motherboard form factor
7. **PSU** - Sized based on total system power requirements
8. **Cooler** - Only if processor doesn't include one

---

## Component Selection Logic

### 1. Processor Selection

**Goal**: Find the best CPU within 20% of budget

**Query Logic**:
```sql
SELECT * FROM processors
WHERE price <= (budget * 0.20 * 1.1)  -- Allow 10% over allocation
  AND price >= (budget * 0.20 * 0.5)  -- Minimum 50% of allocation
  AND availability != 'Nav pieejams'
ORDER BY price DESC
LIMIT 1
```

**Key Extracted Data**:
- `socket` - Determines compatible motherboards
- `tdp` - Used for PSU wattage calculation
- `cooler_included` - Determines if separate cooler needed

**Example Output**:
```json
{
  "id": 123,
  "name": "AMD Ryzen 5 5600X",
  "socket": "AM4",
  "tdp": 65,
  "cooler_included": 1,
  "price": 199.99
}
```

---

### 2. Motherboard Selection

**Goal**: Find compatible motherboard matching CPU socket and supporting appropriate RAM

**Compatibility Requirements**:
- `socket` must match processor socket exactly
- `memory_type` determines RAM compatibility (DDR4/DDR5)
- `form_factor` determines case compatibility

**Query Logic**:
```sql
SELECT * FROM motherboards
WHERE socket = :processor_socket
  AND price <= (budget * 0.10 * 1.1)
  AND price >= (budget * 0.10 * 0.5)
  AND availability != 'Nav pieejams'
ORDER BY price DESC
LIMIT 1
```

**Socket Matching Examples**:
- Intel: `LGA1700`, `LGA1851`, `LGA1200`
- AMD: `AM4`, `AM5`

**Key Extracted Data**:
- `memory_type` - DDR4 or DDR5 (determines RAM selection)
- `form_factor` - ATX, Micro-ATX, Mini-ITX (determines case)

---

### 3. RAM Selection

**Goal**: Find RAM matching motherboard memory type with optimal capacity

**Compatibility Requirements**:
- `memory_type` must match motherboard exactly
- Capacity based on budget tier:
  - Budget <€800: 16GB minimum
  - Budget €800-€1500: 32GB target
  - Budget >€1500: 32GB+ target

**Query Logic**:
```sql
SELECT * FROM rams
WHERE memory_type = :motherboard_memory_type
  AND price <= (budget * 0.10 * 1.1)
  AND price >= (budget * 0.10 * 0.5)
  AND availability != 'Nav pieejams'
ORDER BY capacity DESC, frequency DESC, price DESC
LIMIT 1
```

**Prioritization**:
1. Capacity (more GB better)
2. Frequency (higher MHz better)
3. Price (maximize value)

**Common Types**:
- DDR4: 2400MHz - 3600MHz typical
- DDR5: 4800MHz - 6400MHz typical

---

### 4. GPU Selection

**Goal**: Find best graphics card within 30% budget allocation

**Special Handling**:
- Excludes workstation cards (Quadro, FirePro)
- Prioritizes gaming/consumer cards

**Query Logic**:
```sql
SELECT * FROM gpus
WHERE price <= (budget * 0.30 * 1.1)
  AND price >= (budget * 0.30 * 0.5)
  AND availability != 'Nav pieejams'
  AND gpu_model NOT LIKE '%Quadro%'
  AND gpu_model NOT LIKE '%FirePro%'
ORDER BY price DESC
LIMIT 1
```

**Key Data**:
- `gpu_model` - e.g., "RTX 4070", "RX 7800 XT"
- `memory` - VRAM in GB
- `power_connector` - e.g., "8-pin", "12VHPWR"

**Power Considerations**:
- Budget GPUs: 150-200W typical
- Mid-range: 200-300W typical
- High-end: 300-450W typical

---

### 5. SSD Selection

**Goal**: Find primary storage with good capacity and performance

**Capacity Targets by Budget**:
- <€800: 500GB minimum
- €800-€1500: 1TB target
- >€1500: 1TB+ / NVMe preferred

**Query Logic**:
```sql
SELECT * FROM ssds
WHERE price <= (budget * 0.10 * 1.1)
  AND price >= (budget * 0.10 * 0.5)
  AND availability != 'Nav pieejams'
ORDER BY capacity DESC, read_speed DESC, price DESC
LIMIT 1
```

**Prioritization**:
1. Capacity (storage space)
2. Read speed (performance)
3. Price (value)

**Common Types**:
- SATA: ~550 MB/s (budget)
- NVMe Gen3: ~3500 MB/s (mainstream)
- NVMe Gen4: ~7000 MB/s (high-end)

---

### 6. Case Selection

**Goal**: Find case matching motherboard form factor

**Compatibility Requirements**:
- `form_factor` must accommodate motherboard
- Form factor hierarchy (larger fits smaller):
  - Full Tower → ATX, Micro-ATX, Mini-ITX
  - Mid Tower → ATX, Micro-ATX, Mini-ITX
  - Micro ATX → Micro-ATX, Mini-ITX
  - Mini ITX → Mini-ITX only

**Query Logic**:
```sql
SELECT * FROM cases
WHERE form_factor LIKE '%ATX%'  -- Broad match for compatibility
  AND price <= (budget * 0.05 * 1.1)
  AND price >= (budget * 0.05 * 0.5)
  AND availability != 'Nav pieejams'
ORDER BY price DESC
LIMIT 1
```

---

### 7. PSU Selection

**Goal**: Provide adequate power with safety margin

**Wattage Calculation**:
```php
$base_wattage = 150; // Base system power

// Add component power
$total_wattage = $base_wattage;
$total_wattage += $processor->tdp ?? 65;      // CPU TDP
$total_wattage += $this->estimateGpuWattage($gpu); // GPU estimate
$total_wattage += 50; // RAM, storage, fans, etc.

// Apply 30% safety margin
$required_wattage = $total_wattage * 1.3;
```

**GPU Wattage Estimation** (based on price):
```php
if ($gpu_price > 600) return 350;      // High-end: 350W
if ($gpu_price > 400) return 250;      // Upper mid: 250W
if ($gpu_price > 250) return 200;      // Mid-range: 200W
if ($gpu_price > 150) return 150;      // Budget: 150W
return 100;                             // Entry: 100W
```

**Query Logic**:
```sql
SELECT * FROM psus
WHERE wattage >= :required_wattage
  AND price <= (budget * 0.08 * 1.1)
  AND price >= (budget * 0.08 * 0.5)
  AND availability != 'Nav pieejams'
ORDER BY wattage ASC, price ASC
LIMIT 1
```

**Efficiency Ratings** (80 PLUS):
- Bronze: 82-85% efficiency
- Gold: 87-90% efficiency
- Platinum: 90-92% efficiency

---

### 8. Cooler Selection

**Goal**: Provide CPU cooling if not included with processor

**Conditional Logic**:
```php
if ($processor->cooler_included == 0) {
    // Select cooler with adequate TDP rating
    $cooler = Cooler::where('tdp', '>=', $processor->tdp)
        ->where('price', '<=', $budget * 0.07 * 1.1)
        ->where('price', '>=', $budget * 0.07 * 0.5)
        ->where('availability', '!=', 'Nav pieejams')
        ->orderBy('tdp', 'asc')
        ->orderBy('price', 'asc')
        ->first();
}
```

**TDP Matching**:
- Cooler TDP rating should meet or exceed CPU TDP
- Example: 65W CPU needs ≥65W cooler
- Margin recommended: +10-20W for headroom

**Cooler Types**:
- Air: 65-250W TDP typical, budget-friendly
- AIO: 150-300W TDP typical, better for high-end

---

## Compatibility Matrix

### Socket Compatibility

| CPU Socket | Compatible Motherboard Socket |
|------------|-------------------------------|
| AM4        | AM4                           |
| AM5        | AM5                           |
| LGA1700    | LGA1700                       |
| LGA1851    | LGA1851                       |
| LGA1200    | LGA1200                       |

### Memory Compatibility

| Motherboard Memory Type | Compatible RAM Type |
|-------------------------|---------------------|
| DDR4                    | DDR4                |
| DDR5                    | DDR5                |

### Form Factor Compatibility

| Motherboard Form Factor | Compatible Cases        |
|-------------------------|-------------------------|
| ATX                     | Mid/Full Tower          |
| Micro-ATX               | Micro ATX, Mid/Full     |
| Mini-ITX                | Mini ITX, Micro, Mid    |

---

## Budget Flexibility System

### Tolerance Ranges

Each component has flexible budget bounds:

```php
$min_price = $allocation * 0.5;  // 50% below allocation
$max_price = $allocation * 1.1;  // 10% above allocation
```

**Example for €1000 budget**:
- Processor (20% = €200):
  - Minimum: €100 (50% of allocation)
  - Maximum: €220 (110% of allocation)

**Purpose**:
- Allows finding components when exact allocation isn't available
- Prevents over/under-spending on single components
- Maintains overall budget balance

---

## Error Handling

### Component Not Found Scenarios

**If any component can't be found**:
```json
{
  "error": "Could not build PC with available components",
  "requested_budget": "1000",
  "message": "Try increasing budget or check component availability"
}
```

**Common Causes**:
1. Budget too low for minimum viable build
2. Component out of stock (availability = "Nav pieejams")
3. Compatibility mismatch (wrong socket/memory type)
4. Price range has no products

### Debugging Failed Builds

Check each component selection query:
```sql
-- Check processor availability in range
SELECT COUNT(*) FROM processors 
WHERE price BETWEEN 100 AND 220 
AND availability != 'Nav pieejams';

-- Check socket compatibility
SELECT COUNT(*) FROM motherboards 
WHERE socket = 'AM4' 
AND availability != 'Nav pieejams';

-- Check memory type availability
SELECT COUNT(*) FROM rams 
WHERE memory_type = 'DDR4' 
AND availability != 'Nav pieejams';
```

---

## Response Format

### Successful Build Response

```json
{
  "total_price": 1547.82,
  "requested_budget": 1600,
  "components": {
    "processor": {
      "id": 123,
      "name": "AMD Ryzen 5 5600X",
      "price": 199.99,
      "socket": "AM4",
      "cores": 6,
      "frequency": 3700,
      "tdp": 65
    },
    "motherboard": {
      "id": 456,
      "name": "MSI B550-A PRO",
      "price": 139.99,
      "socket": "AM4",
      "form_factor": "ATX",
      "memory_type": "DDR4"
    },
    "ram": {
      "id": 789,
      "name": "Corsair Vengeance 32GB DDR4 3200MHz",
      "price": 89.99,
      "capacity": 32,
      "memory_type": "DDR4",
      "frequency": 3200
    },
    "gpu": {
      "id": 321,
      "name": "NVIDIA GeForce RTX 4060 Ti",
      "price": 449.99,
      "gpu_model": "RTX 4060 Ti",
      "memory": 8
    },
    "ssd": {
      "id": 654,
      "name": "Samsung 970 EVO Plus 1TB",
      "price": 119.99,
      "capacity": 1000,
      "type": "NVMe"
    },
    "case": {
      "id": 987,
      "name": "NZXT H510",
      "price": 79.99,
      "form_factor": "Mid Tower"
    },
    "psu": {
      "id": 147,
      "name": "Corsair RM750 750W 80+ Gold",
      "price": 109.99,
      "wattage": 750,
      "certification": "80+ Gold"
    },
    "cooler": null
  },
  "notes": {
    "compatibility": "All components are compatible",
    "cooler": "Stock cooler included with processor"
  }
}
```

---

## Future Enhancements

### Potential Improvements

1. **Multi-tier builds**
   - Generate 3 options: Budget, Balanced, Performance
   - User can choose preference

2. **Use case optimization**
   - Gaming focus (prioritize GPU)
   - Workstation focus (prioritize CPU/RAM)
   - Content creation (balanced)

3. **Brand preferences**
   - Intel vs AMD preference
   - NVIDIA vs AMD GPU preference

4. **RGB/Aesthetics**
   - Filter for RGB components
   - Color matching

5. **Upgrade paths**
   - Suggest future upgrade options
   - Show max specs for motherboard

6. **Performance estimates**
   - FPS estimates for popular games
   - Benchmark scores
   - Productivity performance

7. **Alternative components**
   - Show 2-3 alternatives per component
   - "Upgrade for +€50" suggestions

8. **Stock monitoring**
   - Alert when out-of-stock components available
   - Price drop notifications

---

## Testing Scenarios

### Test Budget Ranges

**€600-€800** (Entry Level):
- Should select: i3/Ryzen 3, 16GB RAM, RTX 3050/RX 6600, 500GB SSD

**€1000-€1200** (Mid-Range):
- Should select: i5/Ryzen 5, 16-32GB RAM, RTX 4060/RX 7600, 1TB SSD

**€1600-€2000** (High-End):
- Should select: i7/Ryzen 7, 32GB RAM, RTX 4070/RX 7800 XT, 1TB+ NVMe

**€2500+** (Enthusiast):
- Should select: i9/Ryzen 9, 32GB+ DDR5, RTX 4080+/RX 7900 XT+, 2TB NVMe

### Edge Cases to Test

1. **Very low budget** (€400): Should fail gracefully
2. **Exact component unavailable**: Should find next best
3. **All Intel/AMD out of stock**: Should still build with available
4. **No compatible motherboard**: Should return error
5. **PSU wattage insufficient**: Should select higher wattage

---

## Database Requirements

### Required Tables

All component tables must have these fields:
- `id` (primary key)
- `name` (product name)
- `price` (decimal)
- `availability` (stock status)
- `url` (product page link)

### Component-Specific Fields

**Processors**: socket, tdp, cores, frequency, cooler_included
**Motherboards**: socket, memory_type, form_factor
**RAM**: memory_type, capacity, frequency
**GPUs**: gpu_model, memory, power_connector
**SSDs**: capacity, type, read_speed
**Cases**: form_factor
**PSUs**: wattage, certification
**Coolers**: tdp, cooler_class

---

## Maintenance Notes

### Regular Updates Needed

1. **Component prices** - Run scraper daily/weekly
2. **Availability status** - Update stock info
3. **Budget allocations** - Adjust based on market trends
4. **GPU wattage estimates** - Update for new models
5. **Socket compatibility** - Add new CPU platforms

### Monitoring Metrics

- **Success rate**: % of build requests that succeed
- **Average price vs budget**: How close builds match budget
- **Component availability**: Stock levels per category
- **Popular budgets**: Most requested price ranges

---

## API Endpoint

### Generate Build

**Endpoint**: `POST /api/build`

**Request**:
```json
{
  "budget": 1600
}
```

**Response**: See "Response Format" section above

**Status Codes**:
- `200 OK`: Build generated successfully
- `400 Bad Request`: Invalid budget (must be positive number)
- `404 Not Found`: No components available for budget
- `500 Internal Server Error`: Database or system error

---

*Last Updated: February 2026*
*Version: 1.0*