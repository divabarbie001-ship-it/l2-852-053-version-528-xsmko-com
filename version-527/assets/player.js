function initMoviePlayer(streamUrl) {
    var video = document.querySelector("[data-player]");
    var cover = document.querySelector("[data-player-cover]");
    var loaded = false;
    var hlsInstance = null;

    if (!video || !streamUrl) {
        return;
    }

    function attachSource() {
        if (loaded) {
            return Promise.resolve();
        }
        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            video.load();
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
            return Promise.resolve();
        }

        video.src = streamUrl;
        video.load();
        return Promise.resolve();
    }

    function playVideo() {
        attachSource().then(function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var playTask = video.play();
            if (playTask && typeof playTask.catch === "function") {
                playTask.catch(function () {});
            }
        });
    }

    if (cover) {
        cover.addEventListener("click", playVideo);
    }

    video.addEventListener("click", function () {
        if (!loaded) {
            playVideo();
            return;
        }
        if (video.paused) {
            video.play().catch(function () {});
        } else {
            video.pause();
        }
    });

    video.addEventListener("play", function () {
        if (cover) {
            cover.classList.add("is-hidden");
        }
    });

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}
