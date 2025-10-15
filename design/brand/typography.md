# RoleColorAI Typography System

## 🔤 Primary Typeface: Poppins

Poppins is a geometric sans-serif typeface that perfectly embodies our clean, modern, and friendly design philosophy. It offers excellent readability across all devices and maintains the professional yet approachable tone of RoleColorAI.

### Font Weights Available

#### ExtraLight (200)
- **Usage**: Large display text, hero sections
- **Best for**: Minimal, elegant headlines
- **Example**: Main landing page hero text

#### Light (300)
- **Usage**: Subheadings, secondary content
- **Best for**: Supporting text that needs to be subtle
- **Example**: Feature descriptions, captions

#### Regular (400)
- **Usage**: Body text, paragraphs, general content
- **Best for**: Main readable content
- **Example**: Article text, form labels, descriptions

#### Medium (500)
- **Usage**: Emphasized body text, important labels
- **Best for**: Highlighting key information
- **Example**: Navigation items, button text, form field labels

#### Bold (700)
- **Usage**: Section headers, important headings
- **Best for**: Creating hierarchy and emphasis
- **Example**: Card titles, section headings, call-out text

#### Black (900)
- **Usage**: Main headers, brand elements
- **Best for**: Maximum impact and brand presence
- **Example**: Page titles, logo text, primary headings

## 📏 Typography Scale

### Headings
```css
h1 { font-size: 3.5rem; font-weight: 900; } /* Black */
h2 { font-size: 2.5rem; font-weight: 700; } /* Bold */
h3 { font-size: 2rem; font-weight: 700; }   /* Bold */
h4 { font-size: 1.5rem; font-weight: 500; } /* Medium */
h5 { font-size: 1.25rem; font-weight: 500; }/* Medium */
h6 { font-size: 1rem; font-weight: 500; }   /* Medium */
```

### Body Text
```css
.body-large { font-size: 1.125rem; font-weight: 400; } /* Regular */
.body-regular { font-size: 1rem; font-weight: 400; }   /* Regular */
.body-small { font-size: 0.875rem; font-weight: 400; } /* Regular */
.body-tiny { font-size: 0.75rem; font-weight: 400; }   /* Regular */
```

### Special Text
```css
.display { font-size: 4rem; font-weight: 200; }      /* ExtraLight */
.subtitle { font-size: 1.25rem; font-weight: 300; }  /* Light */
.caption { font-size: 0.75rem; font-weight: 300; }   /* Light */
.button { font-size: 1rem; font-weight: 500; }       /* Medium */
```

## 🎨 Typography + Color Combinations

### Headers with Role Colors
- **Red Headers**: Use for urgent or action-oriented sections
- **Yellow Headers**: Use for positive, energetic content
- **Blue Headers**: Use for informational, logical content
- **Green Headers**: Use for success states, growth-related content

### Text Hierarchy
```css
/* Primary Text */
.text-primary { color: #000000; } /* Pure Black */

/* Secondary Text */
.text-secondary { color: #242E42; } /* Steel Black */

/* Muted Text */
.text-muted { color: #6B7280; } /* Gray for less important text */

/* Role-specific Text */
.text-red { color: #EE2B2B; }
.text-yellow { color: #FFDD33; }
.text-blue { color: #2B8CEE; }
.text-green { color: #27BD73; }
```

## 📱 Responsive Typography

### Mobile (320px - 768px)
```css
h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
.display { font-size: 3rem; }
```

### Tablet (768px - 1024px)
```css
h1 { font-size: 3rem; }
h2 { font-size: 2.25rem; }
h3 { font-size: 1.75rem; }
.display { font-size: 3.5rem; }
```

### Desktop (1024px+)
```css
/* Use full scale as defined above */
```

## 🔗 Font Loading

### Google Fonts Implementation
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;700;900&display=swap" rel="stylesheet">
```

### CSS Font Stack
```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

## ✅ Typography Best Practices

### Line Height
- **Headers**: 1.2 - 1.3 (tight for impact)
- **Body Text**: 1.5 - 1.6 (comfortable reading)
- **Captions**: 1.4 (compact but readable)

### Letter Spacing
- **Headers**: -0.02em (slightly tighter)
- **Body Text**: 0 (default)
- **All Caps**: 0.05em (slightly wider)

### Contrast Requirements
- **Large Text (18px+)**: Minimum 3:1 contrast ratio
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **All combinations tested for WCAG AA compliance**

## 🎯 Usage Examples

### Landing Page Hero
```css
.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: 4rem;
  font-weight: 200; /* ExtraLight */
  color: #000000;
  line-height: 1.2;
}
```

### Section Headers
```css
.section-header {
  font-family: 'Poppins', sans-serif;
  font-size: 2.5rem;
  font-weight: 700; /* Bold */
  color: #EE2B2B; /* Role color */
  line-height: 1.3;
}
```

### Body Content
```css
.body-content {
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 400; /* Regular */
  color: #000000;
  line-height: 1.6;
}
```
