(function () {
  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var message = shell.querySelector('[data-player-message]');
    var source = shell.getAttribute('data-video-src');
    var hls = null;
    var initialized = false;

    function setMessage(text) {
      if (message) {
        message.textContent = text;
      }
    }

    function initialize() {
      if (initialized || !video || !source) {
        return;
      }

      initialized = true;
      setMessage('正在加载高清播放源...');

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage('播放源已就绪，点击画面可暂停或继续。');
        });
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            setMessage('视频加载失败，请稍后重试。');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function () {
          setMessage('播放源已就绪，点击画面可暂停或继续。');
        });
      } else {
        setMessage('当前浏览器不支持 HLS 播放。');
      }
    }

    function playOrPause() {
      initialize();

      if (!video) {
        return;
      }

      if (video.paused) {
        video.play().then(function () {
          shell.classList.add('playing');
        }).catch(function () {
          setMessage('浏览器阻止了自动播放，请再次点击播放。');
        });
      } else {
        video.pause();
        shell.classList.remove('playing');
      }
    }

    if (button) {
      button.addEventListener('click', playOrPause);
    }

    if (video) {
      video.addEventListener('click', playOrPause);
      video.addEventListener('play', function () {
        shell.classList.add('playing');
      });
      video.addEventListener('pause', function () {
        shell.classList.remove('playing');
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-hls-player]'), setupPlayer);
})();
