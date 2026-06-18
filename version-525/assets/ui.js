(function () {
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function qsa(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  function setupMobileNav() {
    var button = qs('.mobile-toggle');
    var nav = qs('.mobile-nav');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function setupHero() {
    var slides = qsa('.hero-slide');
    var dots = qsa('.hero-dot');
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }
    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-slide')) || 0);
        start();
      });
    });
    start();
  }

  function cardText(card) {
    return [
      card.getAttribute('data-title') || '',
      card.getAttribute('data-category') || '',
      card.getAttribute('data-genre') || '',
      card.getAttribute('data-tags') || '',
      card.getAttribute('data-year') || '',
      card.getAttribute('data-region') || ''
    ].join(' ').toLowerCase();
  }

  function updateCount(grid) {
    var selector = '#' + grid.id;
    var countNode = qs('[data-count-for="' + selector + '"]');
    if (!countNode && grid.id === 'site-search-grid') {
      countNode = qs('#searchCount');
    }
    if (!countNode) {
      return;
    }
    var visible = qsa('.movie-card:not(.hidden-by-filter)', grid).length;
    countNode.textContent = visible + ' 部影片';
  }

  function applyGenericFilters(grid) {
    var input = qs('[data-grid-filter="#' + grid.id + '"]');
    var yearSelect = qs('[data-year-filter="#' + grid.id + '"]');
    var query = input ? input.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    qsa('.movie-card', grid).forEach(function (card) {
      var matchedQuery = !query || cardText(card).indexOf(query) !== -1;
      var matchedYear = !year || card.getAttribute('data-year') === year;
      card.classList.toggle('hidden-by-filter', !(matchedQuery && matchedYear));
    });
    updateCount(grid);
  }

  function sortGrid(grid, mode) {
    if (!mode || mode === 'default') {
      return;
    }
    var cards = qsa('.movie-card', grid);
    cards.sort(function (a, b) {
      if (mode === 'views') {
        return Number(b.getAttribute('data-views') || 0) - Number(a.getAttribute('data-views') || 0);
      }
      if (mode === 'year') {
        return Number(b.getAttribute('data-year') || 0) - Number(a.getAttribute('data-year') || 0);
      }
      return 0;
    });
    cards.forEach(function (card) {
      grid.appendChild(card);
    });
  }

  function setupCategoryFilters() {
    qsa('[data-grid-filter]').forEach(function (input) {
      var selector = input.getAttribute('data-grid-filter');
      var grid = qs(selector);
      if (grid) {
        input.addEventListener('input', function () {
          applyGenericFilters(grid);
        });
      }
    });
    qsa('[data-year-filter]').forEach(function (select) {
      var selector = select.getAttribute('data-year-filter');
      var grid = qs(selector);
      if (grid) {
        select.addEventListener('change', function () {
          applyGenericFilters(grid);
        });
      }
    });
    qsa('[data-sort-grid]').forEach(function (select) {
      var selector = select.getAttribute('data-sort-grid');
      var grid = qs(selector);
      if (grid) {
        select.addEventListener('change', function () {
          sortGrid(grid, select.value);
          applyGenericFilters(grid);
        });
      }
    });
  }

  function setupSearchPage() {
    var grid = qs('#site-search-grid');
    if (!grid) {
      return;
    }
    var input = qs('#searchInput');
    var category = qs('#categoryFilter');
    var year = qs('#yearFilter');
    var region = qs('#regionFilter');
    var clear = qs('#clearSearch');
    var params = new URLSearchParams(window.location.search);
    if (input && params.get('q')) {
      input.value = params.get('q');
    }
    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var cat = category ? category.value : '';
      var yr = year ? year.value : '';
      var reg = region ? region.value : '';
      qsa('.movie-card', grid).forEach(function (card) {
        var matchedQuery = !query || cardText(card).indexOf(query) !== -1;
        var matchedCategory = !cat || card.getAttribute('data-category') === cat;
        var matchedYear = !yr || card.getAttribute('data-year') === yr;
        var matchedRegion = !reg || card.getAttribute('data-region') === reg;
        card.classList.toggle('hidden-by-filter', !(matchedQuery && matchedCategory && matchedYear && matchedRegion));
      });
      updateCount(grid);
    }
    [input, category, year, region].forEach(function (node) {
      if (node) {
        node.addEventListener(node.tagName === 'INPUT' ? 'input' : 'change', apply);
      }
    });
    if (clear) {
      clear.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        if (category) {
          category.value = '';
        }
        if (year) {
          year.value = '';
        }
        if (region) {
          region.value = '';
        }
        apply();
      });
    }
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileNav();
    setupHero();
    setupCategoryFilters();
    setupSearchPage();
  });
})();
