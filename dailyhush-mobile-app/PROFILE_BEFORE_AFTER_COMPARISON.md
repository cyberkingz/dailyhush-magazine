# Profile Screen - Before/After Code Comparison

## Quick Reference Guide for Implementation

This document provides side-by-side comparisons of specific code sections for easy implementation.

---

## 1. Input Field Component

### BEFORE: Custom TextInput (Lines 183-219)

```tsx
{/* Name Input */}
<View className="mb-4">
  <Text className="text-[#95B8A8] text-sm mb-2">Name</Text>
  <TextInput
    value={name}
    onChangeText={setName}
    placeholder="Enter your name"
    placeholderTextColor="#4A6B5C"
    className="bg-[#1A4D3C] text-[#E8F4F0] text-base rounded-xl px-4 py-4 border-2 border-transparent focus:border-[#40916C]"
    autoCapitalize="words"
    returnKeyType="next"
  />
  <Text className="text-[#6B9080] text-xs mt-2">
    Optional: Personalize your experience
  </Text>
</View>

{/* Age Input */}
<View className="mb-4">
  <Text className="text-[#95B8A8] text-sm mb-2">Age</Text>
  <TextInput
    value={age}
    onChangeText={(text) => {
      const numericValue = text.replace(/[^0-9]/g, '');
      setAge(numericValue);
    }}
    placeholder="Enter your age"
    placeholderTextColor="#4A6B5C"
    className="bg-[#1A4D3C] text-[#E8F4F0] text-base rounded-xl px-4 py-4 border-2 border-transparent focus:border-[#40916C]"
    keyboardType="number-pad"
    returnKeyType="done"
    maxLength={3}
  />
  <Text className="text-[#6B9080] text-xs mt-2">
    Optional: Helps us provide age-appropriate content
  </Text>
</View>
```

**Issues:**
- Label text-sm = 14px (too small)
- Input height ~48px (insufficient touch target)
- Helper text-xs = 12px (too small)
- No focus state management
- Inconsistent with auth screens

### AFTER: ProfileTextInput Component

```tsx
{/* Add to imports */}
import { ProfileTextInput } from '@/components/profile/ProfileTextInput';

{/* Name Input */}
<ProfileTextInput
  label="Name"
  value={name}
  onChangeText={setName}
  placeholder="Enter your name"
  helperText="Optional: Personalize your experience"
  autoCapitalize="words"
  returnKeyType="next"
  testID="name-input"
  editable={!isSaving}
/>

{/* Age Input */}
<ProfileTextInput
  label="Age"
  value={age}
  onChangeText={(text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setAge(numericValue);
  }}
  placeholder="Enter your age"
  helperText="Optional: Helps us provide age-appropriate content"
  keyboardType="number-pad"
  returnKeyType="done"
  maxLength={3}
  testID="age-input"
  editable={!isSaving}
/>
```

**Improvements:**
- Label 16px (readable)
- Input height 56px (proper touch target)
- Helper text 15px (readable)
- Built-in focus state with #40916C border
- Matches auth screen pattern
- Supports error states

---

## 2. Save Button

### BEFORE: Header Button (Lines 123-137)

```tsx
{/* Save button in header */}
<Pressable
  onPress={handleSave}
  disabled={isSaving}
  className="active:opacity-70"
  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
>
  <View className="flex-row items-center bg-[#40916C] px-4 py-2 rounded-xl">
    <Save size={16} color="#FFFFFF" strokeWidth={2} />
    <Text className="text-white text-sm font-semibold ml-2">
      {isSaving ? 'Saving...' : 'Save'}
    </Text>
  </View>
</Pressable>
```

**Issues:**
- py-2 = ~32px height (insufficient)
- text-sm = 14px (too small)
- Located in header (hard to reach)
- No loading indicator
- Custom implementation

### AFTER: AuthButton at Bottom (New position after line 227)

