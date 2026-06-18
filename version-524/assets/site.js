(function () {
  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-mobile-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (!button || !menu) {
      return;
    }

    button.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }
  }

  function setupFilters() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    if (!cards.length) {
      return;
    }

    var searchInput = document.querySelector('[data-search-input]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var yearSelect = document.querySelector('[data-filter-year]');
    var clearButton = document.querySelector('[data-clear-filters]');
    var countLabel = document.querySelector('[data-filter-count]');
    var emptyState = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var queryFromUrl = params.get('q');

    if (searchInput && queryFromUrl) {
      searchInput.value = queryFromUrl;
    }

    function cardText(card) {
      return normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-category'),
        card.textContent
      ].join(' '));
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : '');
      var typeValue = normalize(typeSelect ? typeSelect.value : '');
      var yearValue = normalize(yearSelect ? yearSelect.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var text = cardText(card);
        var typeText = normalize(card.getAttribute('data-type'));
        var yearText = normalize(card.getAttribute('data-year'));
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }

        if (typeValue && typeText.indexOf(typeValue) === -1) {
          matched = false;
        }

        if (yearValue && yearText !== yearValue) {
          matched = false;
        }

        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (countLabel) {
        countLabel.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 部影片';
      }

      if (emptyState) {
        emptyState.hidden = visible > 0;
      }
    }

    [searchInput, typeSelect, yearSelect].forEach(function (control) {
      if (!control) {
        return;
      }

      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    });

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
        }

        if (typeSelect) {
          typeSelect.value = '';
        }

        if (yearSelect) {
          yearSelect.value = '';
        }

        applyFilters();
      });
    }

    applyFilters();
  }

  setupMobileMenu();
  setupHero();
  setupFilters();
})();
