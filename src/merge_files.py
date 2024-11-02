import os

root_dir = "src"
output_file = "merged_output.txt"

with open(output_file, "w", encoding="utf-8") as outfile:
    for root, _, files in os.walk(root_dir):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            outfile.write(f"File: {file_path}\n")
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as infile:
                    outfile.write(infile.read())
                    outfile.write("\n\n")
            except Exception as e:
                print(f"Could not read file {file_path}: {e}")
