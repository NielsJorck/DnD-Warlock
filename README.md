# Lucan Beryll — Character Codex

An interactive character site for **Lucan Beryll**, a level 10 Half-Elf Dao Genie Warlock (Pact of the Tome), built for a D&D 5e 2014 + Tasha’s campaign.

Built with Nuxt 3, Vue 3 and Tailwind CSS.

## Run locally

```sh
bun install
bun run dev        # http://localhost:8000
bun run generate   # static site in .output/public
```

## Publish to GitHub Pages

`.github/workflows/deploy.yml` builds the static site and publishes it on every push to `main`.

1. Push the project to a GitHub repository.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow by hand from the **Actions** tab. The site appears at `https://<user>.github.io/<repo>/`.

A project site lives in a subfolder, so the workflow sets `NUXT_APP_BASE_URL` to `/<repo>/`. Images from `public/` go through `publicPath()` (`utils/publicPath.ts`) so they get the prefix too. To try a subfolder build locally from Git Bash, turn off its path conversion, or `/DnD/` turns into a Windows path:

```sh
MSYS_NO_PATHCONV=1 NUXT_APP_BASE_URL=/DnD/ bun run generate
```

Search engines are kept out by a `noindex, nofollow` meta tag on every page (`nuxt.config.ts`). `public/robots.txt` only has an effect when the site is at the root of a domain (a `<user>.github.io` repo or a custom domain). Crawlers ignore a `robots.txt` inside a subfolder.

Old Codex URLs still redirect on GitHub Pages: unknown paths get `404.html`, which loads the app and runs the redirect middleware.

## Pages

| Route | What’s there |
| --- | --- |
| `/` | Character sheet: vitals, abilities and saves (click to roll), Eldritch Blast calculator (with Hex), Crystal Dagger attacks, Spike Growth combo, feats, invocations, features, skills, languages, attunement, and a session tracker for HP, slots, resources and rests |
| `/spells` | Searchable, filterable spellbook (status, level, school, concentration, ritual) with expandable cards |
| `/spells/:slug` | Full spell page with 5th-level pact-slot effects, notes and roll buttons |
| `/items` | Owned items (mirroring the Foundry sheet), mundane gear, and a wishlist grouped by slot, with variant versions where they exist |
| `/items/:slug` | Full item page with rules, caveats and flavor |
| `/vessel` | The Genie Vessel: patron features, residence features, rooms with their magic items, house rules |
| `/lore` | Lucan’s story, traits, Zahir ibn Kharum and story hooks |
| `/rules` | Homebrew, DM rulings, source policy, open and closed decisions |
| `/dm` | For the DM: one table of wishlist items plus the Vessel stores, with allow / discuss / deny verdicts, a version picker for items that come in several versions, notes, the open questions with answer fields, and a button that copies everything as text |

Old Codex URLs such as `/known-spells` or `/genie-vessel` redirect to the new pages (see `middleware/legacy-redirects.global.ts`).

## Editing the character

All content lives in typed TypeScript files in `data/`:

- `data/character.ts`: ability scores, AC, proficiencies, feats, invocations, features and tracked resources. The Foundry VTT actor export is the source of truth for these numbers
- `data/spells.ts`: every spell with its status (`known`, `book`, `candidate`, `future`)
- `data/items.ts`: owned items (`group: 'owned'`, mirroring the Foundry sheet), the wishlist (`variants` lists official versions, `slot` says where it is worn and `slots` sets the limits), mundane gear and Vessel contents (with their room)
- `data/vessel.ts`: Vessel features and rooms
- `data/lore.ts`: story, patron, homebrew, rulings, source policy, open questions and the questions for the DM (`dmQuestions`)

Derived numbers (modifiers, saves, spell DC, attack bonus, passives) are calculated in `composables/useCharacter.ts`, so changing an ability score or item bonus updates the whole site.

The session tracker, the open-decision checklist and the DM page’s verdicts save to the browser’s `localStorage`.

## Item art

Items can have an `art` entry in `data/items.ts` with an image in `public/images/`. Each item also stores an art brief: a prompt for generating a painted version.

- **Painted art** (Pact Keeper’s Crystal Dagger, which still uses `rod-of-the-pact-keeper.png`): keep the original in `art/`, then run `node scripts/import-art.mjs art/<name>.original.png public/images/<name>.png [glow hex]`. The script removes the white background, fits the item onto a 600×800 canvas and places it on the site's dark backdrop. Point the item's `art.src` at the PNG.
- **Drawn illustrations** (the Golden Pact, which still uses `barrier-tattoo.svg`): `node scripts/generate-art.mjs` writes the SVGs. It still writes the old `rod-of-the-pact-keeper.svg`, which the site no longer uses.

## Archive

`archive/codex-export/` holds the original Markdown export from Codex Space and the old Nuxt Content config. The site doesn’t use them anymore.
