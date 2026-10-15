# Native components & the `window.form` API

The native paradigm = **handlebars templating + built-in SaleSys components + the `window.form` runtime**.
This is the officially documented way (the "webbformulär" model) and the right choice for forms, settings
panels, and master-detail CRUD. Everything here is grounded in the bundled examples — read
`examples/webhooks.view.html` (full CRUD masterclass) and `examples/stangtider.view.html` alongside this.

A native view is: markup using components + `{{...}}` bindings, then a `<script>` that defines
`window.*` handlers and drives state through `window.form`. The template **re-renders reactively**
whenever `custom` (state) or `settings` (persisted config) change — so you never touch the DOM directly;
you change state and let the template follow.

---

## The two state stores

| Store | Read | Write | Persistence |
|---|---|---|---|
| **`custom`** (transient view state) | `{{custom.x}}` in template, `window.form.custom.x` in JS | `window.form.setState(obj)` or `setState(state => ({...}))` | in-memory, lost on reload |
| **`settings`** (persisted per-org config) | `{{settings.x}}`, `window.form.settings.x` | `window.form.setSettings(obj \| fn)` | saved to DB as the org view's `presetState` (persists when the admin clicks **Spara** in the settings pane) |

`setState`/`setSettings` accept either an object (shallow-merged onto the store) or a function
`state => partial`. Both trigger a re-render. Example from Stängtider:
```js
window.form.setState(state => ({ selectedRule: state.rules.find(r => r.id === id) }));
window.form.setSettings(settings => ({ rules: settings.rules.map(r => ({...r, error: null})) }));
```
`settings` only exists in a **settings view** (`settingsHtml`) context and in preview. A running view can
also read its persisted config by fetching its own org view (`window.form.view.id` → `GET /users/views-v1/<id>` → `presetState`).

## `window.form.resources` — preloaded org data

The runtime preloads common lookups so you don't fetch them. Observed keys (there may be more):
`resources.orderFields`, `resources.contactFields`, `resources.callTags`, `resources.teams`,
`resources.users`, `resources.viewPreset`. Use directly in JS or template:
```js
...window.form.resources.orderFields.map(f => ({ text: f.label, data: { _field: f.id } }))
```

---

## The `window.form.*` API (complete, from real usage)

**State**
- `setState(objOrFn)` — write transient `custom` state; re-renders.
- `custom` — read current state.
- `settings` / `setSettings(objOrFn)` — read/write persisted `presetState` (settings pane; persists on Spara).
- `resources` — preloaded org data (above).
- `view` — the current org view; `view.id` is its id (use to PUT `presetState`).
- `preview` — `true` during admin preview / not the real view. Guard destructive/real API calls:
  `if (window.form.preview) { alert('Ej vid förhandsgranskning'); return; }`.

**Reactive recompute — `addHook(name, fn)`**
Registers a function that re-runs whenever state/settings change, to compute derived data (labels,
summaries, validation, dynamic buttons). Name it descriptively; one hook per concern. This is how the
native paradigm stays declarative. From Stängtider:
```js
window.form.addHook('set rule summary', function () {
  if (!window.form.settings.rules) return;
  window.form.setSettings(s => ({ rules: s.rules.map(rule => { rule.summary = compute(rule); return rule; }) }));
});
window.form.addHook('set button', function () {
  window.form.setButton('add', { icon:'plus', weight:'primary', children:'Lägg till',
    onClick: () => window.addRule(),
    disabled: Boolean(window.form.settings.rules?.find(r => !r.isSaved)) });
});
```

**Chrome — title bar**
- `setButton(id, { children, icon, weight, onClick, disabled, showTaskIndicator })` — add/replace a button
  next to the view title. One button per id; call again to update it (usually inside an `addHook`).
  `weight`: `'primary' | 'normal' | 'dimmed' | 'danger' | 'simple' | 'accent'`.
- `setSubtitle(str | null)` — set/clear the subtitle under the title.

**Notifications (toasts)**
- `notify("Text")` — simple. `notify("Sparat", "ok")` — with a check icon.
- `notify({ id?, title, body, icon: { name } })` — rich. `deleteNotification(id)` removes a rich toast by id.

**Modals** — see the dedicated section below.

**Validation (settings/forms)**
- `setValidationMessage(fieldId, message)` / `removeValidationMessage(fieldId)` (or `setValidationMessage(id, null)`).

**Misc helpers**
- `checkDoubleClick(message?, onSingleClick?)` — returns `true` on the second click within the window;
  on first click show `message` (or run `onSingleClick`) and `return 'doubleClickRequired'` from your handler.
