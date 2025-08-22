# Font Setup Guide - Varela Round

This project uses **Varela Round** as its primary font with a carefully crafted fallback stack for optimal cross-platform compatibility.

## Font Stack Used

```css
font-family: 'Varela Round', ui-rounded, 'Nunito Sans', 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

## Implementation Methods

### Method 1: CSS Import (Recommended)

Add this import to the top of your main CSS file:

```css
@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');

body {
  font-family: 'Varela Round', ui-rounded, 'Nunito Sans', 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

### Method 2: HTML Link

Add to your HTML `<head>` section:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet">
```

### Method 3: Next.js Google Fonts

```javascript
import { Varela_Round } from 'next/font/google'

const varelaRound = Varela_Round({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

// Use varelaRound.className in your components
```

### Method 4: Web Font Loader

```javascript
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Varela Round:400']
  }
});
```

## Complete Setup Example

```css
/* Import the font */
@import url('https://fonts.googleapis.com/css2?family=Varela+Round&display=swap');

/* Global font application */
* {
  font-family: 'Varela Round', ui-rounded, 'Nunito Sans', 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Body styling with project's background color */
body {
  font-family: 'Varela Round', ui-rounded, 'Nunito Sans', 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: #fff7e8;
}
```

## Font Stack Breakdown

| Font | Purpose |
|------|---------|
| `'Varela Round'` | Primary Google Font - friendly, rounded, modern |
| `ui-rounded` | System UI rounded font |
| `'Nunito Sans'` | Backup Google Font |
| `'SF Pro Rounded'` | Apple's rounded system font |
| `-apple-system` | Apple system font |
| `BlinkMacSystemFont` | WebKit system font |
| `'Segoe UI'` | Windows system font |
| `'Roboto'` | Android system font |
| `sans-serif` | Generic fallback |

## Benefits

- ✅ **Modern Appearance**: Rounded, friendly design
- ✅ **Cross-Platform**: Works on all operating systems
- ✅ **Performance**: `display=swap` ensures text visibility during font load
- ✅ **Fallback Safety**: Multiple fallbacks prevent font loading issues
- ✅ **Accessibility**: Maintains readability across all devices

## Additional Notes

- The `display=swap` parameter ensures text remains visible while the font loads
- This font stack provides excellent fallback support for users with slow internet or blocked Google Fonts
- Varela Round is a single-weight font (400/normal), so no additional weights need to be loaded
