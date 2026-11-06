# Character Codex

An interactive character site for D&D 5e. Each character has their own pages under `/<slug>`, and the rules are shared. The group keeps two separate rulesets, one for the 2014 books (plus Tasha’s) and one for the 2024 books, and each character plays by one of them. The first character is **Lucan Beryll**, a level 10 Half-Elf Dao Genie Warlock (Pact of the Tome) on the 2014 rules, at `/lucan`. The second, at `/tempest`, is a concept: **The Storm-Hammer** (a working title until he has a name), a level 10 Hill Dwarf Tempest Cleric of Kord on the 2014 rules and a possible replacement for Lucan.

The 2024 ruleset is a new campaign, the Sword Mountains expedition: level 3, mostly dungeon crawling. Two concepts for it, both working titles until they have names: **The Whisper-Knife**, a Wood Elf Soulknife Rogue at `/soulknife`, and **The Lightless Hunter**, a Human Gloom Stalker Ranger at `/gloom-stalker`.

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
| `/` | The characters, each with a portrait, a summary, their ruleset and links to their pages, plus a link to the campaign rules |
| `/rules` | A tab per ruleset (2014, 2024). Each has its homebrew, DM rulings and source policy; then a section for each character on it with their own house rules and rulings; and its homebrew rulebook as a PDF in the browser’s viewer (for 2014, Zman’s 5e Tweaks in `public/docs/zmans-5e-tweaks.pdf`; phones get open and download buttons). `?ruleset=2024` opens a tab; without it the page opens on the ruleset of the character last visited |

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

The Storm-Hammer’s pages, the same set as Lucan’s (a concept: nothing played yet, his gear pitched to the DM):

| Route | What’s there |
| --- | --- |
| `/tempest` | Character sheet at level 10: vitals and abilities, attacks, defenses, skills and senses, languages and tools, attuned items, feats and features. The numbers use plain plate and the +1 Amulet of the Devout (`itemBonuses` in his `character.ts`) |
| `/tempest/session` | Session tracker: a sticky status bar (HP, AC with Shield, initiative with the shield’s advantage, spell slots by level, what is running), slots and class uses, rests, death saves and conditions, rolls with the shield’s and War Caster’s advantage built in, the staff’s storms and his other items, attacks (the staff with Divine Strike, Booming Blade, Spirit Guardians and Spiritual Weapon at the level they were cast, Wrath of the Storm, the Storm Avatar), and every ready spell with a slot-level picker. A Destructive Wrath toggle maxes the next lightning or thunder roll. Taking damage rolls the concentration save with War Caster’s advantage |
| `/tempest/spells` | Searchable, filterable spellbook (ready, candidates and 6th-level spells to come; level, school, concentration, lightning or thunder, ritual). `?tab=` and `?q=` open a tab or a search |
| `/tempest/spells/:slug` | Full spell page with what each slot level adds and its dice. Spirit Guardians carries how he fights: the plan and his action, bonus action, reaction and Channel Divinity |
| `/tempest/items` | His starting kit (with attunement slots) and mundane gear, as rows that open into the rules and the paintings; a wishlist shows when something is on it |
| `/tempest/items/:slug` | Full item page, with what to ask the DM |
| `/tempest/lore` | A first draft of his story, what’s still to settle, his appearance, Kord and story hooks |
| `/tempest/levels` | Level history like Lucan’s, against the Cleric table: HP, slots, prepared spells, Channel Divinity, the starting array and skill picks, feats (Magic Initiate from the Seeker Guild on top) and what’s still to decide |

His questions for the DM show on `/rules` under his name until they are answered.

The two 2024 concepts get the same set at level 3, the campaign’s start (nothing played yet, each one’s uncommon item pitched to the DM, no paintings yet: an emblem stands in for the portrait). The Whisper-Knife is a rogue with no spellbook, so **Powers** takes the Spells page’s place:

| Route | What’s there |
| --- | --- |
| `/soulknife`, `/gloom-stalker` | Character sheet at level 3: vitals and abilities, attacks, defenses, skills and senses, languages and tools, attuned items (the 2024 limit of 3), feats and features |
| `/soulknife/session`, `/gloom-stalker/session` | Session tracker with the 2024 conditions and Exhaustion. The Whisper-Knife’s tracks psionic dice (Knack and Psychic Whispers roll and spend them), Sneak Attack and the bonus action each turn, Steady Aim, Vex and hiding, and the blades with Sneak Attack dice. The Lightless Hunter’s tracks spell slots, Hunter’s Mark’s free casts and its quarry, Dreadful Strike, the first turn’s ambush, Umbral Sight in darkness, arrows, and concentration saves on damage |
| `/soulknife/powers`, `/soulknife/powers/:slug` | Psionic powers, the rogue options they choose to use and the Wood Elf spells, ready now or arriving by level 12. Psychic Blades carries how they fight |
| `/gloom-stalker/spells`, `/gloom-stalker/spells/:slug` | Spellbook: Hunter’s Mark and the Gloom Stalker spells, Magic Initiate (Druid), the four prepared, candidates and later spells. Hunter’s Mark carries how they fight |
| `/soulknife/items`, `/gloom-stalker/items` (and `/:slug`) | The starting kit, mundane gear and a gold ledger (the DM’s 200 gp plus the packages’ coins, what was bought and what is left), and a wishlist of other uncommon items to ask for |
| `/soulknife/lore`, `/gloom-stalker/lore` | A first draft of their story, what’s still to settle, appearance with an art brief for a portrait, why they took the commission, and story hooks |
| `/soulknife/levels`, `/gloom-stalker/levels` | Levels 1–3 as built, checked against the campaign’s array, and the plan for 4–12 with what’s still to decide |

