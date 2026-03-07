PAGE_DELAY = 1

CATEGORIES = {
    "cpu": {
        "urls": [
            "https://www.dateks.lv/en/cenas/procesori-intel",
            "https://www.dateks.lv/en/cenas/procesori-amd",
        ],
        "parser": "cpu_parser",
        "table": "cpus",
    },
    "motherboard": {
        "urls": [
            "https://www.dateks.lv/en/cenas/sistemplates-intel-procesoriem",
            "https://www.dateks.lv/en/cenas/sistemplates-amd-procesoriem",
        ],
        "parser": "motherboard_parser",
        "table": "motherboards",
    },
    "ram": {
        "urls": [
            "https://www.dateks.lv/en/cenas/atmina-ram",
        ],
        "parser": "ram_parser",
        "table": "ram",
    },
    "gpu": {
        "urls": [
            "https://www.dateks.lv/en/cenas/videokartes",
        ],
        "parser": "gpu_parser",
        "table": "gpus",
    },
    "ssd": {
        "urls": [
            "https://www.dateks.lv/en/cenas/cietie-diski-ssd",
        ],
        "parser": "ssd_parser",
        "table": "ssds",
    },
    "hdd": {
        "urls": [
            "https://www.dateks.lv/en/cenas/cietie-diski-hdd-3-5",
        ],
        "parser": "hdd_parser",
        "table": "hdds",
    },
    "case": {
        "urls": [
            "https://www.dateks.lv/en/cenas/korpusi",
        ],
        "parser": "case_parser",
        "table": "cases",
    },
    "fan": {
        "urls": [
            "https://www.dateks.lv/en/cenas/ventilatori",
        ],
        "parser": "fan_parser",
        "table": "fans",
    },
    "psu": {
        "urls": [
            "https://www.dateks.lv/en/cenas/psu-barosanas-bloki",
        ],
        "parser": "psu_parser",
        "table": "psus",
    },
    "cooler": {
        "urls": [
            "https://www.dateks.lv/en/cenas/procesoru-gaisa-dzesetaji",
        ],
        "parser": "cooler_parser",
        "table": "coolers",
    },
}
