# UI Architecture Documentation

## Overview

This application uses **Tailwind CSS v4** with **Shadcn/ui** component library for a modern, accessible, and maintainable UI architecture.

## Tech Stack

- **Tailwind CSS v4** - Utility-first CSS framework with new @import syntax
- **Shadcn/ui** - Copy-paste component library built on Radix UI
- **Radix UI** - Unstyled, accessible UI components
- **React 19.1.1** - UI library
- **TypeScript** - Type safety
- **Vite 7.1.7** - Build tool and dev server

## Color Palette

The application uses a custom color palette inspired by Romanian legal tradition:

### Primary Colors
- **Prussian Blue** (`#003049`) - Primary dark blue for headers, buttons, active states
- **Air Blue** (`#669bbc`) - Secondary light blue for accents and gradients
- **Papaya Whip** (`#fdf0d5`) - Light cream background for content areas
- **Fire Brick** (`#c1121f`) - Error/destructive actions
- **Barn Red** (`#780000`) - Dark red accent for important elements

### Semantic Colors (index.css)
The color system uses oklch() color space for better color perception:

```css
:root {
  --background: oklch(0.98 0.01 85);     /* Light cream background */
  --foreground: oklch(0.25 0.08 240);    /* Dark blue text */
  --primary: oklch(0.25 0.08 240);       /* Prussian blue */
  --secondary: oklch(0.75 0.05 240);     /* Air blue */
  --destructive: oklch(0.50 0.20 20);    /* Fire brick red */
  --muted: oklch(0.95 0.02 240);         /* Subtle backgrounds */
  --accent: oklch(0.92 0.03 240);        /* Hover states */
  --border: oklch(0.90 0.02 240);        /* Borders and dividers */
}
```

## Component Library

### Shadcn/ui Components Used

All components are located in `src/components/ui/`:

#### Layout & Structure
- **Card** - Container component with header, content, and footer sections
  - Used for: Case display, assessment module, chat interface, code reference panel
  - Variants: Default, with gradients, rounded corners
- **Sheet** - Slide-in drawer for mobile navigation ✨ NEW
  - Used for: Mobile sidebar navigation from left edge
  - Features: Backdrop overlay, smooth animations, keyboard accessible
- **Collapsible** - Expandable/collapsible content sections ✨ NEW
  - Used for: Nested navigation categories
  - Features: Smooth transitions, accessible triggers

#### Forms & Inputs
- **Button** - Interactive button with multiple variants
  - Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
  - Sizes: `default`, `sm`, `lg`, `icon`
- **Input** - Text input field with consistent styling
- **Textarea** - Multi-line text input for solutions and descriptions ✨
  - Used in: Case Generator (context form), user submissions
- **Label** - Accessible form labels
- **Select** - Dropdown select with grouped options
  - Used in: SignUp (university selection), Case Generator (week/subcategory selection)
- **Table** - Data table with header, body, and cell components ✨ NEW
  - Used in: AdminPanel (users table)
  - Features: Responsive, overflow scroll on mobile, consistent styling

#### Navigation & Interaction
- **DropdownMenu** - Accessible dropdown menu for user actions
- **Tabs** - Tab navigation (used in code reference panel for Civil/Constitution/Criminal codes)
- **Badge** - Labels for difficulty levels, verification status, version numbers
- **Tooltip** - Contextual help tooltips ✨ NEW
  - Accessible, keyboard navigable
  - Features: Auto-positioning, focus management

#### Content Display
- **ScrollArea** - Custom scrollable areas with styled scrollbars
  - Used in: Sidebar categories, chat messages, code display
- **Skeleton** - Loading state placeholders ✨ NEW
  - Used for: Case content, case lists, articles
  - Features: Animated pulse effect, various sizes

#### Notifications
- **Sonner (Toast)** - Toast notification system ✨
  - Used for: Assessment results, error messages, success confirmations
  - Features: Auto-dismiss, rich colors, positioned top-right
  - Variants: Success, error, info
- **Alert** - Inline alert/notification component ✨ NEW
  - Used in: Case Generator (error messages), form validation feedback
  - Variants: Default, destructive
  - Features: Icon support, dismissible

## Layout Patterns

### Full-Screen Dashboard Layout

