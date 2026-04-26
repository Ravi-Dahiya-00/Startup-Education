import os

root = r"E:\coding backup\Startup Education"
exclude_dirs = {'.git', 'node_modules', 'dist', 'build', 'coverage', '.vscode', '.agent', '__pycache__', '.gemini'}
exclude_files = {'package-lock.json', 'yarn.lock', 'line_counter.py'}
binary_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.exe', '.dll', '.bin', '.zip', '.tar', '.gz', '.mp4', '.mp3', '.pyc', '.class'}

extension_counts = {}
extension_files = {} # count of files per extension
total_lines = 0
total_files = 0

print(f"Scanning {root}...")

for dirpath, dirnames, filenames in os.walk(root):
    # Modify dirnames in-place to skip excluded directories
    dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
    
    for f in filenames:
        if f in exclude_files: continue
        
        ext = os.path.splitext(f)[1].lower()
        if ext in binary_extensions: continue
        
        path = os.path.join(dirpath, f)
        try:
            # check if binary
            is_binary = False
            try:
                with open(path, 'rb') as tfile:
                    chunk = tfile.read(1024)
                    if not chunk: pass # empty
                    # Check for null bytes which usually indicate binary
                    if b'\0' in chunk:
                        is_binary = True
            except:
                is_binary = True
                
            if is_binary: continue

            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                lines = sum(1 for _ in file)
                total_lines += lines
                total_files += 1
                extension_counts[ext] = extension_counts.get(ext, 0) + lines
                extension_files[ext] = extension_files.get(ext, 0) + 1
        except Exception as e:
            # print(f"Error reading {path}: {e}")
            pass

print(f"\nTotal Source Lines: {total_lines}")
print(f"Total Files: {total_files}")
print("-" * 30)
print(f"{'Extension':<12} {'Files':<8} {'Lines':<8}")
print("-" * 30)
for ext, count in sorted(extension_counts.items(), key=lambda x: -x[1]):
    file_count = extension_files.get(ext, 0)
    print(f"{ext or '(no ext)':<12} {file_count:<8} {count:<8}")
print("-" * 30)
