# Module & Method System - Quick Start Guide

## 5-Minute Developer Reference

### Import What You Need

```typescript
import {
  // Get module data
  getModule,
  getEnabledModules,
  getFreeModules,
  getPremiumModules,
  hasModuleAccess,

  // Get method data
  getMethodsForModule,
  getMethod,
  getRecommendedMethod,
  getMethodNavigationParams,
  hasMethodAccess,

  // Types
  type ModuleId,
  type MethodId,
  type Module,
  type Method,
} from '@/constants';
```

## Common Use Cases

### 1. Display All Available Modules

```typescript
function ModulesScreen() {
  const user = useUser()
  const isPremium = user?.subscription_status === 'active'
  const modules = getEnabledModules()

  return (
    <ScrollView>
      {modules.map(module => (
        <ModuleCard
          key={module.id}
          module={module}
          hasAccess={hasModuleAccess(module.id, isPremium)}
        />
      ))}
    </ScrollView>
  )
}
```

### 2. Show Methods for Selected Module

```typescript
function MethodsScreen({ route }) {
  const { moduleId } = route.params
  const module = getModule(moduleId)
  const methods = getMethodsForModule(moduleId)
  const recommended = getRecommendedMethod(moduleId)

  return (
    <View>
      <Text>{module.title}</Text>
      <Text>{module.description}</Text>

      {methods.map(method => (
        <MethodCard
          key={method.id}
          method={method}
          isRecommended={method.id === recommended?.id}
        />
      ))}
    </View>
  )
}
```

### 3. Navigate to Method

```typescript
function MethodCard({ moduleId, methodId }) {
  const router = useRouter()
  const user = useUser()
  const isPremium = user?.subscription_status === 'active'

  const handlePress = () => {
    // Check access
    if (!hasMethodAccess(moduleId, methodId, isPremium)) {
      router.push('/subscription')
      return
    }

    // Get navigation params
    const nav = getMethodNavigationParams(moduleId, methodId)
    if (!nav) return

    // Navigate
    router.push({
      pathname: nav.route,
      params: nav.params
    })
  }

  return (
    <Pressable onPress={handlePress}>
      {/* Method UI */}
    </Pressable>
  )
}
```

### 4. Premium Gating

```typescript
// Check module access
const canAccessModule = hasModuleAccess('better-sleep', isPremiumUser);

// Check method access
const canAccessMethod = hasMethodAccess('better-sleep', 'progress-dashboard', isPremiumUser);

// Get only accessible methods
const accessibleMethods = getMethodsForModule(moduleId).filter((method) =>
  hasMethodAccess(moduleId, method.id, isPremiumUser)
);
```

### 5. Get Module by Tag (Search/Discovery)

```typescript
import { getModulesByTag } from '@/constants'

function SearchResults({ query }) {
  const modules = getModulesByTag(query)

  return (
    <View>
      <Text>Modules for "{query}"</Text>
      {modules.map(module => (
        <ModuleCard key={module.id} module={module} />
      ))}
    </View>
  )
}
```

### 6. Sort Methods by Duration

```typescript
import { getMethodsByDuration } from '@/constants'

function QuickHelpScreen({ moduleId }) {
  const methods = getMethodsByDuration(moduleId) // Fastest first

  return (
    <View>
      <Text>Quick Relief Options</Text>
      {methods.map(method => (
        <MethodCard
          key={method.id}
          method={method}
          showDuration
        />
      ))}
    </View>
  )
}
```

## Module Data Structure

```typescript
const module = {
  id: 'stop-spiraling',
  title: 'Stop Spiraling',
  subtitle: 'Interrupt rumination right now',
  description: 'Full description...',
  icon: '🌀',
  color: {
    primary: '#DC2626',
    gradient: ['#DC2626', '#EF4444'],
    background: 'rgba(220, 38, 38, 0.1)',
    border: 'rgba(220, 38, 38, 0.3)',
  },
  isEnabled: true,
  isPremium: false,
  isUrgent: true,
  estimatedDuration: '2-10 min',
  methods: ['talk-to-anna', 'quick-exercise', 'breathing-exercise'],
  tags: ['urgent', 'rumination', 'anxiety', 'overthinking'],
};
```

## Method Data Structure

```typescript
const method = {
  id: 'talk-to-anna',
  moduleId: 'stop-spiraling',
  title: 'Talk to Anna',
  subtitle: 'Get personalized support',
  description: 'Full description...',
  icon: '💬',
  duration: '5-10 min',
  durationMinutes: 7,
  route: '/anna/conversation',
  params: {
    moduleId: 'stop-spiraling',
    moduleName: 'Stop Spiraling',
    source: 'module-selection',
  },
  isPremium: false,
  isRecommended: true,
  benefits: ['Personalized guidance', 'Understand patterns', ...],
  bestFor: ['When you need to talk it out', ...],
}
```

## Module IDs

```typescript
type ModuleId =
  | 'stop-spiraling' // Free, urgent
  | 'calm-anxiety' // Free
  | 'process-emotions' // Premium
  | 'better-sleep' // Premium
  | 'gain-focus'; // Premium
```

## Method IDs

```typescript
type MethodId =
  | 'talk-to-anna' // Conversational therapy
  | 'quick-exercise' // Direct to exercise
  | 'breathing-exercise' // Guided breathing
  | 'progress-dashboard'; // Historical insights (premium only)
```

## Color System