```typescript
<div className="flex flex-col h-screen bg-background">
  <header className="sticky top-0 z-50 w-full border-b">...</header>
  <div className="flex flex-1 overflow-hidden h-full">
    <aside className="w-80 border-r">...</aside>        {/* Left sidebar */}
    <main className="flex-1 overflow-y-auto">...</main> {/* Main content */}
    <aside className="w-[450px] border-l">...</aside>  {/* Right sidebar */}
  </div>
</div>
```

### Three-Column Layout
- **Left Sidebar (w-80)**: Law categories navigation with collapsible sections
- **Main Content (flex-1)**: Case display and assessment module
- **Right Sidebar (w-[450px])**: Legal code reference + AI chat

### Card-Based Content

All major sections use Card components for consistent visual hierarchy:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## Icon System ✨ NEW

### Lucide React Icons

The application uses **Lucide React** for all icons, replacing emojis for better cross-platform consistency and accessibility.

#### Icon Usage Patterns

```typescript
import { Check, AlertCircle, Menu, X, Bot, User } from 'lucide-react';

// Standard icon with sizing
<Check className="h-4 w-4" />

// Icon with color
<Check className="h-4 w-4 text-green-600" />

// Inline icon with text
<span className="flex items-center gap-2">
  <Bot className="h-5 w-5" />
  AI Assistant
</span>

// Animated icon (rotation)
<ChevronRight className={`h-4 w-4 transition-transform ${
  expanded ? 'rotate-90' : ''
}`} />
```

#### Icons Replaced (35+ across application)

**Dashboard:**
- Difficulty indicators: 🟢🟡🔴 → Colored dots (`bg-green-500`, `bg-yellow-500`, `bg-red-500`)
- Section headers: ✅📝❓🔍💡 → CheckCircle, FileText, HelpCircle, Eye, Lightbulb
- Navigation: → ChevronRight, ChevronDown, ChevronLeft, Menu, X

**Case Generator:**
- Validation: ⚠️✓ → AlertCircle, Check
- Actions: 🤖✨✏️🔄 → Bot, Sparkles, Edit, RefreshCw
- Status: 📋 → ClipboardList

**Reporting:**
- Headers: 📄💬📚 → FileText, MessageCircle, BookOpen
- Messages: 👤🤖 → User, Bot
- Status: ✓⏳ → Check, Clock

**Benefits:**
- Consistent appearance across all platforms and browsers
- Scalable SVG icons (sharp at any size)
- Accessible (proper ARIA labels)
- Themeable with CSS
- Smaller bundle size than emoji fonts

## Key Design Patterns

### 1. Collapsible Navigation

The sidebar uses nested collapsible sections with proper state management:

