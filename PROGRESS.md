# Help Center Progress Tracker

## Status Legend
- [ ] Not started
- [~] In progress
- [x] Complete

---

## Phase 1: Feature Research & Documentation

### 1. Getting Started (Kom igång)
- [x] Research system overview
- [x] Write article (SV) - docs/sv/getting-started.md
- [x] Write article (EN) - docs/en/getting-started.md

### 2. Orders (Ordrar)
- [x] Research order creation, fields, tags, statuses, utilities
- [x] Write article (SV) - docs/sv/orders.md
- [x] Write article (EN) - docs/en/orders.md

### 3. Offers/Agreements (Avtal)
- [x] Research offer templates, distribution, signing, web forms
- [x] Write article (SV) - docs/sv/offers.md
- [x] Write article (EN) - docs/en/offers.md

### 4. Calls/Telephony (Samtal)
- [x] Research call flow, lead lists, phone numbers, tags, co-hearing, utilities
- [x] Write article (SV) - docs/sv/calls.md
- [x] Write article (EN) - docs/en/calls.md

### 5. Contacts (Kontakter)
- [x] Research contact management, fields, tags, exclude lists, import
- [x] Write article (SV) - docs/sv/contacts.md
- [x] Write article (EN) - docs/en/contacts.md

### 6. Calendar (Kalender)
- [x] Research calendar features, sync, reminders, access
- [x] Write article (SV) - docs/sv/calendar.md
- [x] Write article (EN) - docs/en/calendar.md

### 7. Dashboard/Statistics (Statistik)
- [x] Research dashboards, readers, leaderboard, activity
- [x] Write article (SV) - docs/sv/dashboards.md
- [x] Write article (EN) - docs/en/dashboards.md

### 8. Products (Produkter)
- [x] Research categories, fields, pricing, finder
- [x] Write article (SV) - docs/sv/products.md
- [x] Write article (EN) - docs/en/products.md

### 9. Users & Teams (Användare & Team)
- [x] Research users, teams, roles, permissions, registration links, MFA
- [x] Write article (SV) - docs/sv/users-teams.md
- [x] Write article (EN) - docs/en/users-teams.md

### 10. Settings (Inställningar)
- [x] Research features, automation, projects, account settings
- [x] Write article (SV) - docs/sv/settings.md
- [x] Write article (EN) - docs/en/settings.md

---

## Phase 2: Build Viewer

- [x] Create HTML/CSS/JS viewer - viewer/index.html
- [x] Implement navigation sidebar with sections
- [x] Implement article rendering (markdown parser)
- [x] Implement language toggle (SV/EN)
- [x] Implement short/full version toggle
- [x] Style with Nunito font, #1665c0 primary, minimalist white design
- [x] Add smooth animations (fadeIn, transitions)
- [x] Mobile responsive with hamburger menu
- [x] Search/filter functionality
- [x] Welcome page with quick-access cards

---

## File Structure

```
help-center/
├── PROGRESS.md              (this file)
├── docs/
│   ├── sv/
│   │   ├── getting-started.md
│   │   ├── orders.md
│   │   ├── offers.md
│   │   ├── calls.md
│   │   ├── contacts.md
│   │   ├── calendar.md
│   │   ├── dashboards.md
│   │   ├── products.md
│   │   ├── users-teams.md
│   │   └── settings.md
│   └── en/
│       ├── getting-started.md
│       ├── orders.md
│       ├── offers.md
│       ├── calls.md
│       ├── contacts.md
│       ├── calendar.md
│       ├── dashboards.md
│       ├── products.md
│       ├── users-teams.md
│       └── settings.md
└── viewer/
    └── index.html           (single-page viewer app)
```

## Article Coverage Summary

Each article contains:
- **Short version** (Kort version) - 3-5 paragraph overview
- **Full guide** (Fullständig guide) - Comprehensive step-by-step documentation
- Both Swedish and English versions
- Information on prerequisites, permissions, settings, and related features

## How to View

Open `viewer/index.html` in a web browser. Requires serving from a web server
(not file://) for fetch to work. Quick option:

```bash
cd help-center/viewer && python3 -m http.server 8080
```

Then open http://localhost:8080