```tsx
{/* Add to imports */}
import { AuthButton } from '@/components/auth/AuthButton';

{/* Remove save button from header - keep only back button */}
{/* Header */}
<View
  className="bg-[#0A1612] border-b border-[#1A4D3C]/30"
  style={{
    paddingTop: insets.top + 12,
    paddingBottom: 12,
    paddingHorizontal: 20,
  }}
>
  <Pressable
    onPress={handleBack}
    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    className="active:opacity-70"
    accessibilityRole="button"
    accessibilityLabel="Go back"
  >
    <View className="flex-row items-center">
      <ArrowLeft size={24} color="#52B788" strokeWidth={2} />
      <Text className="text-[#E8F4F0] text-lg font-semibold ml-3">
        Edit Profile
      </Text>
    </View>
  </Pressable>
</View>

{/* Add save button at bottom of form, after privacy notice */}
{/* Save Button */}
<View style={{ marginTop: 36 }}>
  <AuthButton
    title="Save Changes"
    onPress={handleSave}
    variant="primary"
    disabled={isSaving}
    loading={isSaving}
    testID="save-profile-button"
  />
</View>
```

**Improvements:**
- 56px height (proper touch target)
- 18px text (readable)
- Bottom placement (thumb-friendly)
- Built-in loading spinner
- Consistent with auth screens
- Proper disabled state

---

## 3. Success/Error Messages

### BEFORE: Simple Background (Lines 154-161)

```tsx
{/* Success Message */}
{successMessage && (
  <View className="bg-[#40916C]/20 border border-[#40916C] rounded-xl p-4 mb-6">
    <Text className="text-[#B7E4C7] text-sm text-center font-medium">
      {successMessage}
    </Text>
  </View>
)}

{/* No error message display */}
```

**Issues:**
- No animation
- text-sm = 14px (small)
- No icon (less recognizable)
- No error handling UI
- Inconsistent with auth screens

### AFTER: ErrorAlert Component (Replaces lines 154-161)

```tsx
{/* Add to imports */}
import { ErrorAlert } from '@/components/auth/ErrorAlert';

{/* Add error state after line 27 */}
const [error, setError] = useState<string | null>(null);

{/* Add error timeout effect after line 35 */}
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }
}, [error]);

{/* Replace success message block with both success and error */}
{/* Success/Error Messages */}
{successMessage && (
  <ErrorAlert
    message={successMessage}
    type="success"
    dismissible={false}
  />
)}

{error && (
  <ErrorAlert
    message={error}
    type="error"
    onDismiss={() => setError(null)}
  />
)}

{/* Update handleSave error handling (lines 61-66) */}
if (updateError) {
  console.error('Error updating profile:', updateError);
  setError(updateError.message || 'Failed to update profile. Please try again.');
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  setIsSaving(false);
  return;
}
```

**Improvements:**
- Animated entrance (300ms)
- 17px text (readable)
- CheckCircle/AlertCircle icons
- Proper error display
- Dismissible error messages
- Consistent with auth screens

---

## 4. Section Headers

### BEFORE: Small Uppercase (Lines 165, 178)

```tsx
{/* Account Section Header */}
<Text className="text-[#95B8A8] text-xs font-semibold uppercase mb-3">
  Account
</Text>

{/* Personal Information Header */}
<Text className="text-[#95B8A8] text-xs font-semibold uppercase mb-3">
  Personal Information
</Text>
```

**Issues:**
- text-xs = 12px (too small)
- mb-3 = 12px (insufficient spacing)
- Weak contrast color
- No letter spacing

### AFTER: Enhanced Headers

```tsx
{/* Account Section Header */}
<Text
  style={{
    fontSize: 14,
    fontWeight: '700',
    color: '#A8CFC0',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 16,
  }}
>
  Account Information
</Text>

{/* Personal Information Header */}
<Text
  style={{
    fontSize: 14,
    fontWeight: '700',
    color: '#A8CFC0',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 16,
  }}
>
  Personal Details
</Text>
```

