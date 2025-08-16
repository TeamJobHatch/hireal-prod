# Claude Instructions: Converting CSS + JSX to Tailwind JSX

## Task
Convert a React component from separate CSS file + JSX to single JSX file using Tailwind CSS.

## Critical Success Steps

### 1. ALWAYS Start with Inline Styles First
```jsx
// Don't start with Tailwind - start with this:
<div style={{ backgroundColor: '#fff7e8', padding: '24px' }}>
```
**Why:** Verifies component renders before dealing with Tailwind issues.

### 2. Add Debug Header
```jsx
<div style={{ fontSize: '48px', color: 'red', textAlign: 'center' }}>
  🚀 COMPONENT WORKING! 🚀
</div>
```
**Why:** Immediate visual confirmation of rendering.

### 3. Convert CSS Values to Inline Styles
```css
/* From CSS */
.hero { background-color: #fff7e8; padding: 4rem 0; }

/* To Inline */
style={{ backgroundColor: '#fff7e8', padding: '64px 0' }}
```

### 4. Only After Inline Styles Work - Convert to Tailwind
```jsx
// Inline working? Now convert:
style={{ backgroundColor: '#fff7e8', padding: '64px 0' }}
// Becomes:
className="bg-orange-50 py-16"
```

### 5. Test Tailwind Incrementally
- Convert one section at a time
- Keep debug header until everything works
- If any section breaks, revert to inline styles

## Common Pitfalls to Avoid
- ❌ Starting with Tailwind classes immediately
- ❌ Converting entire file at once
- ❌ Assuming Tailwind is configured correctly
- ❌ Not testing component rendering first

## Emergency Fallback
If Tailwind fails, keep inline styles. Working inline styles > broken Tailwind.

## Success Pattern
1. Inline styles → Component renders ✅
2. Debug header → Visual confirmation ✅  
3. Section-by-section → Gradual conversion ✅
4. Remove debug → Clean final result ✅
