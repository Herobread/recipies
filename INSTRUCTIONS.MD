# Recipe Syntax & Markdown Manual

This layout relies on specific HTML/CSS behavior for interactive scaling, strikethrough logic, and typographic baseline alignment. Follow these formatting rules strictly.

---

## 1. File Location & Workflow

* **Where to create files:** Add recipes as a single markdown file in `src/pages/recipies/<kebab-case-name>.md` (e.g., `src/pages/recipies/cinnamon-buns.md`).
* **It is strictly a markdown file:** Adding a recipe **never** requires editing `RecipeLayout.astro`, `index.astro`, or any config files. Do not touch or modify layout/template code when adding recipes.
* **Auto-discovery:** The homepage automatically discovers all recipes in `src/pages/recipies/*.md` using `Astro.glob`. No manual registration or index editing is necessary.
* **Verification:** Always verify build succeeds with `bun run build`.

---

## 2. Frontmatter

```markdown
---
layout: ../../layouts/RecipeLayout.astro
title: Tiramisu
time: 45m prep, 6-48h chill
servings: 16
---
```

* `layout`: Relative path to `RecipeLayout.astro`.
* `title`: Name of the recipe (rendered in serif display).
* `time`: Simple string with standard hyphen (`-`), no em-dash (`—`).
* `servings`: Base integer number. **Must match** the base quantities in the ingredient list.

---

## 3. Ingredients Syntax

Every ingredient list item must follow this pattern:

```markdown
## Ingredients

- <span data-qty="12">12</span>egg yolks
- <span data-qty="1000">1000</span>g mascarpone
- <span data-qty="500">500</span>ml strong brewed coffee - cooled
- Frozen dark chocolate bar (bitter, high cacao) - for grating
```

### Critical Spacing Rules:

1. **NO space between `</span>` and unit/word**:
* ✅ `<span data-qty="12">12</span>egg yolks`
* ✅ `<span data-qty="1000">1000</span>g mascarpone`
* ❌ `<span data-qty="12">12</span> egg yolks`
* *Why:* The layout CSS applies `margin-right: 0.25rem` directly to `[data-qty]`. If you add a space in markdown, the browser renders a double space that breaks the strike-through line continuity.


2. **`data-qty` attribute must equal the inner text**:
* `<span data-qty="100">100</span>`
* *Why:* The JavaScript multiplier reads `data-qty` as its reference anchor when scaling servings up or down.


3. **Unmeasured items**:
* Just plain text: `- Frozen dark chocolate bar - for grating`


4. **Notes / Subtext**:
* Use regular hyphens with single spaces: ` - for the yolks` (do NOT use em-dash `—`).



---

## 4. Method Steps Syntax

Numbered steps must follow standard Markdown numbered list syntax:

```markdown
## Method

1. **Prep coffee:** Brew the coffee in advance and let it cool completely to room temperature. Mix in balsamic once fully cooled down (will evaporate if too hot).

2. **Zabaglione base:** In a large bowl, beat the yolks on high speed while gradually adding <span data-qty="100">100</span> g sugar until pale, thick, and doubled in volume.
```

### Critical Numbering Rules:

1. **Always use continuous ascending numbers** (`1.`, `2.`, `3.`, `4.`...):
* Do not restart with `1.` after notes or paragraphs.


2. **Bold step action label**:
* `1. **Action label:** Sentence description follows.`
* Always keep the colon `:` inside or immediately adjacent to the `**`.


3. **Inline quantities in steps (Optional)**:
* You can reuse `<span data-qty="100">100</span>` inside steps. The stepper JS queries all `[data-qty]` elements across the entire page, so step instructions will scale along with the ingredient list.



---

## 5. Notes, Callouts & Sources Syntax

Use the Markdown blockquote marker `>` for tips, warnings, notes, or source attributions:

```markdown
> Take care not to overwhip the mascarpone once added, or the cream can split and turn grainy.
```

### Rules:

* Leave **one empty line before** and **one empty line after** the `>` block.
* Do not manually prefix with `Note:` unless you want the literal word displayed.
* *Why:* The layout CSS aligns `blockquote` directly with the text gutter (`--content-indent: 1.85rem`) and adds a hairline border that tints to terracotta on hover. Using regular paragraphs (`Storage note: ...`) will break this indentation.

### Sources & Attributions:
* When a recipe has a source URL or author attribution (e.g. YouTube video, cookbook, blog), place it at the very end of the recipe using a blockquote:
```markdown
> Recipe by Fredrik Nylén from [Fredriks Fika](https://www.youtube.com/watch?v=-W4BnAn6ezE).
```

---

## 6. Summary Checklist

| Element            | Correct Syntax                                                | Never Do                                       |
| ------------------ | ------------------------------------------------------------- | ---------------------------------------------- |
| **Workflow**       | Create only `src/pages/recipies/<slug>.md`                   | Modifying `RecipeLayout.astro` or other code   |
| **Quantity**       | `<span data-qty="50">50</span>g sugar`                        | `<span data-qty="50">50</span> g sugar`        |
| **Separators**     | ` - for the meringue`                                         | ` — for the meringue` (no em-dashes)           |
| **Notes & Source** | `> Tip or source link goes here`                              | Raw `main p` without `>`                       |
| **Step numbering** | `1.`, `2.`, `3.`, `4.`                                        | Resetting to `1.` after a note                 |
| **Dividers**       | Let section spacing handle it                                 | Do not add `<hr>` or `---`                     |