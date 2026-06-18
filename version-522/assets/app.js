(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", panel.classList.contains("is-open"));
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function reset() {
      window.clearInterval(timer);
      start();
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        reset();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        reset();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        reset();
      });
    });
    start();
  }

  function setupFilters() {
    var scope = document.querySelector("[data-filter-scope]");
    if (!scope) {
      return;
    }
    var input = scope.querySelector("[data-filter-input]");
    var yearSelect = scope.querySelector("[data-filter-year]");
    var typeSelect = scope.querySelector("[data-filter-type]");
    var categorySelect = scope.querySelector("[data-filter-category]");
    var reset = scope.querySelector("[data-filter-reset]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".js-search-card"));
    var count = document.querySelector("[data-result-count]");
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (input && query) {
      input.value = query;
    }

    function normalized(value) {
      return String(value || "").trim().toLowerCase();
    }

    function apply() {
      var q = normalized(input && input.value);
      var year = yearSelect ? yearSelect.value : "";
      var type = typeSelect ? typeSelect.value : "";
      var category = categorySelect ? categorySelect.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalized([
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year")
        ].join(" "));
        var matchQuery = !q || haystack.indexOf(q) !== -1;
        var matchYear = !year || card.getAttribute("data-year") === year;
        var matchType = !type || card.getAttribute("data-type") === type;
        var matchCategory = !category || card.getAttribute("data-category") === category;
        var showCard = matchQuery && matchYear && matchType && matchCategory;
        card.classList.toggle("is-hidden", !showCard);
        if (showCard) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = "共 " + visible + " 部影片";
      }
    }

    [input, yearSelect, typeSelect, categorySelect].forEach(function (element) {
      if (element) {
        element.addEventListener("input", apply);
        element.addEventListener("change", apply);
      }
    });

    if (reset) {
      reset.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        if (yearSelect) {
          yearSelect.value = "";
        }
        if (typeSelect) {
          typeSelect.value = "";
        }
        if (categorySelect) {
          categorySelect.value = "";
        }
        apply();
      });
    }

    apply();
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (shell) {
      var video = shell.querySelector("video[data-source]");
      var button = shell.querySelector(".play-overlay");
      if (!video) {
        return;
      }
      var source = video.getAttribute("data-source");
      var prepared = false;
      var hlsInstance = null;

      function prepare() {
        if (prepared || !source) {
          return;
        }
        prepared = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        prepare();
        shell.classList.add("is-started");
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            shell.classList.remove("is-started");
          });
        }
      }

      if (button) {
        button.addEventListener("click", play);
      }
      video.addEventListener("play", function () {
        shell.classList.add("is-started");
      });
      video.addEventListener("loadedmetadata", function () {
        shell.classList.add("is-ready");
      });
      video.addEventListener("error", function () {
        if (hlsInstance && source) {
          hlsInstance.destroy();
          hlsInstance = null;
          prepared = false;
        }
      });
      prepare();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
