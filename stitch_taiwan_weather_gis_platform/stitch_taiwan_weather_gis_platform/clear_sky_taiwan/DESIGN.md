---
name: Clear Sky Taiwan
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3f4850'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system delivers an intuitive, friendly, and refreshing public atmospheric dashboard for citizens across Taiwan—from daily scooter commuters in Taipei to coastal farmers in Taitung. Its core identity is built on calm reassurance, effortless daily utility, and immediate accessibility across generations.

The visual style blends modern airy minimalism with soft, tactile civic clarity. Interfaces prioritize high legibility, natural atmospheric daylight, and comfortable breathing room over data-dense meteorological charting. By avoiding raw barometric pressures, complex dew-point equations, and developer metrics, the system translates environmental data into relatable, everyday living advisories: whether to carry an umbrella, air quality for outdoor workouts, laundry drying conditions, and UV protection needs.

## Colors

The color palette captures the natural daylight and atmospheric rhythms of Taiwan's subtropical landscape:

- **Primary (`#0284C7` - Pacific Azure):** Represents open skies and refreshing coastal breezes. Serves as the primary functional anchor for active interactive states, primary action buttons, key tabs, and daily overview headers.
- **Secondary (`#F59E0B` - Subtropical Sun):** A welcoming, warm golden amber used intentionally for daytime highlights, high UV indices, heat advisories, and comforting sunshine badges.
- **Tertiary (`#10B981` - Jade Canopy):** A tranquil botanical emerald that indicates pristine air quality (AQI Good), comfortable humidity tiers, and positive travel advisories.
- **Neutral (`#64748B` - Slate Mist):** Grounded atmospheric slate providing calm structure for secondary content, metric labels, and subtle outlines.

Surface hierarchies rely on daylight-inspired whites and soft sky-tinted neutrals (`#F0F9FF` to `#F8FAFC`) ensuring comfortable contrast under harsh outdoor sunlight on mobile displays. Error and extreme typhoon alerts utilize an urgent coral red (`#EF4444`) strictly reserved for safety-critical advisories.

## Typography

Typography prioritizes warmth, rounded approachability, and high-legibility optical clarity. 

- **Plus Jakarta Sans** provides lively, friendly geometry across all headlines, temperatures, and location banners. The wide counters and soft terminal shapes keep large numbers and civic district names feeling human and inviting rather than cold and clinical.
- **Be Vietnam Pro** drives all body content, weather summaries, hourly notes, and operational pills. Its humanist curves, generous x-height, and open apertures maintain superb legibility on lower-resolution mobile screens and under intense glare.

Traditional Chinese localization seamlessly meshes with these proportions, maintaining balanced vertical centers and equal breathing space alongside standard numerical temperature indicators (°C).

## Layout & Spacing

This design system uses a responsive fluid grid optimized for clean visual pacing, rapid thumb-reachability on mobile, and spacious dashboards on tablets and widescreen desktop displays:

- **Mobile (< 768px):** 4-column layout with `1rem` outer margins and `0.75rem` gutters. The primary current condition card spans full width at the top, followed by horizontal snap-scrolling carousels for 24-hour forecasts and quick-reference health pills.
- **Tablet (768px - 1024px):** 8-column layout with `1.5rem` margins and `1rem` gutters. Splits regional overview cards and multi-day weekly outlooks into balanced side-by-side modules.
- **Desktop (> 1024px):** 12-column layout capped at a maximum width of `1280px` with `2rem` margins and `1.5rem` gutters. Arranges hero current metrics, interactive island rainfall maps, and weekly outlooks in an open, low-density three-column array.

Vertical cadence relies strictly on an 8pt base unit scale (`0.25rem`, `0.5rem`, `1rem`, `1.5rem`, `2.5rem`), maintaining rhythmic predictability between metric badges and contextual advice paragraphs.

## Elevation & Depth

Visual hierarchy uses daylight-infused tonal layers combined with soft sky-tinted ambient shadows, rejecting sharp cutoffs and aggressive dark drop shadows.