```typescript
const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);

// Visual feedback with conditional classes
className={`${expandedCategory === domain.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
```

### 2. Message Bubbles (Chat UI)

Chat messages use flexbox alignment for user/bot distinction:

```typescript
<div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
  <div className={`max-w-[85%] rounded-lg px-4 py-2 ${
    message.role === 'user'
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted text-foreground'
  }`}>
    {message.content}
  </div>
</div>
```

### 3. Loading States ✨ UPDATED

#### Skeleton Loaders
Professional skeleton loaders for better perceived performance:

```typescript
{/* Case content skeleton */}
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-48" />
  </CardHeader>
  <CardContent className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-4/5" />
  </CardContent>
</Card>

{/* List item skeleton */}
<li className="px-2 py-1.5">
  <div className="flex items-center gap-1.5">
    <Skeleton className="h-5 w-8" />
    <Skeleton className="h-5 flex-1" />
  </div>
</li>
```

#### Spinner Animations
Consistent loading indicators using Tailwind animations:

```typescript
{isLoading && (
  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
)}
```

### 4. Status Badges

Difficulty levels and verification status use Badge variants:

```typescript
<Badge variant="secondary">{difficulty}</Badge>
<Badge className="bg-green-600">✓ Verificat</Badge>
```

## Responsive Design ✨ UPDATED

### Dashboard Mobile Implementation

The Dashboard now has full mobile support with responsive layouts:

#### Mobile Navigation (Sheet Component)
```typescript
{/* Mobile menu button - visible only on mobile */}
<Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-80 p-0 flex flex-col">
    {renderSidebarContent()}  {/* Full sidebar content in drawer */}
  </SheetContent>
</Sheet>
```

#### Responsive Sidebar Strategy
```typescript
{/* Desktop sidebar - hidden on mobile */}
<aside className="hidden lg:flex w-80 border-r flex-col">
  {renderSidebarContent()}
</aside>

{/* Right sidebar (code + chat) - hidden on mobile */}
<aside className="hidden lg:flex w-[450px] border-l flex-col">
  {/* Code reference and chat */}
</aside>

{/* Collapsed sidebar toggle - hidden on mobile */}
<Button className="hidden lg:flex fixed left-2 top-20">
  <ChevronRight />
</Button>
```

### Breakpoints Used

- **Mobile**: `< 1024px` - Single column, Sheet navigation
- **Desktop**: `≥ 1024px` (`lg:`) - Three-column layout with sidebars

### Other Responsive Components

- **SignUp form** uses responsive grid: `grid md:grid-cols-2` (stacks on mobile)
- **Auth pages** use responsive padding: `p-4` and `max-w-md` / `max-w-2xl`
- **Cards** adapt with responsive padding and gaps

## File Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── Dashboard.tsx    # Main application interface
│   │   ├── Login.tsx        # Authentication
│   │   └── SignUp.tsx       # Registration
│   ├── lib/
│   │   └── utils.ts         # cn() utility for class merging
│   ├── index.css            # Tailwind directives + theme
│   └── App.css              # Minimal global styles
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS with @tailwindcss/postcss
└── components.json          # Shadcn/ui configuration
```

## Styling Guidelines

### 1. Use Utility Classes

Prefer Tailwind utilities over custom CSS:

```typescript
// Good
<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary">

// Avoid
<div style={{ display: 'flex', padding: '8px 16px' }}>
```

### 2. Component Composition

Build complex UIs by composing Shadcn/ui components:

```typescript
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <span>🤖</span> AI Assistant
    </CardTitle>
  </CardHeader>
  <CardContent>
    <ScrollArea className="h-[400px]">
      {/* Content */}
    </ScrollArea>
  </CardContent>
</Card>
```

### 3. Consistent Spacing

Use Tailwind's spacing scale consistently:
- `gap-2` (0.5rem) for tight spacing
- `gap-4` (1rem) for standard spacing
- `space-y-4` for vertical stacks
- `p-4`, `px-4`, `py-2` for padding

### 4. State Variants

Use conditional classes for interactive states:

```typescript
<button className={`px-4 py-2 rounded-md transition-colors ${
  isActive
    ? 'bg-primary text-primary-foreground'
    : 'bg-secondary hover:bg-secondary/80'
}`}>
```

## Dark Mode Support

The theme includes dark mode variables (not yet implemented in UI):

```css
.dark {
  --background: oklch(0.18 0.06 240);
  --foreground: oklch(0.95 0.01 240);
  /* ... */
}
```

To enable dark mode:
1. Add dark mode toggle button
2. Use `className="dark"` on root element
3. All semantic colors will automatically adapt

## Accessibility ✨ NEW

### Focus Management

All interactive elements now have visible focus indicators for keyboard navigation:

```typescript
// Focus-visible rings for accessibility
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">

// Examples:
{/* Logo/navigation button */}
<button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded">

{/* Search clear button */}
<button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded">

{/* Category navigation buttons */}
<button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1">
```

### Keyboard Navigation

- **Tab**: Navigate through all interactive elements
- **Enter/Space**: Activate buttons and toggles
- **Escape**: Close Sheet drawers and dialogs
- **Arrow keys**: Navigate within select menus

### ARIA Labels

- All icons include proper semantic context through parent elements
- Buttons have descriptive `title` attributes
- Form inputs have associated labels

## Performance Considerations ✨ UPDATED

### 1. Bundle Size
- Tailwind v4 purges unused CSS automatically
- Only used Shadcn/ui components are included
- **Current bundle: 792.04 KB (gzipped: 231.03 KB)**
  - Session 1: 777.84 KB (gzipped: 228.92 KB)
  - Session 2: 788.04 KB (gzipped: 230.51 KB)
  - Session 3: 792.04 KB (gzipped: 231.03 KB)
  - Total increase: +14 KB (+2 KB gzipped) from all new Shadcn/ui components
- CSS: 54.12 KB (gzipped: 9.44 KB)
- Note: Bundle includes Lucide React icons and 8 Shadcn/ui components

### 2. CSS Organization
- All Tailwind utilities in `index.css`
- Minimal custom CSS in `App.css` (16 lines)
- Component-specific styles via Tailwind classes

### 3. Build Optimization
- Production builds minify CSS and JS
- PostCSS processes Tailwind directives
- Vite handles code splitting
- Warning: Main chunk >500KB - consider code splitting for routes

## Migration Notes

### From Vanilla CSS to Tailwind + Shadcn/ui

**What Changed:**
- Removed 4000+ lines of custom CSS from `App.css`
- Replaced custom form styles with Shadcn/ui Input, Label, Textarea
- Replaced custom buttons with Shadcn/ui Button variants
- Replaced custom cards with Shadcn/ui Card component
- Replaced custom dropdowns with Shadcn/ui DropdownMenu
- Replaced custom tabs with Shadcn/ui Tabs

**Key Benefits:**
- Consistent design system across all components
- Accessible components out of the box (via Radix UI)
- Smaller CSS bundle (removed 99% of custom CSS)
- Faster development with utility classes
- Better maintainability with TypeScript components

## Testing

### Type Checking
```bash
npx tsc --noEmit
```

### Production Build
```bash
npm run build
```

### Dev Server
```bash
npm run dev
```

## Recent Improvements ✨

### Session 1: Dashboard & Core UI (5 tasks completed)
1. ✅ **Mobile Sheet Navigation**
   - Implemented Sheet drawer for mobile sidebar
   - Slides from left with backdrop overlay
   - Auto-closes when selecting a case
   - Full sidebar content duplicated in mobile view

2. ✅ **Responsive Layout**
   - Left sidebar: `hidden lg:flex` - Hidden on mobile
   - Right sidebar: `hidden lg:flex` - Hidden on mobile
   - Collapse button: `hidden lg:flex` - Hidden on mobile
   - Mobile-first breakpoints at 1024px

3. ✅ **Skeleton Loading States**
   - Case content: 5 card skeletons with animated pulse
   - Case lists: 3 item skeletons with badge placeholders
   - Improves perceived performance

4. ✅ **Focus States for Accessibility**
   - Added `focus-visible:ring` to all interactive elements
   - Logo, search, navigation, categories, cases
   - Assessment module buttons
   - Proper keyboard navigation support

5. ✅ **Toast Notifications**
   - Sonner toast system integrated
   - Success/error toasts for assessment results
   - Error handling for chat and AI detection
   - Top-right positioning with auto-dismiss

### Icon System Migration (8 tasks completed)
6. ✅ **Replaced 35+ Emojis with Lucide Icons**
   - Dashboard: 10 emojis → CheckCircle, FileText, HelpCircle, Eye, Lightbulb, etc.
   - Case Generator (7 files): 15 emojis → AlertCircle, Check, Bot, Sparkles, etc.
   - Reporting: 7 emojis → FileText, MessageCircle, User, Bot, Check, Clock
   - SignUp: 2 emojis → Check, X icons
   - AdminPanel: Already clean (no emojis)

### Build & Testing
7. ✅ **Production Build Verified**
   - Build successful: 777.84 KB (gzipped: 228.92 KB)
   - CSS: 44.72 KB (gzipped: 8.19 KB)
   - TypeScript: Zero errors
   - All components working

8. ✅ **Documentation Updated (Session 1)**
   - Added new components (Sheet, Skeleton, Sonner, Collapsible, Tooltip)
   - Documented responsive patterns
   - Icon system migration guide
   - Accessibility improvements
   - Bundle size metrics

### Session 2: Mobile Features & Full Page Conversions (6 tasks completed)

9. ✅ **Dashboard Mobile FABs**
   - Added floating action buttons for mobile
   - AI Chat FAB: Opens Sheet drawer from bottom (80vh)
   - Code Reference FAB: Opens Sheet with tabbed code viewer
   - Positioned bottom-right with z-40
   - Full functionality preserved on mobile

10. ✅ **Case Generator Conversion to Tailwind + Shadcn/ui**
    - Converted all 7 generator components:
      - `index.tsx` - Main flow with step progress indicator
      - `DomainSelector.tsx` - Card-based domain selection
      - `CategoryGrid.tsx` - Checkbox grid with bulk actions
      - `ArticleSelector.tsx` - Input + Badge list for articles
      - `ContextForm.tsx` - Textarea with tips and preview
      - `ConfigurationPanel.tsx` - Difficulty cards + Select dropdowns
      - `GeneratedCaseEditor.tsx` - Already had icons from Session 1
    - Mobile responsive with `sm:` and `lg:` breakpoints
    - Gradient background, professional step indicators
    - Alert component for error messages

11. ✅ **Reporting Page Conversion to Tailwind + Shadcn/ui**
    - Converted entire reporting interface
    - Sticky header with Badge and responsive buttons
    - Stats cards with responsive grid (3 columns)
    - Two-column layout (stacks on mobile: `lg:grid-cols-2`)
    - Submitted Solutions: Card + ScrollArea (h-[400px])
    - AI Conversations: Expandable cards with message bubbles
    - Cases Overview: Grouped by date with status badges
    - Proper mobile responsiveness throughout

12. ✅ **Mobile Responsiveness Built-In**
    - Case Generator: Responsive grids, stacked forms on mobile
    - Reporting: Two-column layout becomes single column
    - All components use responsive Tailwind classes
    - Touch-friendly sizing and spacing

13. ✅ **Production Build & Testing**
    - Build successful: 788.04 KB (gzipped: 230.51 KB)
    - TypeScript: Zero errors
    - All pages working correctly
    - Minor bundle increase (+10 KB) from new components

14. ✅ **Documentation Updated (Session 2)**
    - Added Alert and updated Textarea documentation
    - Updated bundle size metrics
    - Documented Case Generator conversion
    - Documented Reporting conversion
    - Updated responsive design patterns

### Session 3: AdminPanel Conversion (2 tasks completed)

15. ✅ **AdminPanel Conversion to Tailwind + Shadcn/ui**
    - Replaced all placeholder CSS classes and inline styles
    - Sticky header with responsive layout and badges
    - Table component for users list with proper styling
    - Card-based placeholder sections (Analytics, Case Management, Settings)
    - Responsive grid layout (1/2/3 columns)
    - Access denied screen with Shield icon
    - Generator button with gradient styling
    - Mobile responsive throughout

16. ✅ **Production Build & Final Bundle**
    - Build successful: 792.04 KB (gzipped: 231.03 KB)
    - CSS: 54.12 KB (gzipped: 9.44 KB)
    - TypeScript: Zero errors
    - Table component added (+4 KB increase)
    - All pages working correctly

### Summary Statistics
- **Total Files Modified**: 21+ component files across 3 sessions
- **New Components Added**: 8 Shadcn/ui components (Sheet, Skeleton, Sonner, Collapsible, Tooltip, Alert, Textarea, Table)
- **Icons Migrated**: 35+ emojis → Lucide React icons
- **Pages Converted**: Dashboard, Case Generator (7 files), Reporting, AdminPanel
- **Mobile Features**: Sheet navigation, FAB buttons, responsive layouts throughout
- **Accessibility**: Focus states on all interactive elements
- **Build Status**: ✅ Passing (TypeScript zero errors)
- **Final Bundle Size**: 792.04 KB (231.03 KB gzipped)

## Future Improvements

1. **Mobile Optimization** ✅ COMPLETE
   - ✅ Add responsive sidebar toggles
   - ✅ Implement mobile navigation menu
   - ✅ Optimize layout for small screens
   - ✅ Mobile FAB buttons for AI chat and code reference
   - ✅ Case Generator mobile responsiveness
   - ✅ Reporting page mobile responsiveness

2. **Dark Mode**
   - Add dark mode toggle
   - Test all components in dark mode
   - Ensure proper contrast ratios

3. **Accessibility** ✅ PARTIALLY COMPLETE
   - ✅ Add keyboard navigation hints
   - ✅ Implement focus management
   - ⏳ Test with screen readers
   - ⏳ Comprehensive keyboard navigation testing

4. **Performance**
   - Implement code splitting for routes (recommended by Vite)
   - Lazy load heavy components
   - Optimize bundle size further
   - Consider dynamic imports for Case Generator and Reporting

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [React 19 Documentation](https://react.dev/)
