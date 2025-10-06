# DashboardSection Component Usage Guide

## Overview

The `DashboardSection` component provides a reusable, consistent layout system for analytics dashboards that prevents common CSS Grid height-matching issues.

---

## Basic Patterns

### Pattern 1: Primary Content + Sidebar (Current Funnel Section)

**Before (Manual Implementation):**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <Card className="lg:col-span-2">
    <CardContent>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:pr-4 lg:border-r border-gray-100">
          <QuizFunnelChart steps={funnelSteps} />
        </div>
        <div className="lg:pl-2">
          <FunnelActionItems steps={funnelSteps} />
        </div>
      </div>
    </CardContent>
  </Card>

  <div className="space-y-4 lg:self-start">
    <Card>{/* Device stats */}</Card>
    <Card>{/* Source stats */}</Card>
  </div>
</div>
```

**After (Using DashboardSection):**
```tsx
<DashboardSection layout="2-1">
  <DashboardSection.Primary>
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>Step-by-step conversion breakdown with recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <DashboardSection.Split>
          <DashboardSection.SplitLeft>
            <QuizFunnelChart steps={funnelSteps} />
          </DashboardSection.SplitLeft>
          <DashboardSection.SplitRight>
            <FunnelActionItems steps={funnelSteps} />
          </DashboardSection.SplitRight>
        </DashboardSection.Split>
      </CardContent>
    </Card>
  </DashboardSection.Primary>

  <DashboardSection.Sidebar>
    <Card>{/* Device stats */}</Card>
    <Card>{/* Source stats */}</Card>
  </DashboardSection.Sidebar>
</DashboardSection>
```

**Benefits:**
- ✅ More semantic and readable
- ✅ Automatic height-matching prevention
- ✅ Consistent spacing
- ✅ Reusable across dashboard

---

## Layout Options

### 2/3 + 1/3 Layout (Default)
```tsx
<DashboardSection layout="2-1">
  <DashboardSection.Primary>
    {/* Takes 2/3 width */}
  </DashboardSection.Primary>
  <DashboardSection.Sidebar>
    {/* Takes 1/3 width */}
  </DashboardSection.Sidebar>
</DashboardSection>
```

### 3/4 + 1/4 Layout
```tsx
<DashboardSection layout="3-1">
  <DashboardSection.Primary>
    {/* Takes 3/4 width */}
  </DashboardSection.Primary>
  <DashboardSection.Sidebar>
    {/* Takes 1/4 width */}
  </DashboardSection.Sidebar>
</DashboardSection>
```

### 1/2 + 1/2 Layout
```tsx
<DashboardSection layout="1-1">
  <DashboardSection.Primary>
    {/* Takes 1/2 width */}
  </DashboardSection.Primary>
  <DashboardSection.Sidebar>
    {/* Takes 1/2 width */}
  </DashboardSection.Sidebar>
</DashboardSection>
```

---

## Advanced Patterns

### Pattern 2: Full Width Chart
```tsx
<DashboardSection>
  <DashboardSection.FullWidth>
    <Card>
      <CardHeader>
        <CardTitle>Trends Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={timeSeriesData}>
            {/* Chart elements */}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  </DashboardSection.FullWidth>
</DashboardSection>
```

### Pattern 3: Centered Content (Prevents "Lonely" Charts)
```tsx
<DashboardSection.Primary>
  <Card>
    <CardContent>
      <CenteredContent minHeight={400}>
        <ConstrainedWidth maxWidth="2xl">
          <QuizFunnelChart steps={funnelSteps} />
        </ConstrainedWidth>
      </CenteredContent>
    </CardContent>
  </Card>
</DashboardSection.Primary>
```

**Use when:** Chart doesn't need full card height, preventing it from looking lost

### Pattern 4: Split Without Border
```tsx
<DashboardSection.Split>
  <DashboardSection.SplitLeft withBorder={false}>
    {/* No border separator */}
  </DashboardSection.SplitLeft>
  <DashboardSection.SplitRight>
    {/* Right content */}
  </DashboardSection.SplitRight>
