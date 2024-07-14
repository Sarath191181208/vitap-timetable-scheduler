import pathlib
import json

ROOT_FOLDER = pathlib.Path(__file__).resolve().parent
# PROJECT_ROOT = ROOT_FOLDER.parent
# DATA_FOLDER = PROJECT_ROOT / "src" / "data"
DATA_FOLDER = ROOT_FOLDER
theory_file = DATA_FOLDER / "theory.json"

with open(theory_file, "r") as f:
    data = json.load(f)

lab_file = DATA_FOLDER / "lab.json"

with open(lab_file, "r") as f:
    data.update(json.load(f))


# Extract the unique course codes and slots
course_codes = sorted(set(i[:3] for i in data.keys()))
# Extract the unique course slots
course_slots = sorted(
    list(set([item for sublist in data.values() for item in sublist]))
)

print(course_codes)
print("-"*30)
print(course_slots)

# Create a dictionary to encode the course codes and slots
course_code_encode_dict = dict()
for i in range(len(course_codes)):
    course_code_encode_dict[course_codes.pop()] = i

# Create a dictionary to encode the course slots
course_slot_encode_dict = dict()
for i in range(len(course_slots)):
    course_slot_encode_dict[course_slots.pop()] = i

# write the dictionary to a file
with open(DATA_FOLDER / "course_code_encode_dict.json", "w") as f:
    json.dump(course_code_encode_dict, f)

with open(DATA_FOLDER / "course_slot_encode_dict.json", "w") as f:
    json.dump(course_slot_encode_dict, f)