Their questions for the DM show on `/rules` under the 2024 tab.

Lucan’s pages used to sit at the root (`/session`, `/spells/hex`…). Those URLs redirect to the pages above, keeping any `?tab=` or `#room`, and items renamed in that time go to their new pages (see `middleware/legacy-redirects.global.ts`).

## Editing the content

Content lives in typed TypeScript files in `data/`.

For the whole table:

- `data/campaign.ts`: the two rulesets, each with its homebrew, DM rulings, source policy, reference site, rulebook PDF and attunement limit. The 2014 ruleset checks starting scores against the allowed arrays (read from `sourcematerial/standard-arrays.txt`); the 2024 one holds the Sword Mountains campaign’s setup from the DM’s flyer (level 3, gold, the one uncommon item) and its single `startingArray`
- The rules text paraphrased in `data/` follows the book of each character’s ruleset: 2014 for Lucan and the Storm-Hammer, 2024 for the Whisper-Knife and the Lightless Hunter
- `data/conditions.ts` and `data/conditions-2024.ts`: the conditions and exhaustion the session pages can mark, in the 2014 and 2024 wording
- `data/characters/index.ts`: the list of characters. Each entry has the URL slug, the name and tagline in the header, the summary on `/`, the ruleset they play by, the character’s navigation, and their section of `/rules`

For Lucan, in `data/characters/lucan/`:

- `index.ts`: his entry in the character list and his navigation
- `character.ts`: ruleset (2014), ability scores, AC, proficiencies, feats, invocations, features and tracked resources. The Foundry VTT actor export is the source of truth for these numbers
- `spells.ts`: every spell with its status (`known`, `book`, `candidate`, `future`)
- `items.ts`: owned items (`group: 'owned'`, mirroring the Foundry sheet), the wishlist (`variants` lists official versions, `slot` says where it is worn and `slots` sets the limits), mundane gear and Vessel contents (with their room)
- `vessel.ts`: Vessel features and rooms
- `lore.ts`: story, appearance, patron, his own house rules and rulings
- `levels.ts`: the level history. Levels 1–10 were built at once for the campaign start, so each choice sits at the first level the rules allow. When Lucan gains a level, change its entry from `upcoming` to `played`, add the `date` and the choices (a swapped spell gets `replaces`), add the next upcoming level, and update `character.ts` to match

Lucan’s derived numbers (modifiers, saves, spell DC, attack bonus, passives) are calculated in `composables/useCharacter.ts`, so changing an ability score or item bonus updates all his pages.

For the Storm-Hammer, in `data/characters/tempest/`:

- `index.ts`: his entry in the character list, his navigation and his section of `/rules`. Rename him by changing `name` in `character.ts`; the slug stays `tempest`
- `character.ts`: ruleset (2014), scores (with the array and the dwarf’s increases), AC, proficiencies, feats and features, the resources the session tracks, and `stats`, the numbers worked out from them
- `spells.ts`: every spell with its status (`known`, `domain`, `prepared`, `candidate`, `future`), what a higher slot adds, and the dice the session rolls by slot level. `storm` marks lightning or thunder, which Destructive Wrath can max (with two kinds of damage, those dice come first)
- `items.ts`: his starting kit (`owned`), any wishlist items and mundane gear, in the same shape as Lucan’s. The amulet’s version (+1 for now) is set in `character.ts` as `itemBonuses.spell`
- `levels.ts`: the level history, built at once to level 10. When he gains a level, change its entry from `upcoming` to `played` as for Lucan
- `tactics.ts`: how he fights, shown on the Spirit Guardians page
- `lore.ts`: story draft, what’s still open, appearance and portrait, Kord, hooks, and his house rules, rulings and open questions for the DM. When the DM answers one, move it to `rulings`

His session tracker is `composables/useTempestTracker.ts` with its panels in `components/tempest/session/`; his spell card and the tactics panel are in `components/tempest/`.

For the Whisper-Knife (`data/characters/soulknife/`) and the Lightless Hunter (`data/characters/gloom-stalker/`), on the 2024 rules:

