# RoleColorAI Color Palette

## 🎨 Primary Role Colors

### Red - Drive & Passion
- **Hex**: `#EE2B2B`
- **RGB**: 238, 43, 43
- **CMYK**: 0, 82, 82, 7
- **Usage**: Drive · Passion · Boldness (Red Role)
- **Application**: Action buttons, error states, urgent notifications

### Yellow - Optimism & Energy
- **Hex**: `#FFDD33`
- **RGB**: 255, 221, 51
- **CMYK**: 0, 13, 80, 0
- **Usage**: Optimism · Energy · Leadership (Yellow Role)
- **Application**: Highlights, success states, call-to-action elements

### Blue - Logic & Strategy
- **Hex**: `#2B8CEE`
- **RGB**: 43, 141, 238
- **CMYK**: 82, 41, 0, 7
- **Usage**: Logic · Structure · Strategy (Blue Role)
- **Application**: Links, information states, navigation elements

### Green - Harmony & Growth
- **Hex**: `#27BD73`
- **RGB**: 39, 189, 115
- **CMYK**: 79, 0, 40, 26
- **Usage**: Harmony · Empathy · Growth (Green Role)
- **Application**: Confirmation states, progress indicators, positive feedback

## 🖤 Neutral Colors

### Steel Black
- **Hex**: `#242E42`
- **RGB**: 36, 46, 66
- **CMYK**: 45, 30, 0, 74
- **Usage**: Background accents, secondary text, professional tone variations
- **Application**: Card backgrounds, subtle borders, secondary content

### Pure Black
- **Hex**: `#000000`
- **RGB**: 0, 0, 0
- **CMYK**: 0, 0, 0, 100
- **Usage**: Headers, deep contrast, primary text
- **Application**: Main headings, body text, high-contrast elements

## 🎯 Color Usage Guidelines

### Primary Actions
- **Red (#EE2B2B)**: Delete, remove, critical actions
- **Yellow (#FFDD33)**: Primary CTA, important highlights
- **Blue (#2B8CEE)**: Secondary actions, informational elements
- **Green (#27BD73)**: Success, confirmation, positive actions

### Background Recommendations
- **Light Gray**: `#F8F9FA` - Main background
- **Off-White**: `#FFFFFF` - Card backgrounds
- **Steel Black**: `#242E42` - Dark mode backgrounds

### Accessibility
- All color combinations meet WCAG 2.1 AA standards
- High contrast ratios maintained for text readability
- Color-blind friendly palette with sufficient differentiation

## 🔄 Color Combinations

### Recommended Pairings
- **Red + Steel Black**: Bold, professional
- **Yellow + Pure Black**: High energy, clear contrast
- **Blue + Off-White**: Clean, trustworthy
- **Green + Light Gray**: Calm, positive

### Avoid
- Red + Green (accessibility concerns)
- Yellow + Off-White (low contrast)
- Multiple bright colors together (overwhelming)

## 📱 Digital Implementation

### CSS Variables
```css
:root {
  /* Primary Colors */
  --color-red: #EE2B2B;
  --color-yellow: #FFDD33;
  --color-blue: #2B8CEE;
  --color-green: #27BD73;
  
  /* Neutral Colors */
  --color-steel-black: #242E42;
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-light-gray: #F8F9FA;
}
```

### Opacity Variations
Each primary color includes opacity variations for subtle effects:
- 100% - Full opacity (default)
- 80% - Hover states
- 60% - Disabled states
- 20% - Background tints
- 10% - Subtle highlights