</DashboardSection.Split>
```

---

## Real-World Examples

### Example 1: KPI Cards Row
```tsx
<DashboardSection layout="1-1">
  <DashboardSection.Primary>
    <div className="grid grid-cols-2 gap-4">
      <Card>{/* KPI 1 */}</Card>
      <Card>{/* KPI 2 */}</Card>
    </div>
  </DashboardSection.Primary>

  <DashboardSection.Sidebar>
    <div className="grid grid-cols-2 gap-4">
      <Card>{/* KPI 3 */}</Card>
      <Card>{/* KPI 4 */}</Card>
    </div>
  </DashboardSection.Sidebar>
</DashboardSection>
```

### Example 2: Chart + Table Layout
```tsx
<DashboardSection layout="2-1">
  <DashboardSection.Primary>
    <Card>
      <CardHeader><CardTitle>Performance Over Time</CardTitle></CardHeader>
      <CardContent>
        <LineChart data={data} />
      </CardContent>
    </Card>
  </DashboardSection.Primary>

  <DashboardSection.Sidebar>
    <Card>
      <CardHeader><CardTitle>Top Performers</CardTitle></CardHeader>
      <CardContent>
        <Table>{/* Top 5 items */}</Table>
      </CardContent>
    </Card>
  </DashboardSection.Sidebar>
</DashboardSection>
```

### Example 3: Three Column Stats
```tsx
<DashboardSection>
  <DashboardSection.FullWidth>
    <div className="grid grid-cols-3 gap-6">
      <Card>{/* Stat 1 */}</Card>
      <Card>{/* Stat 2 */}</Card>
      <Card>{/* Stat 3 */}</Card>
    </div>
  </DashboardSection.FullWidth>
</DashboardSection>
```

---

## Refactoring Checklist

When converting existing layouts to use `DashboardSection`:

1. **Identify main content structure**
   - [ ] Is there primary content? → Use `Primary`
   - [ ] Is there a sidebar? → Use `Sidebar`
   - [ ] Is it full width? → Use `FullWidth`

2. **Check for internal splits**
   - [ ] Does primary content split 50/50? → Use `Split`
   - [ ] Does it need a divider? → Use `SplitLeft` with `withBorder`

3. **Verify responsive behavior**
   - [ ] Mobile: Does it stack properly? (Should be automatic)
   - [ ] Tablet: Does layout transition smoothly?
   - [ ] Desktop: Is the proportion correct?

4. **Fix height issues**
   - [ ] Is sidebar stretching? → Ensure using `Sidebar` component
   - [ ] Is chart looking lost? → Wrap in `CenteredContent`
   - [ ] Is content too wide? → Wrap in `ConstrainedWidth`

---

## Migration Example: Current Quiz Analytics

**Step 1: Import Component**
```tsx
import { DashboardSection, CenteredContent, ConstrainedWidth } from '../../components/admin/analytics/DashboardSection'
```

**Step 2: Replace Funnel Section**
```tsx
// Replace lines 628-710 in QuizAnalytics.tsx with:

