import { H as Hls } from './hls-player.js';

function setupMoviePlayer() {
  const video = document.getElementById('movie-player');
  const trigger = document.getElementById('play-trigger');
  if (!video) {
    return;
  }
  const source = video.getAttribute('src');
  let initialized = false;
  let hls = null;

  function initialize() {
    if (initialized || !source) {
      return;
    }
    initialized = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }
    if (Hls && Hls.isSupported()) {
      video.removeAttribute('src');
      video.load();
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }
    video.src = source;
  }

  function play() {
    initialize();
    if (trigger) {
      trigger.classList.add('is-hidden');
    }
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        if (trigger) {
          trigger.classList.remove('is-hidden');
        }
      });
    }
  }

  if (trigger) {
    trigger.addEventListener('click', play);
  }
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener('play', function () {
    if (trigger) {
      trigger.classList.add('is-hidden');
    }
  });
  video.addEventListener('ended', function () {
    if (trigger) {
      trigger.classList.remove('is-hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

document.addEventListener('DOMContentLoaded', setupMoviePlayer);
