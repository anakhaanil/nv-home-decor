# N.V. Home Decor – website

- `index.html` – the public website customers see (view only).
- `studio/` – the private Poster Maker for the shop. It is not linked from the website and is hidden from Google (`robots.txt` + `noindex`).
- `site.json` – shop details (Facebook link, WhatsApp, phones, address). Edit this file to change them.
- `posters/posters.json` – the list of posters on the website. The Poster Maker updates it.

## 1. Put it online for free (GitHub Pages)
1. Create a free account at github.com and a new **public** repository, e.g. `nv-home-decor`.
2. Click **Add file → Upload files** and drag in **everything inside this folder** (not the folder itself). Commit.
3. Go to **Settings → Pages**. Under “Build and deployment”, choose **Deploy from a branch**, then **main** / **(root)**, and click Save.
4. After about 1 minute the site is live at `https://<username>.github.io/nv-home-decor/`.
   The Poster Maker is at `https://<username>.github.io/nv-home-decor/studio/`.
5. Optional: to use your own domain (e.g. nvhomedecor.in), add it in Settings → Pages → Custom domain.

## 2. Add your Facebook and WhatsApp links
Open `site.json` on GitHub, click the ✏️ pencil, fill `fbUrl` and `waChannelUrl`, and commit.

## 3. Let the Poster Maker put posters on the website (one time, per phone)
1. On GitHub: profile photo → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories** → `nv-home-decor`. Permissions: **Contents → Read and write**. Set an expiry (e.g. 1 year).
3. Open the Poster Maker on the shop phone, open **⚙️ Website connection** at the bottom, enter your username, `nv-home-decor`, `main`, and paste the token. Tap **Save & test**.
4. Add the Poster Maker to the phone’s home screen (Chrome menu → **Add to Home screen**), so the staff can open it with one tap.

The token is stored only on that phone. If the phone is lost, delete the token on GitHub.
