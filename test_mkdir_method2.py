import os
import sys

dirs = [
    'C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/hooks',
    'C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/components',
    'C:/Users/rafae/Documents/Respositories/travel-baggage-checker/trip-manager-app/src/context'
]

try:
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        print(f"Created: {d}")
    print("METHOD 2: ✓ SUCCESS")
except Exception as e:
    print(f"METHOD 2: ✗ FAILED: {e}")
