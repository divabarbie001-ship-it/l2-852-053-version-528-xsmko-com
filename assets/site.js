(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  document.querySelectorAll('form[role="search"]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      const input = form.querySelector('input[type="search"], input[name="q"], input');
      const value = input ? input.value.trim() : '';
      if (!value) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      const action = form.getAttribute('action') || 'search.html';
      window.location.href = action + '?q=' + encodeURIComponent(value);
    });
  });

  const backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('show', window.scrollY > 400);
    });
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const filterPanel = document.querySelector('[data-filter-panel]');
  const filterCards = Array.from(document.querySelectorAll('[data-filter-card]'));
  const emptyState = document.querySelector('[data-empty-state]');

  if (filterPanel && filterCards.length) {
    const keywordInput = filterPanel.querySelector('[data-filter-keyword]');
    const yearSelect = filterPanel.querySelector('[data-filter-year]');
    const typeSelect = filterPanel.querySelector('[data-filter-type]');

    const applyFilter = function () {
      const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      const year = yearSelect ? yearSelect.value : '';
      const type = typeSelect ? typeSelect.value : '';
      let visible = 0;

      filterCards.forEach(function (card) {
        const haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-type') || '',
          card.getAttribute('data-year') || ''
        ].join(' ').toLowerCase();
        const matchKeyword = !keyword || haystack.includes(keyword);
        const matchYear = !year || card.getAttribute('data-year') === year;
        const matchType = !type || card.getAttribute('data-type') === type;
        const show = matchKeyword && matchYear && matchType;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('show', visible === 0);
      }
    };

    [keywordInput, yearSelect, typeSelect].forEach(function (item) {
      if (item) {
        item.addEventListener('input', applyFilter);
        item.addEventListener('change', applyFilter);
      }
    });
  }
})();
