import os
import shutil

modified_ui_files = [
    r"src\app\App.tsx",
    r"src\app\components\GrowKYCApp.tsx",
    r"src\app\components\cases\CaseControlCentre.tsx",
    r"src\app\components\cases\CaseWorkbench.tsx",
    r"src\app\components\documents\DocumentLibrary.tsx",
    r"src\app\components\grow-kyc\ClientReview.tsx",
    r"src\app\components\grow-kyc\GrowKYC.tsx",
    r"src\app\components\grow-kyc\KYCClientDetails.tsx",
    r"src\app\components\grow-kyc\KYCDashboardOverview.tsx",
    r"src\app\components\grow-kyc\PersonalizedDashboard.tsx",
    r"src\app\components\kyc\ClientKYCDashboard.tsx",
    r"src\app\components\kyc\EnhancedAustracTab.tsx",
    r"src\app\components\kyc\EnhancedDecisionTab.tsx",
    r"src\app\components\kyc\RemainingTabs.tsx",
]

root_dir = r"c:\Users\USER\Desktop\GrowKYC\Growkyc-main"
nested_dir = r"c:\Users\USER\Desktop\GrowKYC\Growkyc-main\Growkyc-main"

for rel_path in modified_ui_files:
    src_file = os.path.join(nested_dir, rel_path)
    dest_file = os.path.join(root_dir, rel_path)
    
    if os.path.exists(src_file):
        # We overwrite the root with the nested version as requested
        shutil.copy2(src_file, dest_file)
        print(f"Overwrote {rel_path} with nested version safely.")
    else:
        print(f"ERROR: {rel_path} missing in nested dir!")
