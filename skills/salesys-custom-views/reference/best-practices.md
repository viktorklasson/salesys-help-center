# Best practices, data patterns, and gotchas

Hard-won rules from building and running dozens of production views. Most of them exist because
breaking them produced a view that worked in preview and failed in prod.

---

## Layout and look (both paradigms)

- **No in-view title.** The app already renders the view's name large in the top-left. Do not add your own
  `<h1>` or header for it, or the name shows twice. Start with content. Use
  `window.form.setSubtitle("…")` for a subtitle and `window.form.setButton(...)` for a title-bar action.
  Headings *inside* a card are fine.
- **Never set the page width.** The app container owns width and outer padding. No `max-width`, fixed
  pixel width, `margin: 0 auto`, or outer horizontal margins on the root. Use fluid CSS inside
  (`%`, `fr`, flex, grid with `minmax`). The container narrows on small screens and when side widgets open.
- **No emojis.** Use FontAwesome 5 free icons (loaded globally: `<i class="fas fa-check"></i>`) or inline
  SVG. Typographic marks like `✓` and `×` are fine.
- **Theme with CSS variables plus fallbacks**, so dark mode works:
  `var(--color-background-1, #fff)`, `--color-background-2/3/4`, `--color-text-2/3/4`,
  `--color-primary`, `--color-good`, `--color-danger`, `--color-element-hover`, `--border-radius-button`.
- **Do not assume white text on `--color-primary` is readable.** Dark themes can resolve the primary
  colour to a light shade. Native components handle this. Raw-JS views must measure it (see below).
- **Native views: use `<Field select-type="dropdown">`, not a raw `<select>`.** Raw-JS views should
  prefer chip rows or card grids over a native `<select>` so they match the SaleSys look.

---

## Animate with `<Transition>`, not hand-written CSS

`<Transition>` is the native way to animate content that appears, disappears, or changes height.
Without it, content snaps in and the layout jumps. Wrap the part that changes, and tell the component
*when* to animate through a lock:

- **`boolLock="{{flag}}"`** re-animates every time the boolean flips. Use it for show/hide and
  two-state swaps (collapsed and expanded, view and edit, form and preview).
- **`lock="{{token}}"`** re-animates every time the computed value changes. Use it when there are more
  than two states, for example a step id in a wizard or the selected tab:
  `lock="{{custom.step}}"`.
- **`overflowHiddenDuringTransition="true"`** clips content while the height animates. Add it when
  children overflow mid-animation (dropdowns, shadows, wide content).

```html
<!-- two states: button collapses into a date field -->
<Transition boolLock="{{custom.isDateVisible}}">
  {{#if custom.isDateVisible}}
    <Field type="date" label="Datum" value="{{custom.date}}" onChange="window.form.setState({ date: value })"></Field>
  {{else}}
    <SecondaryButton icon="calendar" onClick="window.form.setState({ isDateVisible: true })">Välj datum</SecondaryButton>
  {{/if}}
</Transition>

<!-- many states: one wizard step at a time -->
<Transition lock="{{custom.step}}" overflowHiddenDuringTransition="true">
  {{#ifEq custom.step 'contact'}} ... {{/ifEq}}
  {{#ifEq custom.step 'order'}} ... {{/ifEq}}
</Transition>
```

Rules of thumb:
- The lock must change **exactly when the content changes**. A lock that never changes never animates.
  A lock that changes on every render (a timestamp, a counter) animates constantly.
- Keep one `<Transition>` per region that changes. Do not wrap the whole view.
- The Webhooks example flips an entire modal between *edit* and *preview* with one `boolLock`, without
  remounting the form. That is the pattern to copy for any edit/preview toggle.

---

## State and reactivity (native)

- **Change state, never the DOM.** The template re-renders whenever `custom` or `settings` changes.
  Write with `window.form.setState(...)` and let `{{...}}` follow.
- **Use the function form when the new value depends on the old one:**
  `setState(s => ({ count: s.count + 1 }))`.
- **One `addHook` per concern, with a descriptive name** (`'set rule summary'`, `'set button'`).
  Hooks run after every state change, so **only write when the value actually changed**, or you loop:
  ```js
  window.form.addHook('set total', function () {
    var total = (window.form.custom.rows || []).reduce(function (a, r) { return a + r.amount; }, 0);
    if (window.form.custom.total !== total) window.form.setState({ total: total });
  });
  ```
- **Title-bar buttons belong in a hook**, so `disabled` and labels stay in sync with state.
- **Guard real side effects in preview.** `window.form.preview` is `true` in the admin editor:
  `if (window.form.preview) { window.form.notify('Ej vid förhandsgranskning'); return; }`
- **Modal buttons return a Promise.** Resolve `true` to close, `false` to stay open (for example after
  a validation error). `onHidden` is the place to clear the selection.
- **Use partials (`{{> Name}}`)** to keep a large template readable.
- **Use the built-in spinner** while loading, so it matches SaleSys:
  `<div class="task-indicator large animated"><div data-spinner></div></div>`

---

## Settings: `settingsHtml` and `presetState`

