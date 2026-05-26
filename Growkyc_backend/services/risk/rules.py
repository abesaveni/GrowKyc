"""
services/risk/rules.py
======================
Configurable AML risk scoring thresholds and factor weights.
"""

from typing import Dict, Any

# Risk Level Thresholds
RISK_THRESHOLDS = {
    "LOW": (0, 39),
    "MEDIUM": (40, 79),
    "HIGH": (80, 100)
}

# Base Factor Weights (0-100 impact scale)
RISK_FACTORS = {
    "geography": {
        "description": "Country of residence or incorporation",
        "high_risk_countries": ["North Korea", "Iran", "Syria", "Cuba", "Russia", "Belarus", "Myanmar"],
        "medium_risk_countries": ["Panama", "Cayman Islands", "BVI", "UAE"],
        "weights": {
            "high": 40,
            "medium": 20,
            "low": 0
        }
    },
    "pep": {
        "description": "Politically Exposed Person matching",
        "weights": {
            "is_pep": 40,
            "not_pep": 0
        }
    },
    "sanctions": {
        "description": "Sanctions list matching",
        "weights": {
            "is_sanctioned": 100,  # Automatic HIGH risk
            "not_sanctioned": 0
        }
    },
    "income": {
        "description": "Unexplained extreme wealth or income levels",
        "threshold": 1000000,
        "weights": {
            "above_threshold": 15,
            "below_threshold": 0
        }
    }
}

def determine_risk_level(score: float) -> str:
    """Map a numerical score to a risk level."""
    for level, (min_val, max_val) in RISK_THRESHOLDS.items():
        if min_val <= score <= max_val:
            return level
    return "HIGH" if score > 100 else "LOW"
