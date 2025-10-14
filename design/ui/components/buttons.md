# RoleColorAI Button Components

## 🎯 Button Design Philosophy

Buttons in RoleColorAI are designed to be clear, accessible, and aligned with our role-based color system. Each button type serves a specific purpose and uses appropriate colors to guide user behavior.

## 🔴 Primary Buttons

### Red Buttons - Critical Actions
**Usage**: Delete, remove, critical confirmations
```css
.btn-red {
  background-color: #EE2B2B;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-red:hover {
  background-color: rgba(238, 43, 43, 0.8);
  transform: translateY(-1px);
}

.btn-red:active {
  transform: translateY(0);
}
```

### Yellow Buttons - Primary Actions
**Usage**: Main CTAs, submit forms, primary actions
```css
.btn-yellow {
  background-color: #FFDD33;
  color: #000000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-yellow:hover {
  background-color: rgba(255, 221, 51, 0.8);
  transform: translateY(-1px);
}
```

### Blue Buttons - Secondary Actions
**Usage**: Information, secondary actions, navigation
```css
.btn-blue {
  background-color: #2B8CEE;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-blue:hover {
  background-color: rgba(43, 140, 238, 0.8);
  transform: translateY(-1px);
}
```

### Green Buttons - Success Actions
**Usage**: Confirm, save, success states
```css
.btn-green {
  background-color: #27BD73;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-green:hover {
  background-color: rgba(39, 189, 115, 0.8);
  transform: translateY(-1px);
}
```

## 🔘 Secondary Buttons

### Outline Buttons
**Usage**: Secondary actions, cancel buttons
```css
.btn-outline {
  background-color: transparent;
  color: #242E42;
  border: 2px solid #242E42;
  padding: 10px 22px; /* Slightly less padding to account for border */
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background-color: #242E42;
  color: #FFFFFF;
  transform: translateY(-1px);
}
```

### Ghost Buttons
**Usage**: Subtle actions, tertiary options
```css
.btn-ghost {
  background-color: transparent;
  color: #242E42;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background-color: rgba(36, 46, 66, 0.1);
  transform: translateY(-1px);
}
```

## 📏 Button Sizes

### Large Buttons
**Usage**: Hero sections, main CTAs
```css
.btn-large {
  padding: 16px 32px;
  font-size: 1.125rem;
  border-radius: 10px;
}
```

### Medium Buttons (Default)
**Usage**: Standard actions, forms
```css
.btn-medium {
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 8px;
}
```

### Small Buttons
**Usage**: Compact spaces, secondary actions
```css
.btn-small {
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 6px;
}
```

### Icon Buttons
**Usage**: Actions with icons only
```css
.btn-icon {
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px; /* Accessibility minimum */
  min-height: 44px;
}
```

## 🔄 Button States

### Disabled State
```css
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn:disabled:hover {
  transform: none;
  background-color: inherit;
}
```

### Loading State
```css
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## 🎨 Button Groups

### Horizontal Button Group
```css
.btn-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-group-compact {
  display: flex;
  gap: 8px;
  align-items: center;
}
```

### Vertical Button Group
```css
.btn-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;
}
```

## ♿ Accessibility

### Requirements
- Minimum 44px touch target for mobile
- 4.5:1 color contrast ratio
- Focus indicators visible
- Screen reader friendly labels

### Focus States
```css
.btn:focus {
  outline: 2px solid #2B8CEE;
  outline-offset: 2px;
}

.btn:focus:not(:focus-visible) {
  outline: none;
}
```

## 📱 Responsive Behavior

### Mobile Adaptations
```css
@media (max-width: 768px) {
  .btn {
    padding: 14px 20px;
    font-size: 1rem;
    min-height: 44px;
  }
  
  .btn-large {
    padding: 18px 24px;
    font-size: 1.125rem;
  }
  
  .btn-small {
    padding: 10px 16px;
    font-size: 0.875rem;
  }
}
```

## 🎯 Usage Guidelines

### Button Hierarchy
1. **Primary Action**: One yellow button per screen/section
2. **Secondary Actions**: Blue or outline buttons
3. **Destructive Actions**: Red buttons (use sparingly)
4. **Success Actions**: Green buttons for confirmations

### Best Practices
- Use clear, action-oriented labels
- Maintain consistent spacing and sizing
- Provide immediate visual feedback
- Consider loading states for async actions
- Group related actions together
- Ensure sufficient contrast on all backgrounds

### Common Button Combinations
- **Save + Cancel**: Green primary + Outline secondary
- **Submit + Reset**: Yellow primary + Ghost secondary  
- **Delete + Cancel**: Red primary + Outline secondary
- **Next + Previous**: Blue primary + Outline secondary