- `index.ts`, `character.ts`, `levels.ts`, `lore.ts` and `tactics.ts` work as the Storm-Hammer’s do. Rename either by changing `name` in `character.ts`; the slugs stay. Levels 4–12 are `upcoming`, with the plan in `pending`
- `powers.ts` (the Whisper-Knife): every power with its `level` and status (`ready`, `future`), what it costs (a psi die, a daily use, Sneak Attack dice) and when it’s used
- `spells.ts` (the Lightless Hunter): statuses `known` (Magic Initiate’s cantrips and Healing Word), `always` (Hunter’s Mark and the Gloom Stalker spells), `prepared`, `candidate` and `future`
- `items.ts`: the starting kit and wishlist in the same shape as the others’, the mundane gear, and `gold`, the ledger of coins in and spent
- `nuxt.config.ts` imports `powers.ts`, `spells.ts` and `items.ts` to list their pages, so they import only relative files, never `~/` paths

Their trackers are `composables/useSoulknifeTracker.ts` and `composables/useGloomStalkerTracker.ts`, with their panels in `components/soulknife/` and `components/gloom-stalker/` (the emblem that stands in for a portrait is there too).

Shared by both characters’ data: `data/characters/shared.ts` (ability keys and names, the feature shape, spell schools and level labels) and `data/characters/item-types.ts` (the item shape, slots, versions and source books). `FeatureList` takes a `levels` page for its `Lv` links, `AbilityGrid` a character’s `stats` and casting ability, and `ItemRow` and `AttunementSlots` a character’s items and item pages; they default to Lucan’s.

The session trackers save to the browser’s `localStorage`, under keys that start with the character’s slug (`lucan-tracker-v1`, `tempest-tracker-v1`, `soulknife-tracker-v1`, `gloom-stalker-tracker-v1`). Saves from before there were several characters move over to the new keys the first time they’re read (`utils/storage.ts`).

## Adding a character

1. Add `data/characters/<slug>/` with the character’s data and an `index.ts` that exports their entry, and list it in `data/characters/index.ts`. Set the entry’s `ruleset` to `'2014'` or `'2024'`; don’t assume 2014. The header, the character list on `/`, the Rules page and the error page pick it up from there.
2. Add their pages in `pages/<slug>/`, starting with `index.vue` for the sheet, and link to them from the entry’s `nav`.
3. Reuse shared components (`FeatureList`, `AbilityGrid`, `ItemRow`, `AttunementSlots`…) where they fit, and build what’s specific to the character for that character. Each character’s session tracker is their own (Lucan’s `useTracker`, the Storm-Hammer’s `useTempestTracker`), as are Lucan’s Vessel and Lesser Dao pages; the dice roller and toasts are shared. A 2024 character needs their own spell and item text, since the 2024 books changed many of them; the 2024 conditions and Exhaustion are in `data/conditions-2024.ts`. Check the starting scores against the ruleset’s `startingArray` and the attunement against its `attunementLimit`.

## Layout

The site uses the full window up to 2560 px. Besides Tailwind’s breakpoints there is a `3xl` breakpoint at 1920 px (`tailwind.config.ts`), where the session page shows four columns and the sheet two. The `.wrap` class and the `--gutter` and `--header-h` variables in `assets/css/tailwind.css` set the page padding and header height, which the session status bar lines up with. Below 1024 px the navigation folds into a menu.

The header shows the character whose pages you’re on. On the shared pages it keeps the last character you visited. Clicking the name opens a menu with every character and **All characters** (`/`). The phone menu and the footer link to `/` too.

## Art

Images live in `public/images/`, and the originals of the paintings are kept in `art/` as `<name>.original.png`. Items point at their image with an `art` entry in `data/characters/lucan/items.ts`, the portrait with `appearance.portrait` in `lore.ts`. Each one also keeps an art brief (`art.prompt`, `appearance.portraitPrompt`): a prompt for generating a new version. The site doesn’t show them.

- **Item paintings on a white background** (the Pact Keeper’s Crystal Dagger): run `node scripts/import-art.mjs art/<name>.original.png public/images/<name>.png [glow hex]`. The script removes the white background, fits the item onto a 600×800 canvas and places it on the site's dark backdrop.
- **Full paintings** (the portrait and the Genie Vessel ring): save a JPEG copy at quality 85 in `public/images/`. The originals are over 1 MB each, too heavy for a page.
- **The Storm-Hammer’s paintings** came as WebP and are kept in `art/` as `<name>.original.webp`. The web copies in `public/images/` are WebP at quality 82, at most 1100 px on the long side; the portrait is cropped to 3:4 from the top so the sheet’s frames keep his head.
- **Drawn illustrations** (the Golden Pact): `node scripts/generate-art.mjs` writes `the-golden-pact.svg`.
