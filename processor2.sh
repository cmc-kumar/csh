#!/bin/bash

# Use a null-terminated delimiter for file names to handle special characters
find . -maxdepth 1 -name "*.html" -print0 | while IFS= read -r -d $'\0' file; do
    # Check if it is a file
    if [ -f "$file" ]; then
        # Use sed to perform the replacements in-place
        # Provide an empty string as the extension argument for compatibility with macOS
        sed -i '' 's|/\.theme/theme_csh/||g' "$file"
        sed -i '' 's|/\.theme/theme_csh/css|css|g' "$file"
        sed -i '' 's|/\.theme/images|images|g' "$file"
        # Print the file name, quoted to handle special characters in the name
        echo "Processed \"$file\""
    fi
done

echo "All HTML files have been processed."

