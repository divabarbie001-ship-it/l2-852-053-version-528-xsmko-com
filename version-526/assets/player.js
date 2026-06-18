(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-player-start]');
    var stream = player.getAttribute('data-stream');
    var hlsInstance = null;

    var prepareVideo = function () {
      if (!video || !stream || video.dataset.ready === 'true') {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }

      video.dataset.ready = 'true';
    };

    var start = function () {
      prepareVideo();
      player.classList.add('is-playing');
      if (button) {
        button.hidden = true;
      }
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          video.controls = true;
        });
      }
    };

    if (button) {
      button.addEventListener('click', start);
    }

    player.addEventListener('click', function (event) {
      if (event.target === player) {
        start();
      }
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  });
})();