- `setBusy(bool)` — global busy indicator.
- `getAccessToken()` — the runtime's bearer token (examples define their own from the cookie as a fallback — see apis-and-deploy.md).

---

## Components

All components accept `style`, `containerStyle` (wrapper), and standard event attributes
(`onClick`/`onClick`/`onChange`/`onchange`/`onFocusCapture` — casing is tolerant). In event handlers,
`value` (Field), `checked` (CheckboxField), and `event` are in scope.

### `<Field>` — the universal input
```html
<Field label="Titel" required placeholder="Grattis!" containerStyle="width:100%"
       value="{{custom.title}}" onChange="window.form.setState({ title: value })"></Field>
```
Attributes seen in the wild: `label`, `placeholder`, `value`, `required`, `type` (`time` | `date` | text),
`min` / `max` (for date/time), `maxLength`, `multiline`, `maxRows`, `readOnly`, `disabled`,
`containerStyle`, `style`, `inputContainerStyle`, `sub` (helper text).

**Dropdown** — `select-type="dropdown"` with `<option>` children:
```html
<Field select-type="dropdown" label="Alternativ" value="{{settings.option}}"
       onChange="window.form.setSettings({ option: value })">
  <option value="Alternativ 1">Alternativ 1</option>
</Field>
```
**Multi-select toggle list** — `select-type="switches"` (add `switches-auto-sort`); each `<option>` has its
own `selected` + `onChange`:
```html
<Field label="Händelser" select-type="switches" containerStyle="width:100%">
  {{#each custom.events}}
  <option value="{{event}}" {{#ifIncludes ../custom.selected event}} selected {{/ifIncludes}}
          onChange="window.onChange(webhook => ({ eventNames: ['{{event}}'] }))">{{translation}}</option>
  {{/each}}
</Field>
```

### `<CheckboxField>` — checkbox / radio
```html
<CheckboxField label="Aktiv" {{#if custom.x.isEnabled}} checked {{/if}}
   sub="Bocka ur för att inaktivera." onChange="window.onChange({ isEnabled: checked })"></CheckboxField>
```
`type="radio"` makes it a radio (group by handling `if (checked)` in `onChange`). Attributes: `label`,
`checked`, `sub`, `type`, `containerStyle`.

### `<PrimaryButton>` / `<SecondaryButton>`
```html
<PrimaryButton icon="file-excel" iconPosition="before"
   {{#if custom.isBusy}} disabled {{/if}} onClick="window.export()">Exportera</PrimaryButton>
<SecondaryButton icon="fullscreen" size="compact" weight="primary" style="width:100%"
   onClick="window.openModal1()">Öppna</SecondaryButton>
```
Attributes: `icon`, `iconPosition`/`position`, `iconSize`, `size` (`compact`), `weight`
(`primary`/`danger`/…), `disabled`, `showTaskIndicator`, `style`, `textStyle`.
**Menu button** — give a button `<option>` children and it becomes a dropdown menu (the "Infoga" pattern):
```html
<SecondaryButton icon="plus" size="compact">Infoga
  {{#each custom.insertOptions}}
  <option group="{{group}}" search="{{search}}" onClick="window.insertText('[[{{text}}]]')">{{text}}</option>
  {{/each}}
</SecondaryButton>
```

### `<Tooltip>` — wrap any element
```html
<Tooltip tooltip="Redigera" delay="false" position="top">  <!-- position: top|bottom|left|right -->
  <SecondaryButton icon="pen"></SecondaryButton>
</Tooltip>
```
`delay="false"` shows instantly (default has a delay).

### `<Transition>` — animated show/hide/resize
Wraps content whose visibility/height should animate. Re-animates whenever the `lock` value changes.
- `boolLock="{{someBool}}"` — animate when the boolean flips.
- `lock="{{#ifEq type 'x'}}1{{else}}2{{/ifEq}}"` — animate when the computed token changes.
- `overflowHiddenDuringTransition="true"` — clip overflow mid-animation.
```html
<Transition boolLock="{{isDateVisible}}">
  {{#if isDateVisible}} <Field type="date" .../> {{else}} <SecondaryButton>Välj datum</SecondaryButton> {{/if}}
</Transition>
```

