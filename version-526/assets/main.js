(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    if (slides.length > 1) {
      if (prev) {
        prev.addEventListener('click', function () {
          showSlide(current - 1);
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          showSlide(current + 1);
        });
      }
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          showSlide(dotIndex);
        });
      });
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    var queryInput = filterPanel.querySelector('[data-filter-query]');
    var typeInput = filterPanel.querySelector('[data-filter-type]');
    var regionInput = filterPanel.querySelector('[data-filter-region]');
    var yearInput = filterPanel.querySelector('[data-filter-year]');
    var resetButton = filterPanel.querySelector('[data-filter-reset]');
    var countNode = filterPanel.querySelector('[data-filter-count]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-results] .movie-card'));
    var params = new URLSearchParams(window.location.search);

    var setFromParams = function () {
      if (queryInput && params.get('q')) {
        queryInput.value = params.get('q');
      }
      if (yearInput && params.get('year')) {
        yearInput.value = params.get('year');
      }
    };

    var runFilter = function () {
      var query = queryInput ? queryInput.value.trim().toLowerCase() : '';
      var type = typeInput ? typeInput.value : 'all';
      var region = regionInput ? regionInput.value : 'all';
      var year = yearInput ? yearInput.value : 'all';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.year
        ].join(' ').toLowerCase();
        var ok = true;

        if (query && haystack.indexOf(query) === -1) {
          ok = false;
        }
        if (type !== 'all' && card.dataset.type !== type) {
          ok = false;
        }
        if (region !== 'all' && card.dataset.region !== region) {
          ok = false;
        }
        if (year !== 'all' && card.dataset.year !== year) {
          ok = false;
        }

        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });

      if (countNode) {
        countNode.textContent = visible + ' 部';
      }
    };

    [queryInput, typeInput, regionInput, yearInput].forEach(function (node) {
      if (!node) {
        return;
      }
      node.addEventListener('input', runFilter);
      node.addEventListener('change', runFilter);
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (queryInput) {
          queryInput.value = '';
        }
        if (typeInput) {
          typeInput.value = 'all';
        }
        if (regionInput) {
          regionInput.value = 'all';
        }
        if (yearInput) {
          yearInput.value = 'all';
        }
        runFilter();
      });
    }

    setFromParams();
    runFilter();
  }
})();
