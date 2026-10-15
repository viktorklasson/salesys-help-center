#!/bin/bash

# Build script for SaleSys Claude Skills

set -e

echo "📦 Building SaleSys Claude Skills..."

# Create output directory
OUTPUT_DIR="public/skills"
mkdir -p "$OUTPUT_DIR"

# Navigate to skills directory
cd skills

# List of skills
SKILLS=(
  "salesys-mcp-server"
  "salesys-custom-views"
  "salesys-webhooks"
  "salesys-work-templates"
  "salesys-web-forms"
  "salesys-agreements"
  "salesys-statistics"
  "salesys-users"
  "salesys-export"
  "salesys-chat"
)

# Build individual skill zips
echo ""
echo "Building individual skills..."
for skill in "${SKILLS[@]}"; do
  if [ -d "$skill" ]; then
    echo "  📁 $skill"
    zip -q -r "../$OUTPUT_DIR/${skill}.zip" "$skill/"
  else
    echo "  ⚠️  Skipping $skill (directory not found)"
  fi
done

# Build complete bundle
echo ""
echo "Building complete bundle..."
zip -q -r "../$OUTPUT_DIR/salesys-skills-bundle.zip" salesys-*/

cd ..

echo ""
echo "✅ Done! Skills saved to $OUTPUT_DIR/"
echo ""
echo "Built skills:"
ls -lh "$OUTPUT_DIR"

echo ""
echo "📚 To add more skills, create directories in skills/ with SKILL.md files"
