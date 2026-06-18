
(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var header = document.querySelector(".site-header");
    var button = document.querySelector(".menu-button");
    if (!header || !button) {
      return;
    }
    button.addEventListener("click", function () {
      header.classList.toggle("menu-open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (!slides.length || !dots.length) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("active", idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("active", idx === current);
      });
    }
    function play() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(idx);
        play();
      });
    });
    play();
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function filterCards(input, cards) {
    var keyword = normalize(input.value);
    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-search") || card.textContent);
      card.classList.toggle("is-hidden", keyword && haystack.indexOf(keyword) === -1);
    });
  }

  function initLocalSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".local-search"));
    inputs.forEach(function (input) {
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      input.addEventListener("input", function () {
        filterCards(input, cards);
      });
    });
  }

  function initGlobalSearch() {
    var input = document.getElementById("searchInput");
    var results = document.getElementById("searchResults");
    if (!input || !results) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    var cards = Array.prototype.slice.call(results.querySelectorAll(".movie-card"));
    input.value = q;
    filterCards(input, cards);
    input.addEventListener("input", function () {
      filterCards(input, cards);
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initLocalSearch();
    initGlobalSearch();
  });
})();

function initializeMoviePlayer(streamUrl) {
  var video = document.getElementById("moviePlayer");
  var overlay = document.getElementById("playerOverlay");
  var hlsInstance = null;
  var prepared = false;

  if (!video || !streamUrl) {
    return;
  }

  function prepare() {
    if (prepared) {
      return;
    }
    prepared = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function play() {
    prepare();
    if (overlay) {
      overlay.classList.add("hidden");
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener("click", play);
  }
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("hidden");
    }
  });
  video.addEventListener("emptied", function () {
    if (hlsInstance && typeof hlsInstance.destroy === "function") {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    prepared = false;
  });
}
