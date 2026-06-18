(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', mobileMenu.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const thumbs = Array.from(hero.querySelectorAll('[data-hero-thumb]'));
    const mainImage = hero.querySelector('[data-hero-main]');
    const mainTitle = hero.querySelector('[data-hero-main-title]');
    const mainMeta = hero.querySelector('[data-hero-main-meta]');
    const backdrop = hero.querySelector('[data-hero-backdrop]');
    let active = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });

      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('is-active', thumbIndex === active);
      });

      const current = slides[active];
      const image = current.getAttribute('data-image');
      const title = current.getAttribute('data-title');
      const meta = current.getAttribute('data-meta');

      if (mainImage && image) {
        mainImage.src = image;
      }

      if (backdrop && image) {
        backdrop.src = image;
      }

      if (mainTitle) {
        mainTitle.textContent = title || '';
      }

      if (mainMeta) {
        mainMeta.textContent = meta || '';
      }
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () {
        showSlide(index);
      });
    });

    showSlide(0);

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  const searchForms = document.querySelectorAll('[data-search-form]');

  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const input = form.querySelector('input[type="search"]');
      const keyword = input ? input.value.trim() : '';
      const url = keyword ? './search.html?q=' + encodeURIComponent(keyword) : './search.html';
      window.location.href = url;
    });
  });

  const liveSearch = document.querySelector('[data-live-search]');
  const filterButtons = Array.from(document.querySelectorAll('[data-filter-button]'));
  const movieCards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const noResults = document.querySelector('[data-no-results]');
  let activeFilter = '';

  function applySearch() {
    const keyword = liveSearch ? liveSearch.value.trim().toLowerCase() : '';
    let visible = 0;

    movieCards.forEach(function (card) {
      const haystack = (card.getAttribute('data-search') || '').toLowerCase();
      const type = (card.getAttribute('data-type') || '').toLowerCase();
      const genre = (card.getAttribute('data-genre') || '').toLowerCase();
      const matchesKeyword = keyword === '' || haystack.indexOf(keyword) !== -1;
      const matchesFilter = activeFilter === '' || type.indexOf(activeFilter) !== -1 || genre.indexOf(activeFilter) !== -1 || haystack.indexOf(activeFilter) !== -1;
      const show = matchesKeyword && matchesFilter;

      card.classList.toggle('hidden-card', !show);

      if (show) {
        visible += 1;
      }
    });

    if (noResults) {
      noResults.classList.toggle('is-visible', visible === 0);
    }
  }

  if (liveSearch) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';

    if (query) {
      liveSearch.value = query;
    }

    liveSearch.addEventListener('input', applySearch);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = (button.getAttribute('data-filter') || '').toLowerCase();
      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      applySearch();
    });
  });

  if (movieCards.length && (liveSearch || filterButtons.length)) {
    applySearch();
  }
})();
