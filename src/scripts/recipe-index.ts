/** Initialize search filtering, prep-time sorting, and keyboard navigation on the recipe index. */
export function initRecipeControls() {
  const list = document.getElementById('recipe-index');
  const searchInput = document.getElementById('recipe-search') as HTMLInputElement | null;
  const emptyState = document.getElementById('search-empty');
  const btnName = document.getElementById('sort-name');
  const btnPrep = document.getElementById('sort-prep');
  const prepDir = btnPrep?.querySelector('.sort-dir');
  if (!list || !btnName || !btnPrep || list.dataset.bound === 'true') return;
  list.dataset.bound = 'true';

  const allItems = Array.from(list.querySelectorAll<HTMLAnchorElement>('.recipe-item'));
  let prepAsc = true;
  let selectedItem: HTMLAnchorElement | null = null;

  function setSelected(item: HTMLAnchorElement | null) {
    if (selectedItem) {
      selectedItem.classList.remove('is-selected');
      selectedItem.removeAttribute('aria-selected');
    }
    selectedItem = item;
    if (!selectedItem) {
      searchInput?.removeAttribute('aria-activedescendant');
      return;
    }
    selectedItem.classList.add('is-selected');
    selectedItem.setAttribute('aria-selected', 'true');
    if (selectedItem.id) {
      searchInput?.setAttribute('aria-activedescendant', selectedItem.id);
    }
    selectedItem.scrollIntoView({ block: 'nearest' });
  }

  function sortItems(mode: 'name' | 'prep') {
    if (!list || !btnName || !btnPrep) return;

    allItems.sort((a, b) => {
      const indexA = Number(a.dataset.index ?? 0);
      const indexB = Number(b.dataset.index ?? 0);
      if (mode === 'name') return indexA - indexB;

      const prepA = Number(a.dataset.prepMinutes ?? Number.MAX_SAFE_INTEGER);
      const prepB = Number(b.dataset.prepMinutes ?? Number.MAX_SAFE_INTEGER);
      if (prepA !== prepB) return prepAsc ? prepA - prepB : prepB - prepA;
      return indexA - indexB;
    });

    for (const item of allItems) list.appendChild(item);
    if (emptyState) list.appendChild(emptyState);
    if (selectedItem && !selectedItem.hidden) {
      selectedItem.scrollIntoView({ block: 'nearest' });
    }

    const isPrep = mode === 'prep';
    btnName.setAttribute('aria-pressed', String(!isPrep));
    btnPrep.setAttribute('aria-pressed', String(isPrep));
    if (prepDir) prepDir.textContent = prepAsc ? '↑' : '↓';
  }

  function filterItems() {
    if (!searchInput) return;
    const terms = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let visibleCount = 0;

    for (const item of allItems) {
      const haystack = item.dataset.search ?? '';
      const matches = terms.length === 0 || terms.every((term) => haystack.includes(term));
      item.hidden = !matches;
      if (matches) visibleCount++;
    }

    if (selectedItem?.hidden) setSelected(null);
    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  function stepSelection(direction: 1 | -1) {
    const visible = allItems.filter((item) => !item.hidden);
    if (visible.length === 0) return;

    const currentIdx = selectedItem ? visible.indexOf(selectedItem) : -1;
    if (direction === -1 && currentIdx <= 0) {
      setSelected(null);
      searchInput?.focus();
      return;
    }

    const nextIdx =
      direction === 1
        ? currentIdx < visible.length - 1
          ? currentIdx + 1
          : 0
        : currentIdx - 1;

    if (document.activeElement === searchInput) searchInput?.blur();
    setSelected(visible[nextIdx]);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.isComposing) return;

    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput?.focus();
      searchInput?.select();
      return;
    }

    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const active = document.activeElement;
    const isEditable =
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement ||
      (active instanceof HTMLElement && active.isContentEditable);

    if (e.key === '/' && !isEditable) {
      e.preventDefault();
      searchInput?.focus();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      stepSelection(e.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    const canActivateSelected =
      active === searchInput || active === document.body || active === document.documentElement;
    if (e.key === 'Enter' && selectedItem && !selectedItem.hidden && canActivateSelected) {
      e.preventDefault();
      selectedItem.click();
      return;
    }

    if (e.key === 'Escape' && selectedItem) {
      e.preventDefault();
      setSelected(null);
    }
  }

  searchInput?.addEventListener('input', filterItems);
  document.addEventListener('keydown', handleKeydown);

  btnName.addEventListener('click', () => {
    prepAsc = true;
    sortItems('name');
  });

  btnPrep.addEventListener('click', () => {
    prepAsc = btnPrep.getAttribute('aria-pressed') === 'true' ? !prepAsc : true;
    sortItems('prep');
  });
}

document.addEventListener('astro:page-load', initRecipeControls);
if (document.readyState !== 'loading') initRecipeControls();
else document.addEventListener('DOMContentLoaded', initRecipeControls);
