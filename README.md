# Le Musée de Bryanna 🏛️

A museum dedicated to her. A plain, no-build static website — just HTML, CSS,
and a little JavaScript — so nothing can break and it costs $0/month to run
(only the domain costs money). The Travel map uses Leaflet (free) and the
Guestbook uses Supabase (free tier).

> **Josh:** you don't need to understand the code. To add a photo, trip,
> dinner, or memory, just send the stuff to Claude and it gets added. The
> sections below are (1) the one-time setup, and (2) reference for what lives
> where.

---

## The wings
| Page | What it is | Content lives in |
|------|------------|------------------|
| `index.html` | The grand entrance | the page itself |
| `portraits.html` | Portrait Gallery (photos of her) | `data/portraits.js` |
| `collection.html` | Permanent Collection (timeline of events) | `data/events.js` |
| `voyage.html` | Travel Wing (map + trip cards) | `data/trips.js` |
| `cuisine.html` | Culinary Archive (date-night menus) | `data/menus.js` |
| `guestbook.html` | The Guestbook (anyone can sign) | Supabase database |

Photos go in `images/portraits/`, `images/trips/`, `images/cuisine/`.

---

## One-time setup (the short list)

You only have to do these once. Each is just clicking around — no coding.

### 1. Buy the domain
Buy **Bryanna.ca** (~$15/yr) from any registrar (Namecheap, Cloudflare,
GoDaddy). You'll point it at Vercel in step 4.

### 2. Put the site on GitHub
1. Make a free account at **github.com**.
2. Create a new **empty** repository called `musee-de-bryanna` (keep it Public
   or Private — your choice).
3. Tell Claude the repo address and it will push all these files up for you.

### 3. Put it online with Vercel (free hosting, auto-deploys)
1. Go to **vercel.com** and sign up with your GitHub account.
2. Click **Add New… → Project**, pick the `musee-de-bryanna` repo, click
   **Deploy**. No settings to change — it's a static site.
3. In ~30 seconds you'll get a live link like `musee-de-bryanna.vercel.app`.
   From now on, **every time Claude pushes a change, the site updates itself.**

### 4. Connect your domain
In Vercel: **Project → Settings → Domains → Add**, type `bryanna.ca`, and
follow the two DNS lines it shows you (copy them into your registrar). Done in
a few minutes.

### 5. Turn on the Guestbook (Supabase)
1. Make a free account at **supabase.com** and create a **New project**
   (any name; pick a password it gives you; nearest region).
2. When it's ready: left sidebar → **SQL Editor → New query**. Open the file
   `supabase-setup.sql` from this project, paste the whole thing in, click
   **Run**. (This builds the guestbook table.)
3. Left sidebar → **Project Settings → API**. Copy two things:
   - **Project URL**
   - the **anon public** key
4. Open `js/config.js` and paste those two values where it says
   `PASTE_…`. Save. Tell Claude to push it (or just send the two values to
   Claude and it'll do it). The guestbook goes live.

That's everything. After this, you never touch setup again — you just send
Claude new photos and memories.

---

## How content gets added (reference)
Each `data/*.js` file has a commented example showing the exact format. To add:
- **a photo** → drop the image in `images/portraits/`, add a block to
  `data/portraits.js`.
- **a memory** → add a block to `data/events.js`.
- **a trip** → add a block to `data/trips.js` (coordinates: right-click the
  spot in Google Maps and click the numbers to copy them).
- **a dinner** → add a block to `data/menus.js`.

Claude does all of this for you on request.

## Moderating the guestbook
To hide a bad entry, open Supabase → SQL Editor and run:
```sql
update public.guestbook set hidden = true where id = <the id>;
```
(List entries with `select id, name, message from public.guestbook order by created_at desc;`)

## Run it locally (optional)
From this folder: `python -m http.server 8000`, then open
`http://localhost:8000`.