- **Base Canvas:** Pale daylight tone (`#F8FAFC` to `#F0F9FF`) providing an open, breathing backdrop.
- **Level 1 (Cards & Containers):** Pure white (`#FFFFFF`) with a very soft ambient shadow: `0 4px 20px -2px rgba(2, 132, 199, 0.06), 0 2px 6px -1px rgba(100, 116, 139, 0.04)`. This creates a floating, cloud-like lift above the canvas.
- **Level 2 (Active States & Floating Panels):** Pure white (`#FFFFFF`) layered with an elevated azure tint: `0 12px 32px -4px rgba(2, 132, 199, 0.12), 0 4px 12px -2px rgba(100, 116, 139, 0.06)`. Used for regional picker popovers, bottom navigation bars, and expanded advisories.
- **Level 3 (Modal Alerts & Severe Warnings):** Applied to emergency typhoon or flash rain advisories: `0 20px 40px -8px rgba(15, 23, 42, 0.15)`.

Subtle ghost borders (`1px solid rgba(2, 132, 199, 0.08)`) are incorporated across cards to preserve boundary clarity during high screen brightness in direct sunlight.

## Shapes

The shape language reflects friendly, non-threatening, organic comfort. With a standard roundedness value of `2`:

- Standard component containers, weather condition cards, and dialog panels use a base corner radius of `0.5rem` (8px).
- Larger prominent modules, island map views, and hero weather status hubs scale up to `rounded-lg` (`1rem` / 16px).
- Full dashboard feature tiles and modal overlays feature `rounded-xl` (`1.5rem` / 24px) for a pillowy, inviting aesthetic.
- Interactive chips, quick status pills, and toggle buttons adopt fully circular pill caps (`9999px`) to invite touch and reinforce everyday approachability.

## Components

### Buttons
- **Primary Action:** Solid Pacific Azure (`#0284C7`) with white text, `0.5rem` border radius, and bold typography (`label-lg`). Includes a gentle hover lift with a subtle glow (`0 6px 16px rgba(2, 132, 199, 0.25)`).
- **Secondary Action:** Pale sky background (`#E0F2FE`) with Pacific Azure text and no border, providing a friendly, low-friction tap target.
- **Ghost/Tertiary:** Transparent fill with slate text (`#64748B`), turning `#F0F9FF` on hover.

### Weather Chips & Badges
- **Status Pills:** Compact `9999px` full-rounded badges displaying conversational statuses (e.g., "Bring an Umbrella", "Ideal Laundry Weather", "Low UV").
- Toned dynamically: Jade Canopy tint (`#ECFDF5` background, `#047857` text) for optimal conditions; Subtropical Sun tint (`#FEF3C7` background, `#B45309` text) for warnings; Azure tint (`#E0F2FE` background, `#0369A1` text) for standard rain/breeze updates.

### Cards & Weather Tiles
- **Hero Condition Card:** Dominant white card featuring soft `1rem` radius, containing district location selector, bold hero temperature (`Plus Jakarta Sans`), large illustrative natural weather iconography, and simple localized summaries (e.g., "Expect light afternoon showers around Da'an Park").
- **Hourly Forecast Tile:** Horizontal card with seamless scroll, displaying time, friendly weather glyph, probability percentage, and temperature trendline.
- **Lifestyle Advisory Card:** Compact square tiles using intuitive lifestyle icons (umbrella, t-shirt, sunglasses, scooter) alongside simple two-word status indicators.

### Inputs & District Search
- **Search Bar:** Generous `3rem` (48px) height with soft `0.5rem` radius, daylight background (`#FFFFFF`), faint border (`#E2E8F0`), and prominent search icon. Active state introduces a `#0284C7` ring with soft blue drop glow.
- **Dropdown / County Switcher:** Friendly select modal with high touch targets (minimum 48px height per city/township item) and checkmark indicators.

### Checkboxes & Toggle Controls
- **Toggle Switches:** Used for switching between hourly/daily modes or setting rain notification reminders. Smooth rounded pill shape (`9999px`) with an azure fill when active and an animated soft white thumb.
- **Radio & Selection Lists:** Circular radios with soft azure fill and an inner white halo; row items are encased in separate pillowy rounded cards with generous padding for older citizens.