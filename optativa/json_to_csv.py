# json_to_csv.py
import json
import csv

INPUT_JSONL = "dataset_sessions.jsonl"   # path to your JSONL file
OUTPUT_CSV = "dataset_sessions.csv"      # output CSV path

# Open the JSONL file and read all lines
with open(INPUT_JSONL, "r", encoding="utf-8") as f:
    data = [json.loads(line) for line in f]

if not data:
    print("No data found in JSONL file!")
    exit()

# Extract fieldnames from the first record
fieldnames = list(data[0].keys())

# Write CSV
with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for row in data:
        # Convert any list fields to a string (e.g., user_upgrades_levels)
        for k, v in row.items():
            if isinstance(v, list):
                row[k] = "|".join(map(str, v))  # use '|' as a separator
        writer.writerow(row)

print(f"CSV saved to {OUTPUT_CSV}")