```typescript
// Use module colors for UI consistency
const module = getModule('stop-spiraling')

<LinearGradient colors={module.color.gradient}>
  <Text style={{ color: module.color.primary }}>
    {module.title}
  </Text>
</LinearGradient>

<View style={{
  backgroundColor: module.color.background,
  borderColor: module.color.border,
  borderWidth: 1,
}}>
  {/* Module content */}
</View>
```

## Analytics Events

```typescript
// When user selects module
analytics.track('MODULE_SELECTED', {
  module_id: module.id,
  module_name: module.title,
  is_premium: module.isPremium,
  is_urgent: module.isUrgent,
  has_access: hasModuleAccess(module.id, isPremium),
});

// When user selects method
analytics.track('METHOD_SELECTED', {
  module_id: moduleId,
  method_id: methodId,
  method_name: method.title,
  duration_minutes: method.durationMinutes,
  is_recommended: method.isRecommended,
  is_premium: method.isPremium,
});

// When method completed
analytics.track('METHOD_COMPLETED', {
  module_id: moduleId,
  method_id: methodId,
  duration_seconds: actualDuration,
  completion_status: 'completed' | 'skipped' | 'abandoned',
});
```

## Common Patterns

### Show Urgent Help First

```typescript
const urgentModules = getUrgentModules()
const otherModules = getEnabledModules().filter(m => !m.isUrgent)

return (
  <View>
    {urgentModules.length > 0 && (
      <Section title="Need Help Now?">
        {urgentModules.map(module => <ModuleCard key={module.id} module={module} />)}
      </Section>
    )}
    <Section title="Other Help">
      {otherModules.map(module => <ModuleCard key={module.id} module={module} />)}
    </Section>
  </View>
)
```

### Recommend Based on User Context

```typescript
function getRecommendedModule(userContext: {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  isSpiraling: boolean;
  recentActivity: string[];
}): ModuleId {
  // Spiraling takes priority
  if (userContext.isSpiraling) {
    return 'stop-spiraling';
  }

  // Nighttime → sleep module
  if (userContext.timeOfDay === 'night') {
    return 'better-sleep';
  }

  // Default to calm anxiety
  return 'calm-anxiety';
}
```

### Build Module Selection UI

```typescript
function ModuleSelector() {
  const [selectedModule, setSelectedModule] = useState<ModuleId | null>(null)
  const router = useRouter()

  const handleModuleSelect = (moduleId: ModuleId) => {
    setSelectedModule(moduleId)
    // Navigate to method selection
    router.push(`/modules/${moduleId}/methods`)
  }

  return (
    <View>
      <Text>What do you need help with?</Text>
      {getEnabledModules().map(module => (
        <ModuleCard
          key={module.id}
          module={module}
          isSelected={selectedModule === module.id}
          onPress={() => handleModuleSelect(module.id)}
        />
      ))}
    </View>
  )
}
```

## Type Safety

All functions are fully typed. TypeScript will catch:

```typescript
// ✅ Valid
const module = getModule('stop-spiraling');
const methods = getMethodsForModule('calm-anxiety');

// ❌ TypeScript error - invalid module ID
const invalid = getModule('invalid-module');

// ✅ Valid method for module
const nav = getMethodNavigationParams('stop-spiraling', 'talk-to-anna');

// ❌ TypeScript error - method doesn't exist for this module
const invalid = getMethodNavigationParams('stop-spiraling', 'invalid-method');
```

## Adding New Content

### Add New Module

1. Edit `/constants/modules.ts`
2. Add to `ModuleId` type
3. Add to `MODULES` object
4. Add to `ALL_MODULE_IDS` array

### Add New Method

1. Edit `/constants/methods.ts`
2. Add method to appropriate module's method array
3. TypeScript will enforce all required fields

### Add New Method Type

1. Edit `/constants/methods.ts`
2. Add to `MethodId` type
3. Create method instances
4. Update `ALL_METHOD_IDS` array

## Testing

```typescript
import { describe, it, expect } from '@jest/globals';
import { getModule, getMethodsForModule, hasModuleAccess, hasMethodAccess } from '@/constants';

describe('Module System', () => {
  it('should return module by ID', () => {
    const module = getModule('stop-spiraling');
    expect(module.title).toBe('Stop Spiraling');
    expect(module.isPremium).toBe(false);
  });

  it('should return methods for module', () => {
    const methods = getMethodsForModule('stop-spiraling');
    expect(methods.length).toBeGreaterThan(0);
    expect(methods[0].moduleId).toBe('stop-spiraling');
  });

  it('should gate premium content', () => {
    expect(hasModuleAccess('better-sleep', false)).toBe(false);
    expect(hasModuleAccess('better-sleep', true)).toBe(true);
    expect(hasModuleAccess('stop-spiraling', false)).toBe(true);
  });
});
```

## Performance Considerations

All helpers use direct object lookups - O(1) complexity:

```typescript
// ✅ Fast - single object lookup
const module = getModule('stop-spiraling');

// ✅ Fast - filter operation on small array (~10-15 items)
const methods = getMethodsForModule('stop-spiraling');

// ✅ Fast - cached in memory, no network calls
const enabled = getEnabledModules();
```

No network calls required - all configuration is static.

---

**Quick Links:**

- Full Documentation: `/docs/MODULE_NAVIGATION_FLOW.md`
- Module Config: `/constants/modules.ts`
- Method Config: `/constants/methods.ts`