<DashboardSection layout="2-1">
  <DashboardSection.Primary>
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <CardDescription>Step-by-step conversion breakdown with recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <DashboardSection.Split>
          <DashboardSection.SplitLeft>
            <QuizFunnelChart steps={funnelSteps} />
          </DashboardSection.SplitLeft>
          <DashboardSection.SplitRight>
            <FunnelActionItems steps={funnelSteps} />
          </DashboardSection.SplitRight>
        </DashboardSection.Split>
      </CardContent>
    </Card>
  </DashboardSection.Primary>

  <DashboardSection.Sidebar>
    {deviceData.length > 0 && (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Device Performance</CardTitle>
          <CardDescription className="text-xs">Conversion by device type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 py-0 pb-4">
          {deviceData.map((device) => (
            <div key={device.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium capitalize">{device.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{device.views} views</span>
                <Badge
                  variant={device.conversionRate >= 70 ? 'success' : device.conversionRate >= 50 ? 'warning' : 'destructive'}
                  className="min-w-[48px] justify-center text-xs"
                >
                  {device.conversionRate}%
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )}

    {sourceData.length > 0 && (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Top Sources</CardTitle>
          <CardDescription className="text-xs">Conversion by traffic source</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5 py-0 pb-4">
          {sourceData.slice(0, 5).map((source) => (
            <div key={source.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium capitalize">{source.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{source.views} views</span>
                <Badge
                  variant={source.conversionRate >= 70 ? 'success' : source.conversionRate >= 50 ? 'warning' : 'destructive'}
                  className="min-w-[48px] justify-center text-xs"
                >
                  {source.conversionRate}%
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )}
  </DashboardSection.Sidebar>
</DashboardSection>
```

---

## Component API Reference

### DashboardSection
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'2-1' \| '3-1' \| '1-1'` | `'2-1'` | Grid column distribution |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Child components |

### DashboardSection.Primary
| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Primary content |

### DashboardSection.Sidebar
| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Sidebar content (auto-stacks with `space-y-4`) |

### DashboardSection.Split
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `withDivider` | `boolean` | `true` | Show border divider between sections |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Split content |

### DashboardSection.SplitLeft
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `withBorder` | `boolean` | `true` | Show right border divider |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Left side content |

### DashboardSection.SplitRight
| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Right side content |

### DashboardSection.FullWidth
| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional CSS classes |
| `children` | `ReactNode` | Full-width content |

### CenteredContent
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `minHeight` | `number` | `400` | Minimum height in pixels |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Content to center |

### ConstrainedWidth
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `string` | `'3xl'` | Max width breakpoint (`sm` to `4xl`) |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Content to constrain |

---

## Best Practices

1. **Always use semantic components**
   ```tsx
   // ✅ Good
   <DashboardSection.Primary>

   // ❌ Bad
   <div className="lg:col-span-2">
   ```

2. **Combine with utility components for complex layouts**
   ```tsx
   <DashboardSection.Primary>
     <Card>
       <CardContent>
         <CenteredContent minHeight={500}>
           <ConstrainedWidth maxWidth="2xl">
             <Chart />
           </ConstrainedWidth>
         </CenteredContent>
       </CardContent>
     </Card>
   </DashboardSection.Primary>
   ```

3. **Let the Sidebar component handle spacing**
   ```tsx
   // ✅ Good - Sidebar handles space-y-4
   <DashboardSection.Sidebar>
     <Card>...</Card>
     <Card>...</Card>
   </DashboardSection.Sidebar>

   // ❌ Bad - Don't wrap in extra div
   <DashboardSection.Sidebar>
     <div className="space-y-4">
       <Card>...</Card>
     </div>
   </DashboardSection.Sidebar>
   ```

4. **Use appropriate layout ratios**
   - `2-1`: Primary chart + quick stats sidebar
   - `3-1`: Very prominent chart + minimal stats
   - `1-1`: Equal importance content (A/B comparison)

---

## Troubleshooting

**Issue: Sidebar still stretching in height**
```tsx
// ✅ Solution: Ensure using Sidebar component, not custom div
<DashboardSection.Sidebar>
  {/* content */}
</DashboardSection.Sidebar>
```

**Issue: Chart looks lost/lonely in card**
```tsx
// ✅ Solution: Use CenteredContent + ConstrainedWidth
<CenteredContent minHeight={400}>
  <ConstrainedWidth maxWidth="2xl">
    <Chart />
  </ConstrainedWidth>
</CenteredContent>
```

**Issue: Border not showing between split sections**
```tsx
// ✅ Solution: Ensure using SplitLeft with withBorder
<DashboardSection.SplitLeft withBorder={true}>
  {/* content */}
</DashboardSection.SplitLeft>
```

**Issue: Mobile layout broken**
```tsx
// ✅ Solution: DashboardSection handles mobile automatically
// Ensure children can stack (don't use fixed widths)
<DashboardSection>
  {/* Will stack on mobile */}
</DashboardSection>
```
