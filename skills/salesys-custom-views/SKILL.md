---
name: salesys-custom-views
description: Use when building, editing, or deploying custom views in SaleSys (egna vyer, vymallar, inställningsvyer) - standalone HTML/Handlebars panels in the navigation or settings. Covers the native components (Field, SecondaryButton, SettingsList, Transition with boolLock/lock, Modal), the window.form API, settings via presetState, rights, the reference-object storage pattern, and the best practices that keep a view working in production.
---

# SaleSys Custom Views (Egna vyer)

A **vy** is a standalone HTML fragment that SaleSys renders as a panel inside `app.salesys.se`, reachable
from the top navigation or from Inställningar. No framework and no build step: one HTML file with an
inline `<style>` and `<script>`, calling the SaleSys API as the logged-in user.

Two layers:
- **View template / vymall** (`/api/users/view-presets-v1`, admin): the reusable template with `html`,
  optional `settingsHtml`, icon, and custom rights.
- **Org view** (`/api/users/views-v1`): one instance per organisation, pointing at a template via `presetId`
  (or carrying its own `html`). It decides placement and which teams and roles see it.
  URL: `https://app.salesys.se/views/<viewId>`.

## First decision: native or raw JS?

Pick before writing anything. The two styles do not mix well.

| | **Native (Handlebars + components)** | **Raw JS** |
|---|---|---|
| Best for | Forms, settings panels, list-to-detail CRUD, anything that should look like SaleSys | Dashboards, games, canvas, heavy realtime, custom layouts the components cannot express |
| `{{ }}` | Yes, it is the template language | **Never.** The file is rendered through Handlebars first, so stray braces break it |
| Components | `<Field>`, `<CheckboxField>`, `<PrimaryButton>`, `<SecondaryButton>`, `<SettingsList>`, `<Tooltip>`, `<Transition>`, modals | Plain HTML and your own CSS, themed with SaleSys CSS variables |
| State | `window.form.setState` / `custom`, `setSettings` / `settings`, `addHook` | Your own variables and a poll loop |
| Auth | `window.getAccessToken()` | The `s2_utoken` cookie |

**Rule of thumb:** a form or settings screen should be native, because you get validation, theming, and the
SaleSys look for free. An interactive app that fights the component model should be raw JS.

## The essentials in one screen

```html
<Field label="Namn" required value="{{custom.name}}"
       onChange="window.form.setState({ name: value })"></Field>

<Transition boolLock="{{custom.showAdvanced}}">
  {{#if custom.showAdvanced}}
    <Field label="Webhook-URL" value="{{custom.url}}" onChange="window.form.setState({ url: value })"></Field>
  {{else}}
    <SecondaryButton icon="cog" onClick="window.form.setState({ showAdvanced: true })">Avancerat</SecondaryButton>
  {{/if}}
</Transition>

<script>
  window.form.addHook('set button', function () {
    window.form.setButton('save', {
      children: 'Spara', icon: 'check', weight: 'primary',
      disabled: !window.form.custom.name,
      onClick: function () { window.save(); }
    });
  });
</script>
```

- **`<Transition>`** animates content that appears, disappears, or swaps. `boolLock="{{flag}}"` re-animates
  when a boolean flips; `lock="{{value}}"` re-animates when any value changes (wizard steps, tabs);
  `overflowHiddenDuringTransition="true"` clips overflow mid-animation. Wrap every region that changes,
  not the whole view.
- **Change state, never the DOM.** The template re-renders on every `setState` / `setSettings`.
- **Hooks re-run after every state change.** Only write when the value actually changed, or you loop.
- **Guard real side effects** with `if (window.form.preview) return;` so the admin editor's preview does not
  send SMS, delete data, or call webhooks.

## Rules for every view

- **No in-view title.** The app already shows the view name. Use `setSubtitle` and `setButton` instead.
- **Never set the page width.** No `max-width`, fixed width, or `margin: 0 auto` on the root. Lay out fluidly.
- **No emojis.** FontAwesome 5 free icons (`<i class="fas fa-check"></i>`) or inline SVG.
- **Theme via CSS variables with fallbacks**, for example `var(--color-primary, #1565c0)`, so dark mode works.
- **Stop timers when the user leaves** (`window.form.isScriptActive('script-id')`).
- **Default every setting in code.** `presetState` is empty until an admin saves.
- **Never log or send the token to a third party.**

