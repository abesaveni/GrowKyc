import os
import shutil

files_to_overwrite = [
    r"src\lib\storage\aws\s3ClientFactory.ts",
    r"src\lib\storage\mappers\evidenceMetadataMapper.ts",
    r"src\lib\storage\services\s3UploadErrorHandler.ts",
]

root_dir = r"c:\Users\USER\Desktop\GrowKYC\Growkyc-main"
nested_dir = r"c:\Users\USER\Desktop\GrowKYC\Growkyc-main\Growkyc-main"

for rel_path in files_to_overwrite:
    src_file = os.path.join(nested_dir, rel_path)
    dest_file = os.path.join(root_dir, rel_path)
    
    shutil.copy2(src_file, dest_file)
    print(f"Overwrote {rel_path} with inner version safely.")
