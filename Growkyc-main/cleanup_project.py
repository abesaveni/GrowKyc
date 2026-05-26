#!/usr/bin/env python3
"""
GrowKYC Project Cleanup Script
Safely removes unnecessary and generated files/folders from the project directory.
"""

import os
import shutil
import stat
from pathlib import Path


def _handle_remove_readonly(func, path, exc):
    """
    Error handler for Windows readonly files.
    Attempts to change file permissions and retry deletion.
    """
    if not os.access(path, os.W_OK):
        os.chmod(path, stat.S_IWUSR | stat.S_IREAD)
        func(path)
    else:
        raise


def cleanup_project(project_dir=None):
    """
    Clean up the GrowKYC project by removing unnecessary folders.
    
    Args:
        project_dir (str): Path to the project directory. If None, uses current directory.
    """
    
    # Define the folders to delete
    folders_to_delete = [
        '.git',
        'node_modules',
        '__pycache__',
        'dist',
        'build',
        '.chrome-debug'
    ]
    
    # Set project directory
    if project_dir is None:
        project_dir = os.getcwd()
    
    # Convert to absolute path
    project_dir = os.path.abspath(project_dir)
    
    # Verify project directory exists
    if not os.path.isdir(project_dir):
        print(f"Error: Project directory does not exist: {project_dir}")
        return False
    
    print(f"Starting cleanup in: {project_dir}\n")
    
    deleted_count = 0
    not_found_count = 0
    
    # Process each folder
    for folder in folders_to_delete:
        folder_path = os.path.join(project_dir, folder)
        
        if os.path.exists(folder_path):
            try:
                if os.path.isdir(folder_path):
                    shutil.rmtree(folder_path, onerror=_handle_remove_readonly)
                    print(f"✓ Deleted: {folder}")
                    deleted_count += 1
                else:
                    print(f"✗ Skipped: {folder} (exists but is not a directory)")
            except Exception as e:
                print(f"✗ Error deleting {folder}: {str(e)}")
        else:
            print(f"ℹ Not found: {folder}")
            not_found_count += 1
    
    # Summary
    print(f"\n{'='*50}")
    print(f"Cleanup Summary:")
    print(f"  Deleted: {deleted_count} folder(s)")
    print(f"  Not found: {not_found_count} folder(s)")
    print(f"  Project directory: {project_dir}")
    print(f"{'='*50}")
    
    return True


def main():
    """Main entry point for the script."""
    import sys
    
    # Get project directory from command line argument or use current directory
    project_dir = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    
    try:
        cleanup_project(project_dir)
    except KeyboardInterrupt:
        print("\n\nCleanup cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()