**Improvements:**
- 14px bold (better visibility)
- 16px margin (clearer separation)
- Better contrast (#A8CFC0)
- 1.2px letter spacing
- More descriptive labels

---

## 5. Account Info Display

### BEFORE: Basic Container (Lines 168-174)

```tsx
<View className="bg-[#1A4D3C] rounded-2xl p-4">
  <Text className="text-[#95B8A8] text-sm mb-1">Email</Text>
  <Text className="text-[#E8F4F0] text-base">
    {user?.email || 'Not set'}
  </Text>
</View>
```

**Issues:**
- Label text-sm = 14px (small)
- Value text-base = 16px (small)
- mb-1 = 4px (tight spacing)

### AFTER: Enhanced Readability

```tsx
<View className="bg-[#1A4D3C] rounded-2xl p-4">
  <Text style={{ fontSize: 15, fontWeight: '600', color: '#95B8A8', marginBottom: 8 }}>
    Email
  </Text>
  <Text style={{ fontSize: 17, fontWeight: '400', color: '#E8F4F0' }}>
    {user?.email || 'Not set'}
  </Text>
</View>
```

**Improvements:**
- Label 15px semibold (readable)
- Value 17px (standard body size)
- 8px spacing (better readability)

---

## 6. Privacy Notice

### BEFORE: Low Contrast (Lines 222-227)

```tsx
<View className="bg-[#1A4D3C]/50 rounded-xl p-4 mt-4">
  <Text className="text-[#95B8A8] text-sm leading-relaxed">
    Your personal information is private and secure. We use this to personalize your DailyHush experience.
  </Text>
</View>
```

**Issues:**
- text-sm = 14px (small)
- Semi-transparent background (low contrast)
- mt-4 = 16px (inconsistent)
- No border definition

### AFTER: Enhanced Visibility

```tsx
<View
  style={{
    backgroundColor: 'rgba(26, 77, 60, 0.4)',
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.2)',
  }}
>
  <Text
    style={{
      fontSize: 15,
      lineHeight: 24,
      color: '#B7E4C7',
      fontWeight: '400',
    }}
  >
    Your personal information is private and secure. We use this to personalize your DailyHush experience and provide age-appropriate content recommendations.
  </Text>
</View>
```

**Improvements:**
- 15px text (readable)
- 24px line height (comfortable)
- Brighter color (#B7E4C7)
- Border for definition
- 24px top margin (consistent)
- More detailed explanation

---

## 7. Form Layout Wrapper

### BEFORE: No Max-Width Constraint

```tsx
<ScrollView
  className="flex-1"
  contentContainerStyle={{
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40 + insets.bottom,
  }}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
>
  {/* Content directly in ScrollView */}
  {/* Success Message */}
  ...
  {/* Account Info */}
  ...
</ScrollView>
```

**Issues:**
- No max-width (stretches on tablets)
- Inconsistent with auth screens

### AFTER: Centered Form Wrapper

```tsx
<ScrollView
  className="flex-1"
  contentContainerStyle={{
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40 + insets.bottom,
  }}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
>
  {/* Add form wrapper */}
  <View style={{ maxWidth: 420, width: '100%', alignSelf: 'center' }}>

    {/* All content inside wrapper */}
    {/* Success/Error Messages */}
    ...
    {/* Account Info */}
    ...
    {/* Personal Information */}
    ...
    {/* Privacy Notice */}
    ...
    {/* Save Button */}
    ...

  </View>
</ScrollView>
```

**Improvements:**
- 420px max-width (optimal reading)
- Centered on tablets
- Consistent with auth screens
- Professional appearance

---

## 8. Enhanced Error Handling

### BEFORE: Console Only (Lines 61-66)

```tsx
if (error) {
  console.error('Error updating profile:', error);
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  setIsSaving(false);
  return;
}
```

**Issues:**
- No user-visible error
- No validation
- Generic error handling

### AFTER: User-Friendly Error Handling

```tsx
// Add validation before update
const ageValue = age ? parseInt(age, 10) : null;

// Validate age if provided
if (ageValue !== null && (ageValue < 18 || ageValue > 120)) {
  setError('Please enter a valid age between 18 and 120.');
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  setIsSaving(false);
  return;
}

// Better error messaging
if (updateError) {
  console.error('Error updating profile:', updateError);
  setError(updateError.message || 'Failed to update profile. Please try again.');
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  setIsSaving(false);
  return;
}

// Handle missing user
if (!user?.user_id) {
  setError('No user account found. Please sign in again.');
  setIsSaving(false);
  return;
}

// Catch block improvements
catch (error: any) {
  console.error('Exception updating profile:', error);
  setError(error.message || 'An unexpected error occurred. Please try again.');
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
```

**Improvements:**
- Age range validation
- User-friendly messages
- ErrorAlert display
- Specific error cases
- Better UX feedback

---

## Implementation Steps

### Step 1: Create ProfileTextInput Component
```bash
# Create directory
mkdir -p components/profile

# Create file (already done)
# /components/profile/ProfileTextInput.tsx
```

### Step 2: Update Profile Screen Imports
```tsx
// Add to imports section at top of app/profile.tsx
import { ProfileTextInput } from '@/components/profile/ProfileTextInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
```

### Step 3: Add Error State
```tsx
// After line 27, add:
const [error, setError] = useState<string | null>(null);

// After line 35, add:
useEffect(() => {
  if (error) {
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }
}, [error]);
```

### Step 4: Update Header (Remove Save Button)
Replace lines 100-138 with simplified header

### Step 5: Update Success/Error Messages
Replace lines 154-161 with ErrorAlert components

### Step 6: Update Section Headers
Replace lines 165 and 178 with enhanced headers

### Step 7: Update Input Fields
Replace lines 182-219 with ProfileTextInput components

### Step 8: Update Privacy Notice
Replace lines 222-227 with enhanced version

### Step 9: Add Form Wrapper
Wrap all ScrollView content in max-width container

### Step 10: Add Save Button at Bottom
Add AuthButton after privacy notice

### Step 11: Update Error Handling
Enhance handleSave function with validation and error states

---

## Testing Checklist

- [ ] ProfileTextInput component renders correctly
- [ ] 56px input height on all devices
- [ ] Focus states work (border changes to #40916C)
- [ ] Error messages display with ErrorAlert
- [ ] Success messages display with animation
- [ ] Save button at bottom is easily reachable
- [ ] Age validation works (18-120 range)
- [ ] Form wrapper centers on tablet
- [ ] Keyboard handling works on iOS/Android
- [ ] VoiceOver/TalkBack reads all labels
- [ ] Color contrast passes WCAG AA
- [ ] Touch targets meet 56px minimum

---

## Quick Visual Reference

### Typography Scale
```
Section Headers: 14px bold uppercase (#A8CFC0)
Input Labels:    16px semibold (#E8F4F0)
Input Text:      17px regular (#E8F4F0)
Helper Text:     15px regular (#95B8A8)
Error Text:      15px medium (#FF8787)
Button Text:     18px semibold (#FFFFFF)
```

### Touch Targets
```
Input Fields:    56px height
Save Button:     56px height
Back Button:     44px min (with hitSlop)
```

### Spacing
```
Section Margin:  24px (between major sections)
Input Margin:    24px (between inputs in component)
Label Margin:    10px (label to input)
Helper Margin:   8px (input to helper text)
```

### Colors
```
Primary:         #52B788
Primary Dark:    #40916C
Background:      #0A1612
Container:       #1A4D3C
Text Primary:    #E8F4F0
Text Secondary:  #A8CFC0
Text Tertiary:   #95B8A8
Error:           #FF8787
Success:         #52B788
```

---

## Common Issues & Solutions

### Issue: Input not focusing
**Solution:** Ensure TextInput is not disabled and remove any overlay components

### Issue: Keyboard covers input
**Solution:** KeyboardAvoidingView is already implemented, verify behavior prop

### Issue: Save button not visible
**Solution:** Check ScrollView contentContainerStyle paddingBottom includes insets

### Issue: ErrorAlert not animating
**Solution:** Verify ErrorAlert component is imported from @/components/auth/ErrorAlert

### Issue: Touch targets too small on Android
**Solution:** All components use 56px height - verify React Native version supports height styles

---

This comparison document provides all the specific code changes needed to implement the improvements. Each section can be implemented independently, but the recommended order is listed in the Implementation Steps.
