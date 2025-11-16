# Astro Lite

Astro Lite is a **static, front-end–only AI playground** designed to run on GitHub Pages or any static host.

It demonstrates a production-style, three-layer architecture:

- **UI layer** (`assets/js/ui`) – screens, components, router, loading orb
- **Core layer** (`assets/js/core`) – domain models, chat/session/user services, prompt policy
- **Infra layer** (`assets/js/infra`) – HTTP client for AI, localStorage wrapper, config

The Lite version stores everything in the browser (`localStorage`) and calls a cloud AI provider
directly from JavaScript. There is **no backend server**.

---

## Features

- Landing page (Home)
- Login / Register (demo auth using `localStorage`)
- Chat UI with "thinking" orb animation
- Session history (list, open, delete, rename)
- Profile screen (update display name + theme preference)
- Architecture ready to swap:
  - Fake AI ↔ Real Hugging Face (or similar) model
  - Local-only storage ↔ Future backend API

---

## Project Structure

```text
astro-lite/
  index.html

  assets/
    css/
      base.css
      layout.css
      components.css
      theme-astro.css

    img/
      logo-astro.svg
      orb-background.png

    data/
      embeddings.sample.json   # optional, not required for v1

    js/
      ui/
        app.js
        router.js
        thinkingIndicator.js

        screens/
          homeScreen.js
          loginScreen.js
          registerScreen.js
          chatScreen.js
          historyScreen.js
          profileScreen.js

        components/
          chatMessageList.js
          chatInputBar.js

      core/
        models.js
        promptPolicy.js
        chatService.js
        sessionService.js
        userService.js
        validators.js

      infra/
        hfClient.js
        storage.js
        config.js
```

---

## Running locally

You can open `index.html` directly in the browser, but for modern browsers and modules it is
recommended to use a simple static server.

### Option 1 – VS Code Live Server (easiest)

1. Open the `astro-lite` folder in VS Code.
2. Install the "Live Server" extension if you don't have it.
3. Right-click `index.html` → "Open with Live Server".

### Option 2 – Simple Python HTTP server

From inside the `astro-lite` folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo (e.g. `astro-lite`).
2. In repo **Settings → Pages**:
   - Source: `Deploy from a branch`
   - Branch: `main` (or `master`) / root
3. Save. After a few minutes your app will be live at:

`https://YOUR_GITHUB_USERNAME.github.io/astro-lite/`

---

## Configuring the AI model

All AI configuration lives in: `assets/js/infra/config.js`.

By default, the app runs in **fake AI mode** so you can test the UI without any keys:

```js
export const USE_FAKE_AI = true;
```

When you're ready to connect a real model:

1. Choose a Hugging Face text generation model that supports the Inference API.
2. Edit `config.js` and set:

```js
export const USE_FAKE_AI = false;
export const HF_API_KEY = "YOUR_HF_API_KEY_HERE";
export const HF_MODEL_ID = "YOUR_MODEL_ID_HERE";
// e.g. "mistralai/Mistral-7B-Instruct-v0.2"
```

3. Make sure your key has appropriate limits and you are comfortable exposing it in the browser
   (this is acceptable for a small demo, but not for production).

`chatService.js` and `hfClient.js` will automatically start using the real model when `USE_FAKE_AI` is `false`.

---

## Auth and storage (Lite version)

There is no real backend authentication. Instead:

- Users are stored in `localStorage` under a simple key.
- Login/Register screens are **demo-level** and should not be used for real accounts or sensitive data.
- Sessions and messages are also stored in `localStorage`.

This keeps the app:

- Fully static
- Easy to deploy anywhere
- Safe from server-side data-loss issues

In a full production version, you would replace `storage.js` with calls to a real backend API.

---

## Where to extend

- **Vector search**: use `assets/data/embeddings.sample.json` and add a small vector index in `core` if you want.
- **Backend API**: keep the front-end as-is and point `hfClient.js` / `storage.js` at a new backend.
- **Themes**: extend `theme-astro.css` and add a theme toggle that saves preference via `storage.js`.

---
