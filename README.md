# Character Codex

An interactive character site for a D&D 5e 2014 + Tasha’s campaign. Each character has their own pages under `/<slug>`, and the campaign’s rules are shared. The first character is **Lucan Beryll**, a level 10 Half-Elf Dao Genie Warlock (Pact of the Tome), at `/lucan`.

Built with Nuxt 3, Vue 3 and Tailwind CSS.

## Run locally

```sh
bun install
bun run dev        # http://localhost:8000
bun run generate   # static site in .output/public
```

On Windows, `generate` now and then stops with `EPERM: operation not permitted, rename` on a file in `.nuxt/cache`. That is Nitro’s prerender cache racing with itself; delete `.nuxt/cache` and run it again. The Linux build on GitHub doesn’t hit it.

## Publish to GitHub Pages

`.github/workflows/deploy.yml` builds the static site and publishes it on every push to `main`.

1. Push the project to a GitHub repository.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow by hand from the **Actions** tab. The site appears at `https://<user>.github.io/<repo>/`.

A project site lives in a subfolder, so the workflow sets `NUXT_APP_BASE_URL` to `/<repo>/`. Images from `public/` go through `publicPath()` (`utils/publicPath.ts`) so they get the prefix too. To try a subfolder build locally from Git Bash, turn off its path conversion, or `/DnD-Warlock/` turns into a Windows path:

```sh
MSYS_NO_PATHCONV=1 NUXT_APP_BASE_URL=/DnD-Warlock/ bun run generate
```

Search engines are kept out by a `noindex, nofollow` meta tag on every page (`nuxt.config.ts`). `public/robots.txt` only has an effect when the site is at the root of a domain (a `<user>.github.io` repo or a custom domain). Crawlers ignore a `robots.txt` inside a subfolder.

Old URLs still redirect on GitHub Pages: unknown paths get `404.html`, which loads the app and runs the redirect middleware.

## Pages

Shared by every character:

| Route | What’s there |
| --- | --- |
| `/` | The characters, each with a portrait, a summary and links to their pages, plus a link to the campaign rules |
| `/rules` | Campaign homebrew, DM rulings and the source policy for the whole table; then a section per character with their own house rules and rulings; and the Zman’s 5e Tweaks rulebook as a PDF in the browser’s viewer (`public/docs/zmans-5e-tweaks.pdf`; phones get open and download buttons) |

Lucan’s pages:

| Route | What’s there |
| --- | --- |
| `/lucan` | Character sheet, for reading: vitals and abilities in one header, attacks, feats, invocations and features (linking to their own pages), defenses, skills and senses, languages and tools, attunement. Each number appears once; spells live in the spellbook. Nothing on it rolls or tracks; that is the session page’s job |
| `/lucan/lesser-dao` | Form of the Lesser Dao: stat block, how the form works at this table, tactics, and Lucan and the form side by side |
| `/lucan/session` | Session tracker for play: a sticky status bar (HP with damage/heal/temp, AC, slots, concentration, conditions, advantage/disadvantage), resources and rests, death saves and conditions, attack and damage rolls (Hex follows concentration, crit doubles the dice), every known spell with a Cast button that spends the slot, item and feature triggers (Lesser Dao, flight, wand, potion, Ring of Spell Storing, Spell Gem…), checks, saves and skills. In the Lesser Dao form the page switches over: the form’s HP lead, its 10 turns count down, attacks and rolls use its stats, and spellcasting is locked while concentration carries on |
| `/lucan/spells` | Searchable, filterable spellbook (status, level, school, concentration, ritual) with expandable cards. `?tab=` and `?q=` open a tab or a search |
| `/lucan/spells/:slug` | Full spell page with 5th-level pact-slot effects, notes and roll buttons. Eldritch Blast has a damage-per-turn planner and Spike Growth a forced-movement planner |
| `/lucan/items` | Owned items (mirroring the Foundry sheet), mundane gear, and a wishlist grouped by slot, with variant versions where they exist |
| `/lucan/items/:slug` | Full item page with rules, caveats and flavor |
| `/lucan/vessel` | The Genie Vessel: patron features, residence features, rooms with their magic items, house rules |
| `/lucan/lore` | Lucan’s story, traits, appearance, Zahir ibn Kharum and story hooks |
| `/lucan/levels` | Level history: each level’s HP, slots, features and choices, with cantrips, spells and invocations counted against the Warlock table, the starting array and every skill pick. The `Lv` tags on the sheet’s features link here |

