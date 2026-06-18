(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        var isOpen = mobileNav.hasAttribute('hidden') === false;
        if (isOpen) {
          mobileNav.setAttribute('hidden', '');
          menuButton.setAttribute('aria-expanded', 'false');
        } else {
          mobileNav.removeAttribute('hidden');
          menuButton.setAttribute('aria-expanded', 'true');
        }
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, idx) {
          slide.classList.toggle('is-active', idx === current);
        });
        dots.forEach(function (dot, idx) {
          dot.classList.toggle('is-active', idx === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(Number(dot.getAttribute('data-slide') || 0));
          start();
        });
      });

      var prev = hero.querySelector('.hero-prev');
      var next = hero.querySelector('.hero-next');
      if (prev) {
        prev.addEventListener('click', function () {
          show(current - 1);
          start();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          show(current + 1);
          start();
        });
      }

      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      show(0);
      start();
    }

    var searchInput = document.getElementById('site-search-input');
    var searchResults = document.getElementById('search-results');
    var searchStatus = document.getElementById('search-status');

    if (searchInput && searchResults && searchStatus) {
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q') || '';
      searchInput.value = initialQuery;

      function normalize(value) {
        return String(value || '').toLowerCase().trim();
      }

      function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (char) {
          return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
          }[char];
        });
      }

      function card(movie) {
        return [
          '<article class="movie-card movie-card-normal">',
          '<a href="' + escapeHtml(movie.url) + '" class="card-link">',
          '<div class="poster" style="--poster-url: url(\'' + escapeHtml(movie.cover) + '\');">',
          '<span class="poster-badge">' + escapeHtml(movie.category) + '</span>',
          '<span class="poster-play">▶</span>',
          '</div>',
          '<div class="card-body">',
          '<h3>' + escapeHtml(movie.title) + '</h3>',
          '<p>' + escapeHtml(movie.oneLine) + '</p>',
          '<div class="card-meta"><span>' + escapeHtml(movie.genre) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
          '</div>',
          '</a>',
          '</article>'
        ].join('');
      }

      function runSearch() {
        var query = normalize(searchInput.value);
        if (!query) {
          searchResults.innerHTML = '';
          searchStatus.textContent = '请输入关键词开始搜索。';
          return;
        }

        var data = Array.isArray(window.MOVIE_SEARCH_DATA) ? window.MOVIE_SEARCH_DATA : [];
        var results = data.filter(function (movie) {
          var haystack = normalize([
            movie.title,
            movie.region,
            movie.year,
            movie.genre,
            movie.category,
            movie.oneLine,
            Array.isArray(movie.tags) ? movie.tags.join(' ') : ''
          ].join(' '));
          return haystack.indexOf(query) !== -1;
        }).slice(0, 80);

        searchStatus.textContent = results.length ? '已找到相关影片，点击卡片可进入详情。' : '没有找到匹配结果，请尝试更换关键词。';
        searchResults.innerHTML = results.map(card).join('');
      }

      searchInput.addEventListener('input', runSearch);
      runSearch();
    }
  });
})();
