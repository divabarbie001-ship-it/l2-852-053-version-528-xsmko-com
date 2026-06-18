const Hls = window.Hls;

document.querySelectorAll('[data-player]').forEach(function (player) {
  const video = player.querySelector('video');
  const source = video ? video.querySelector('source') : null;
  const cover = player.querySelector('.play-cover');
  const playButton = player.querySelector('.player-play');
  const muteButton = player.querySelector('.player-mute');
  const fullscreenButton = player.querySelector('.player-fullscreen');
  const message = player.querySelector('[data-player-message]');
  const url = source ? source.getAttribute('src') : '';
  let hls = null;
  let ready = false;

  if (!video || !url) {
    return;
  }

  const showMessage = function (text) {
    if (message) {
      message.textContent = text;
    }
    player.classList.add('has-message');
    player.classList.remove('loading');
  };

  const init = function () {
    if (ready) {
      return;
    }

    ready = true;
    player.classList.add('loading');

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        player.classList.remove('loading');
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        showMessage('暂时无法播放，请稍后再试。');
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', function () {
        player.classList.remove('loading');
      }, { once: true });
      video.addEventListener('error', function () {
        showMessage('暂时无法播放，请稍后再试。');
      });
    } else {
      showMessage('当前设备暂时无法播放此影片。');
    }
  };

  const updatePlayState = function () {
    const playing = !video.paused && !video.ended;
    player.classList.toggle('playing', playing);
    if (playButton) {
      playButton.textContent = playing ? '暂停' : '▶';
    }
  };

  const start = function () {
    init();
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        showMessage('点击播放按钮开始观看。');
      });
    }
  };

  const togglePlay = function () {
    if (video.paused || video.ended) {
      start();
    } else {
      video.pause();
    }
  };

  if (cover) {
    cover.addEventListener('click', start);
  }

  video.addEventListener('click', togglePlay);
  video.addEventListener('play', updatePlayState);
  video.addEventListener('pause', updatePlayState);
  video.addEventListener('ended', updatePlayState);
  video.addEventListener('waiting', function () {
    player.classList.add('loading');
  });
  video.addEventListener('canplay', function () {
    player.classList.remove('loading');
  });

  if (playButton) {
    playButton.addEventListener('click', togglePlay);
  }

  if (muteButton) {
    muteButton.addEventListener('click', function () {
      video.muted = !video.muted;
      muteButton.textContent = video.muted ? '静音' : '声音';
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (player.requestFullscreen) {
        player.requestFullscreen();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
