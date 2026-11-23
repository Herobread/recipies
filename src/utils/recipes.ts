export interface RecipeEntry {
  frontmatter: {
    title: string;
    time?: string;
  };
  rawContent?: () => string;
}

/** Parse prep minutes from a recipe's `time` string (falling back to the first duration). */
export function parsePrepMinutes(time?: string): number {
  if (!time) return Number.MAX_SAFE_INTEGER;
  const prepMatch = time.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)?\s*prep\b/i);
  const match = prepMatch ?? time.match(/(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes)\b/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  const value = parseFloat(match[1]);
  const unit = (match[2] ?? 'm').toLowerCase();
  return unit.startsWith('h') ? value * 60 : value;
}

/** Build a lowercase search string from a recipe's title and `## Ingredients` section. */
export function extractSearchText(recipe: RecipeEntry): string {
  const raw = typeof recipe.rawContent === 'function' ? recipe.rawContent() : '';
  const ingredientsMatch = raw.match(/##\s+Ingredients\b([\s\S]*?)(?:\n##\s+|$)/i);
  const ingredients = (ingredientsMatch?.[1] ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `${recipe.frontmatter.title} ${ingredients}`.toLowerCase();
}

/** Generate a deterministic `view-transition-name` for a recipe title across index and detail pages. */
export function titleTransitionName(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `recipe-title-${slug}`;
}
