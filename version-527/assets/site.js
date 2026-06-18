(function () {
    var header = document.querySelector("[data-header]");
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    function updateHeader() {
        if (!header) {
            return;
        }
        header.classList.toggle("is-scrolled", window.scrollY > 16);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var previous = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (previous) {
            previous.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        start();
    }

    var query = new URLSearchParams(window.location.search).get("q") || "";
    var searchInput = document.querySelector("[data-search-input]");
    if (searchInput && query) {
        searchInput.value = query;
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    if (filterPanel) {
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
        var buttons = Array.prototype.slice.call(filterPanel.querySelectorAll("[data-filter-value]"));
        var selected = "all";

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilter() {
            var term = normalize(searchInput ? searchInput.value : "");
            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute("data-search-text"));
                var region = card.getAttribute("data-region") || "";
                var year = card.getAttribute("data-year") || "";
                var matchedTerm = !term || haystack.indexOf(term) !== -1;
                var matchedFilter = selected === "all" || region === selected || year === selected;
                card.classList.toggle("is-hidden", !(matchedTerm && matchedFilter));
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilter);
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                selected = button.getAttribute("data-filter-value") || "all";
                buttons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                applyFilter();
            });
        });

        applyFilter();
    }
}());
