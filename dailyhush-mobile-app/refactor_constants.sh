#!/bin/bash

# Refactor training modules to use constants

for file in app/training/focus.tsx app/training/interrupt.tsx app/training/execute.tsx; do
  echo "Refactoring $file..."
  
  # Add imports if not already present (focus.tsx already has them)
  if ! grep -q "import { colors } from '@/constants/colors';" "$file"; then
    sed -i '' "/import { saveModuleProgress, loadModuleProgress } from '@\/services\/training';/a\\
import { colors } from '@/constants/colors';\\
import { spacing } from '@/constants/spacing';\\
import { timing } from '@/constants/timing';
" "$file"
  fi
  
  # Replace debounce timing
  sed -i '' 's/, 1000)/, timing.debounce.save)/g' "$file"
  
  # Replace spacing values
  sed -i '' 's/insets\.top + 8/insets.top + spacing.safeArea.top/g' "$file"
  sed -i '' 's/Math\.max(insets\.bottom, 16)/Math.max(insets.bottom, spacing.safeArea.bottom)/g' "$file"
  sed -i '' 's/paddingHorizontal: 20/paddingHorizontal: spacing.lg/g' "$file"
  sed -i '' 's/paddingBottom: 40/paddingBottom: spacing["3xl"]/g' "$file"
  
  # Replace bg-[#0A1612] with style
  sed -i '' 's/className="flex-1 bg-\[#0A1612\]"/className="flex-1" style={{ backgroundColor: colors.background.primary }}/g' "$file"
  
  # Replace button styling
  sed -i '' 's/className="bg-\[#40916C\] h-14 rounded-2xl/className="rounded-2xl/g' "$file"
  
  echo "Done with $file"
done

echo "Refactoring complete!"