## Read next

- **`reference/native-components.md`**: every component and attribute, the full `window.form` API, the modal
  system, Handlebars helpers, partials, and preloaded `resources`. Read it before building a native view.
- **`reference/best-practices.md`**: `<Transition>` patterns in depth, hooks, settings via `presetState`,
  rights, storing data in the user `reference` object, CORS and CSP, raw-JS rules, in-call views, and a
  pre-ship checklist. Read it before shipping anything.
- **`examples/webhooks.view.html`**: the masterclass. A full CRUD panel (list, modal editor, edit/preview
  toggle via `<Transition boolLock>`, nested actions, insert menu) built only from native components.
- **`examples/stangtider.view.html`**: a second complete native view (opening-hours rules and call routing,
  settings persisted to `presetState`, file upload).
- **`examples/modal.view.html`**: the minimal modal demo.

## Creating and updating views via MCP

Every data-changing call needs `confirm=true`. Show the user what will change first.

```javascript
// Create an org view with its own HTML
call_api(method="POST", path="/api/users/views-v1", body={
  "name": "Min vy",
  "html": "<div>...</div>",
  "teamIds": [],        // [] = admins only, null = everyone
  "roleIds": [],
  "projectIds": null,   // null = all projects
  "iconName": "user-ninja", "iconColor": "#1565c0",
  "locations": [{ "type": "navigation", "position": 0, "label": "Min vy" }],
  "rights": [{ "right": "canEdit", "name": "Kan redigera", "description": "Tillåter redigering" }]
}, confirm=true)

// Update (any subset of fields, plus presetState for per-view config)
call_api(method="PUT", path="/api/users/views-v1/{viewId}", body={ "html": "..." }, confirm=true)

// Delete
call_api(method="DELETE", path="/api/users/views-v1/{viewId}", confirm=true)
```

**Locations:** `settings`, `navigation`, `widgets`, `widgetsLeft`. Navigation positions map to tab groups
(0 Ringlistor/Samtal/Kontakter, 1 Ordrar/Avtal, 2 Statistik, 3 Kalender, 4 Inställningar);
`-1` is an own section on the left and above `4` an own section right of Inställningar.
`locations` is per org view and is not synced from the template.

**Templates (vymallar):** `GET /api/users/view-presets-v1`, `GET .../{presetId}`,
`PUT .../{presetId}` with `{ name, html, settingsHtml, iconName, iconColor, entityGroupIds, locations, rights, description }`.
A template's HTML change reaches every org view using it immediately. The first org view from a new template
must be created via API (`POST /api/users/views-v1 { presetId, ... }`); after that, its settings appear in the UI.

## Other `window.form` helpers

```javascript
window.form.navigate("/calendar");                     // go to a SaleSys page
window.form.notify("Sparat", "ok");                    // toast with check icon
window.form.notify({ id: "n1", title: "Klart", body: "...", icon: { name: "check" } });
window.form.deleteNotification("n1");
window.form.setTitle("Ny titel");                      // null resets
window.form.formatText("Hej [[förnamn]]");             // fill from the current call's contact
window.form.currentContact;                            // set while a customer card is active, else null
window.form.rights.includes("canEdit");                // this view's rights (admin has all)
window.form.currentUser.rights.includes("orders.getAll");
window.form.setFieldProperties("telefonnummer", { readOnly: true }); // lock contact/order fields
window.form.isBackground;                              // true when running as a background view
```

Background views run their script without the view being open (use with `addHook`). Open SaleSys without
them via `https://app.salesys.se/?safe`.

## Swedish terms

| Svenska | English |
|---|---|
| Vy / Egna vyer | View / Custom views |
| Vymall | View template (preset) |
| Inställningsvy | Settings view |
| Rättigheter | Rights |
| Flik | Tab / widget |
| Fält | Field |

## Resources

- More view templates and the full internal skill: https://skills.salesys.se
- API docs: https://docs.salesys.io
- Icons: https://fontawesome.com/v5/search?ic=free-collection