Only a **view template (vymall)** can have a settings view. Settings are stored per org view as `presetState`.

- **In the settings view:** read `window.form.settings`, write `window.form.setSettings(objOrFn)`
  (shallow merge). Changes persist when the admin clicks **Spara**. Do **not** use
  `custom`/`setState` for config there; it is transient and never saved.
- **In the running view there is no `settings` in the template.** Read config by fetching the view:
  `GET /api/users/views-v1/<window.form.view.id>` and use `presetState`.
- You can also write config directly: `PUT /api/users/views-v1/<id> { presetState: {...} }` (arbitrary
  nested JSON round-trips). That lets an admin-only gear inside the view replace a settings form.
- **Default every setting in code.** `presetState` is empty until an admin saves. Treat a missing key as
  the default, for example `settings.pauseOnCall !== false` for a default-on toggle.

---

## Rights

- Define custom rights on the **template**, not on the org view, when you use a vymall.
- `window.form.rights` holds this view's granted rights (unprefixed). Admin always has all of them.
- View rights only gate the UI. The API calls behind them still need the real platform rights server-side,
  so say which ones in the right's description.

---

## Storing data: the user `reference` object

Views have no dedicated database. For per-user or cross-user data, use each user's `reference` object:

- Write your own: `PUT /api/users/users-v1/me { reference: {...}, replaceReference: false }`.
- The merge is **shallow on top-level keys**: always write the whole top-level key, one key per concern
  (`snakeHighScore`, `myViewPrefs`). Dot keys (`"a.b"`) become a literal key name, so avoid them.
- `GET /api/users/users-v1` returns every user's `reference`, which is how views share data. Each user
  writes only their own; the view assembles the full picture.
- **Keep it small** (it is loaded for every user on every view load) and **clean up after yourself**
  (cap arrays, prune old entries, throttle the cleanup with a timestamp).
- Render the current user's own data from a fresh `GET /api/users/users-v1/me`, not from the list copy,
  which lags until the next poll.

Use `presetState` for org-wide configuration and `reference` for per-user data.

---

## Network: same-origin, CORS, and secrets

- **SaleSys API calls are same-origin.** Use relative paths (`/api/...`). No CORS, and the session cookie
  is sent automatically.
- **Any other host is cross-origin** (including `salesys.se` and `admin.salesys.se`). The remote server must
  send CORS headers for `https://app.salesys.se`. You cannot fix a missing header from the view.
- **The app has a Content-Security-Policy.** A host can be blocked even with correct CORS. If a request fails
  with a CSP error in the console, the host is not allowlisted.
- **Never send the SaleSys token to a third party.** Route external calls through a server you control that
  holds any secrets and does the outbound call.
- **`mode: 'no-cors'` does not help.** It returns an unreadable opaque response.
- **Never `console.log` a token.**

---

## Timers, re-renders, and cleanup

- **Stop timers when the user leaves.** Scripts keep running after navigation. Give your script an id and
  check `window.form.isScriptActive('my-script')` in every interval callback, or check that your root
  element still exists. Clear the interval when it does not.
- **Raw-JS views: delegate events on `document`.** The app can re-render the view's DOM after your script
  runs, which silently kills listeners bound to elements. Resolve the target at event time by `id` or
  `data-*` attribute.
- **Raw-JS views: register a cleanup function** (`window.__myViewCleanup`) that removes listeners and timers,
  and call any existing one at the top of init so re-entering the view does not stack duplicates.
- **Raw-JS views: never write `{{` anywhere in the file.** The HTML is rendered through handlebars first, so
  stray braces break the view. Build them with string concatenation if you must (`'{' + '{'`).
- **Raw-JS views: probe the theme.** Measure the resolved `--color-primary` luminance and choose dark or white
  text for primary buttons. The app switches theme by rewriting a `<style>` in `<head>`, so observe
  `document.head` (childList + subtree) or re-probe in your poll loop.
- **Test a re-render.** Run `document.body.innerHTML = document.body.innerHTML` in the console. A raw-JS view
  that breaks there will break in production.

---

## In-call views

- **`window.form.currentContact`** is set while a customer card is active (an ongoing call) and `null`
  otherwise. Its keys are lowercase mapped names (`förnamn`, `telefonnummer`). Poll it to react to calls,
  for example to pause a game or show a script.
- **`window.form.formatText("Hej [[förnamn]]")`** fills text from the current contact.
  `formatTextDebug` shows every available key. `setTextPreview(true)` tests without a live call.

---

## Checklist before shipping

- [ ] No in-view title, no page width, no emojis.
- [ ] Colours via CSS variables with fallbacks; readable in dark mode.
- [ ] `<Transition>` around every region that appears, disappears, or swaps.
- [ ] Hooks only write when values change.
- [ ] Destructive or real calls guarded with `window.form.preview`.
- [ ] Settings defaulted in code; config read from `presetState` in the running view.
- [ ] Timers stop when the user leaves the view.
- [ ] Raw JS only: no `{{`, document-level delegation, cleanup function, theme probe, re-render tested.
- [ ] Data-changing API calls confirmed with the user before running them.
