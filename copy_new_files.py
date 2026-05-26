import os
import shutil

# Files to move from nested to root
new_files = [
    r"src\app\components\kyc\AuditTab.tsx",
    r"src\app\components\kyc\DecisionsTab.tsx",
    r"src\components\ProtectedRoute.tsx",
    r"src\components\RoleBasedRedirect.tsx",
    r"src\context\AuthContext.tsx",
    r"src\pages\ForgotPassword.tsx",
    r"src\pages\Login.tsx",
    r"src\pages\Signup.tsx",
]

root_dir = r"c:\Users\USER\Desktop\GrowKYC\Growkyc-main"
nested_dir = r"c:\Users\USER\Desktop\GrowKYC\Growkyc-main\Growkyc-main"

for rel_path in new_files:
    src_file = os.path.join(nested_dir, rel_path)
    dest_file = os.path.join(root_dir, rel_path)
    
    # Create target directory if it doesn't exist
    dest_dir = os.path.dirname(dest_file)
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        
    if os.path.exists(src_file):
        if not os.path.exists(dest_file):
            shutil.copy2(src_file, dest_file)
            print(f"Copied {rel_path} successfully.")
        else:
            print(f"File {rel_path} already exists in root! Skipping.")
    else:
        print(f"Source file {rel_path} missing in nested dir!")
