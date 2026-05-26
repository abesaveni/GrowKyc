import os
import difflib

files_to_check = [
    r"src\config\api.js",
    r"src\services\api.js",
    r"src\lib\storage\aws\s3ClientFactory.ts",
    r"src\lib\storage\mappers\evidenceMetadataMapper.ts",
    r"src\lib\storage\services\s3BatchEvidenceUploadService.ts",
    r"src\lib\storage\services\s3EvidenceUploadService.ts",
    r"src\lib\storage\services\s3UploadErrorHandler.ts",
    r"package.json"
]

root_dir = r"c:\Users\USER\Desktop\GrowKYC\Growkyc-main"
nested_dir = r"c:\Users\USER\Desktop\GrowKYC\Growkyc-main\Growkyc-main"

for rel_path in files_to_check:
    f1 = os.path.join(root_dir, rel_path)
    f2 = os.path.join(nested_dir, rel_path)
    
    if os.path.exists(f1) and os.path.exists(f2):
        with open(f1, 'r', encoding='utf-8') as file1, open(f2, 'r', encoding='utf-8') as file2:
            lines1 = file1.readlines()
            lines2 = file2.readlines()
            
        diff = list(difflib.unified_diff(lines1, lines2, fromfile='outer', tofile='inner'))
        if diff:
            print(f"\n--- DIFF FOR {rel_path} ---")
            for line in diff[:15]:  # print first 15 lines of diff to understand the change
                print(line, end='')
            if len(diff) > 15:
                print(f"... ({len(diff) - 15} more lines)")
