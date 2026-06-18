(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      menu.classList.toggle('is-open');
      button.setAttribute('aria-expanded', menu.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  function setupHeroSlider() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', slider);
    var dots = selectAll('[data-hero-dot]', slider);
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
        dot.setAttribute('aria-pressed', current === index ? 'true' : 'false');
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, current) {
      dot.addEventListener('click', function () {
        stop();
        show(current);
        start();
      });
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var panels = selectAll('[data-filter-panel]');
    panels.forEach(function (panel) {
      var scope = document.querySelector(panel.getAttribute('data-filter-panel')) || document;
      var cards = selectAll('[data-filter-card]', scope);
      var empty = scope.querySelector('[data-empty-state]');
      var inputs = selectAll('[data-filter-input]', panel);
      if (!cards.length || !inputs.length) {
        return;
      }

      function value(name) {
        var el = panel.querySelector('[data-filter-input="' + name + '"]');
        return el ? el.value.trim().toLowerCase() : '';
      }

      function apply() {
        var keyword = value('keyword');
        var year = value('year');
        var type = value('type');
        var region = value('region');
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-tags') + ' ' + card.textContent).toLowerCase();
          var matched = true;
          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }
          if (year && (card.getAttribute('data-year') || '').toLowerCase() !== year) {
            matched = false;
          }
          if (type && (card.getAttribute('data-type') || '').toLowerCase() !== type) {
            matched = false;
          }
          if (region && (card.getAttribute('data-region') || '').toLowerCase() !== region) {
            matched = false;
          }
          card.classList.toggle('is-hidden-card', !matched);
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      inputs.forEach(function (input) {
        input.addEventListener('input', apply);
        input.addEventListener('change', apply);
      });
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      var keywordInput = panel.querySelector('[data-filter-input="keyword"]');
      if (query && keywordInput && !keywordInput.value) {
        keywordInput.value = query;
      }
      apply();
    });
  }

  function setupPlayer(videoId, coverId, source) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    if (!video || !cover || !source) {
      return;
    }
    var loaded = false;
    var hls = null;

    function begin() {
      cover.classList.add('is-hidden');
      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        loaded = true;
      }
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    cover.addEventListener('click', begin);
    video.addEventListener('click', function () {
      if (!loaded) {
        begin();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.SitePlayer = setupPlayer;

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHeroSlider();
    setupFilters();
  });
})();