Lucan’s pages used to sit at the root (`/session`, `/spells/hex`…). Those URLs redirect to the pages above, keeping any `?tab=` or `#room`, and items renamed in that time go to their new pages (see `middleware/legacy-redirects.global.ts`).

## Editing the content

Content lives in typed TypeScript files in `data/`.

For the whole table:

- `data/campaign.ts`: campaign homebrew, DM rulings, the source policy, the Zman’s 5e Tweaks PDF, and the allowed starting arrays (read from `sourcematerial/standard-arrays.txt`)
- `data/conditions.ts`: the conditions and exhaustion levels the session page can mark
- `data/characters/index.ts`: the list of characters. Each entry has the URL slug, the name and tagline in the header, the summary on `/`, the character’s navigation, and their section of `/rules`

For Lucan, in `data/characters/lucan/`:

- `index.ts`: his entry in the character list and his navigation
- `character.ts`: ability scores, AC, proficiencies, feats, invocations, features and tracked resources. The Foundry VTT actor export is the source of truth for these numbers
- `spells.ts`: every spell with its status (`known`, `book`, `candidate`, `future`)
- `items.ts`: owned items (`group: 'owned'`, mirroring the Foundry sheet), the wishlist (`variants` lists official versions, `slot` says where it is worn and `slots` sets the limits), mundane gear and Vessel contents (with their room)
- `vessel.ts`: Vessel features and rooms
- `lore.ts`: story, appearance, patron, his own house rules and rulings
- `levels.ts`: the level history. Levels 1–10 were built at once for the campaign start, so each choice sits at the first level the rules allow. When Lucan gains a level, change its entry from `upcoming` to `played`, add the `date` and the choices (a swapped spell gets `replaces`), add the next upcoming level, and update `character.ts` to match

Lucan’s derived numbers (modifiers, saves, spell DC, attack bonus, passives) are calculated in `composables/useCharacter.ts`, so changing an ability score or item bonus updates all his pages.

The session tracker saves to the browser’s `localStorage`, under keys that start with the character’s slug (`lucan-tracker-v1`). Saves from before there were several characters move over to the new keys the first time they’re read (`utils/storage.ts`).

## Adding a character

1. Add `data/characters/<slug>/` with the character’s data and an `index.ts` that exports their entry, and list it in `data/characters/index.ts`. The header, the character list on `/`, the Rules page and the error page pick it up from there.
2. Add their pages in `pages/<slug>/`, starting with `index.vue` for the sheet, and link to them from the entry’s `nav`.
3. Reuse shared components (`FeatureList`, `AbilityGrid`, `SpellCard`…) where they fit, and build what’s specific to the character for that character. Lucan’s session tracker, Vessel and Lesser Dao pages, and the composables behind them, are his alone.

## Layout

The site uses the full window up to 2560 px. Besides Tailwind’s breakpoints there is a `3xl` breakpoint at 1920 px (`tailwind.config.ts`), where the session page shows four columns and the sheet two. The `.wrap` class and the `--gutter` and `--header-h` variables in `assets/css/tailwind.css` set the page padding and header height, which the session status bar lines up with. Below 1024 px the navigation folds into a menu.

The header shows the character whose pages you’re on. On the shared pages it keeps the last character you visited. Clicking the name opens a menu with every character and **All characters** (`/`). The phone menu and the footer link to `/` too.

## Art

Images live in `public/images/`, and the originals of the paintings are kept in `art/` as `<name>.original.png`. Items point at their image with an `art` entry in `data/characters/lucan/items.ts`, the portrait with `appearance.portrait` in `lore.ts`. Each one also keeps an art brief (`art.prompt`, `appearance.portraitPrompt`): a prompt for generating a new version. The site doesn’t show them.

- **Item paintings on a white background** (the Pact Keeper’s Crystal Dagger): run `node scripts/import-art.mjs art/<name>.original.png public/images/<name>.png [glow hex]`. The script removes the white background, fits the item onto a 600×800 canvas and places it on the site's dark backdrop.
- **Full paintings** (the portrait and the Genie Vessel ring): save a JPEG copy at quality 85 in `public/images/`. The originals are over 1 MB each, too heavy for a page.
- **Drawn illustrations** (the Golden Pact): `node scripts/generate-art.mjs` writes `the-golden-pact.svg`.
