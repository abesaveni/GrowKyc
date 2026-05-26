import os
import filecmp

def compare_dirs(dir1, dir2):
    diffs = []
    only_in_1 = []
    only_in_2 = []
    
    for root, _, files in os.walk(dir2):
        rel_path = os.path.relpath(root, dir2)
        target_dir = os.path.join(dir1, rel_path) if rel_path != '.' else dir1
        
        for file in files:
            file2 = os.path.join(root, file)
            file1 = os.path.join(target_dir, file)
            
            if not os.path.exists(file1):
                only_in_2.append(os.path.relpath(file2, dir2))
            elif not filecmp.cmp(file1, file2, shallow=False):
                diffs.append(os.path.relpath(file2, dir2))

    for root, _, files in os.walk(dir1):
        rel_path = os.path.relpath(root, dir1)
        target_dir = os.path.join(dir2, rel_path) if rel_path != '.' else dir2
        
        for file in files:
            file1 = os.path.join(root, file)
            file2 = os.path.join(target_dir, file)
            
            if not os.path.exists(file2):
                only_in_1.append(os.path.relpath(file1, dir1))
                
    return diffs, only_in_1, only_in_2

if __name__ == '__main__':
    d1 = 'Growkyc-main'
    d2 = 'Growkyc-main/Growkyc-main'
    
    # Exclude unwanted directories
    exclude = ['database', 'Growkyc_backend', 'node_modules', 'dist', '.git']
    
    diff_files = []
    only1 = []
    only2 = []
    
    for root, dirs, files in os.walk(d2):
        dirs[:] = [d for d in dirs if d not in exclude]
        
        rel_path = os.path.relpath(root, d2)
        
        for file in files:
            if file == 'package-lock.json':
                continue
                
            f2 = os.path.join(root, file)
            f1 = os.path.join(d1, rel_path, file)
            rel_file = os.path.relpath(f2, d2)
            
            if not os.path.exists(f1):
                only2.append(rel_file)
            elif not filecmp.cmp(f1, f2, shallow=False):
                diff_files.append(rel_file)

    for root, dirs, files in os.walk(d1):
        # We don't want to dive into the nested d2
        if 'Growkyc-main' in dirs:
            dirs.remove('Growkyc-main')
            
        dirs[:] = [d for d in dirs if d not in exclude]
        
        rel_path = os.path.relpath(root, d1)
        
        for file in files:
            if file == 'package-lock.json':
                continue
                
            f1 = os.path.join(root, file)
            f2 = os.path.join(d2, rel_path, file)
            rel_file = os.path.relpath(f1, d1)
            
            if not os.path.exists(f2):
                only1.append(rel_file)
                
    print("=== FILES DIFFERENT ===")
    for f in sorted(diff_files): print(f)
    print("\n=== ONLY IN INNER DIRECTORY ===")
    for f in sorted(only2): print(f)
    print("\n=== ONLY IN OUTER DIRECTORY ===")
    for f in sorted(only1): print(f)