### `<SettingsList>` — the master list (list → detail modal)
Renders a native selectable list; each `<option>` is a row. This is the backbone of a CRUD view (see both
examples). Row attributes: `id`/`value`, `icon`, `iconType` (`regular`), `label`, `description`, `tooltip`,
`selected`, `disabled`, `onClick`. Row body = extra lines; `<attribute icon="...">` renders a status badge line.
```html
<SettingsList>
  {{#each custom.webhooks}}
  <option id="{{id}}" icon="{{either reference.icon 'wrench'}}" label="{{either reference.name 'Webhook'}}"
          description="{{reference.description}}" onClick="window.openEditor(...)">
    {{descriptionShort}}
    {{#ifNot isEnabled}}<attribute icon="ban">Inaktiverad</attribute>{{/ifNot}}
  </option>
  {{/each}}
</SettingsList>
```

### The Modal system
Any element with the bare `modal` attribute is pulled OUT of the normal DOM and only shown when opened.
Open it by CSS selector; configure buttons/behaviour via `ModalProps`:
```html
<div class="my-editor" modal> ...form fields... </div>
```
```js
window.form.openModal('.my-editor', {
  title: 'Rubrik', subtitle: 'Underrubrik', size: 'medium',   // small | small-medium | medium | large | xlarge
  animation: 'zoom',            // 'zoom' | 'slide'
  resizes: true,                // pin to top instead of centering when content resizes often
  onClose: () => {/* return false to prevent closing */},
  onHidden: () => window.form.setState({ selected: null }),   // after close animation
  cancel: {},                                                 // show a cancel button
  go: {  children: 'Spara', type: 'next',                     // type: danger|next|nextSimple|ok|okSimple
         onClick: () => window.save().then(() => true) },     // return true to close (async ok)
  separated: { children: 'Ta bort', weight: 'danger', tooltip: '...', onClick: () => window.remove().then(() => true) },
});
window.form.closeModal();       // close programmatically
```
Modal button `onClick` may return a Promise; resolve to `true` to close, `false` to keep open (e.g. show
a validation toast and stay). See `examples/modal.view.html` for the minimal three-modal demo and
`examples/stangtider.view.html` `window.openEditor` for a real save/delete modal.

---

## Handlebars (the templating layer)

Context roots: `custom.*` (state), `settings.*` (persisted config), `resources.*` (preloaded), `preview` (bool),
and inside `{{#each}}` the item fields directly (use `../` to reach the parent scope, `@index` for the index).

**Block helpers in use:**
`{{#if x}}…{{else}}…{{/if}}`, `{{#ifNot x}}`, `{{#each arr}}`, `{{#with obj}}`,
`{{#ifEq a b}}`, `{{#ifLt a b}}`, `{{#ifGt a b}}`, `{{#ifIncludes arr val}}`,
`{{#either a b c}}…{{else}}…{{/either}}` (first truthy branch, else fallback).

**Inline helpers:**
`{{either custom.x "default"}}` (first truthy), `{{lookup arr index}}`, `{{formatDate d 'YYYY-MM-DD'}}`,
`{{@index}}`.

**Raw HTML:** `{{{custom.selectedAction.html}}}` (triple-stache) injects unescaped HTML — used to embed a
native action editor's markup inside the view.

**Partials:** define reusable template chunks and include with `{{> Name}}` (Webhooks uses `{{> Filter}}`
and `{{> Events}}`). Great for keeping a big CRUD template readable.

**Built-in spinner** (matches SaleSys): `<div class="task-indicator large animated"><div data-spinner></div></div>`.

---

## Why `examples/webhooks.view.html` is the masterclass

It composes essentially every native primitive into one coherent CRUD tool, and is worth reading end to end:
- `<SettingsList>` of webhooks with per-row status `<attribute>` badges (auto-disabled reasons, inactive).
- A `modal` editor opened per row, with a `<Transition>` that flips the whole modal between **edit** and
  **preview** panes without a remount.
- `<Field>` in every mode: big borderless title input, `multiline` description, `select-type="dropdown"`
  for event groups, `select-type="switches"` for individual events, `readOnly multiline` for the preview JSON.
- A native **action** picker that injects the chosen action's own editor HTML via `{{{...}}}`, plus an
  "Infoga" **menu button** (`<SecondaryButton>` + `<option>` children) that inserts `[[tokens]]` into the
  last-focused input (tracked via `onFocusCapture`).
- Reactive glue through `addHook('set insertOptions')`, `addHook('set selectedAction')`, etc. — no manual DOM.
- Live **preview** that calls a real endpoint, shows the SaleSys spinner while loading, and renders resolved
  fields + the source JSON — all gated behind `window.form.preview`.
- Persists config into the org view's `presetState`; a companion PHP endpoint reads it to route real events.

When building a native CRUD panel, start from this file's structure and swap the domain.
