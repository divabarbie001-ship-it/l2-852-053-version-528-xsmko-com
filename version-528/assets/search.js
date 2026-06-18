(function () {
  const movies = window.SEARCH_MOVIES || [];
  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim();
  const input = document.querySelector('[data-search-page-form] input[name="q"]');
  const title = document.querySelector('[data-search-title]');
  const results = document.querySelector('[data-search-results]');
  const empty = document.querySelector('[data-search-empty]');

  if (input) {
    input.value = query;
  }

  const createCard = function (movie) {
    const tags = movie.tags.slice(0, 2).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '<article class="movie-card poster">' +
      '<a href="' + movie.url + '" class="movie-cover" aria-label="观看' + escapeHtml(movie.title) + '">' +
      '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="cover-badge">' + escapeHtml(movie.category) + '</span>' +
      '<span class="cover-play">▶</span>' +
      '</a>' +
      '<div class="movie-info">' +
      '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>' +
      '<p>' + escapeHtml(movie.desc) + '</p>' +
      '<div class="movie-tags">' + tags + '</div>' +
      '<div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span><span>★ ' + escapeHtml(movie.rating) + '</span></div>' +
      '</div>' +
      '</article>';
  };

  const escapeHtml = function (value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  };

  if (!results || !empty) {
    return;
  }

  if (!query) {
    empty.classList.add('show');
    return;
  }

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matched = movies.filter(function (movie) {
    const haystack = [movie.title, movie.desc, movie.region, movie.type, movie.year, movie.genre, movie.category, movie.tags.join(' ')].join(' ').toLowerCase();
    return words.every(function (word) {
      return haystack.includes(word);
    });
  }).slice(0, 160);

  if (title) {
    title.textContent = '“' + query + '”的搜索结果';
  }

  if (!matched.length) {
    empty.textContent = '没有匹配的影片';
    empty.classList.add('show');
    return;
  }

  empty.classList.remove('show');
  results.innerHTML = matched.map(createCard).join('');
})();
