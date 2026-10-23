/*
 * Skyshore music player — self-hosted, no dependencies.
 *
 * Usage (see index.html, "My Work" section):
 *   <div class="sk-player" data-sk-player>
 *     <script type="application/json">
 *       [ { "title": "Dungblaster", "artist": "Reamped, Mixed, Mastered",
 *           "src": "media/audio/dungblaster.mp3", "cover": "media/covers/dungblaster.jpg" } ]
 *     </script>
 *   </div>
 *
 * Or from JS:  SkyshorePlayer(element, tracks)
 */
(function () {
    "use strict";

    const ICONS = {
        play: '<svg viewBox="0 0 17 21" aria-hidden="true"><path d="M0 1.6C0 .4 1.3-.4 2.4.3l13.9 8.6c1 .6 1 2 0 2.6L2.4 20.1C1.3 20.8 0 20 0 18.8z"/></svg>',
        pause: '<svg viewBox="0 0 17 21" aria-hidden="true"><path d="M1.5 0h4.2v21H1.5zM11.3 0h4.2v21h-4.2z"/></svg>',
        prev: '<svg viewBox="0 0 16 11" aria-hidden="true" style="transform:scaleX(-1)"><path d="M0 .9v9.2c0 .7.8 1.1 1.4.7l6.2-4.6c.5-.4.5-1.1 0-1.4L1.4.2C.8-.2 0 .2 0 .9zm8 0v9.2c0 .7.8 1.1 1.4.7l6.2-4.6c.5-.4.5-1.1 0-1.4L9.4.2C8.8-.2 8 .2 8 .9z"/></svg>',
        next: '<svg viewBox="0 0 16 11" aria-hidden="true"><path d="M0 .9v9.2c0 .7.8 1.1 1.4.7l6.2-4.6c.5-.4.5-1.1 0-1.4L1.4.2C.8-.2 0 .2 0 .9zm8 0v9.2c0 .7.8 1.1 1.4.7l6.2-4.6c.5-.4.5-1.1 0-1.4L9.4.2C8.8-.2 8 .2 8 .9z"/></svg>',
        shuffle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3l4 4-4 4V8h-2.2l-3 3.5-1.3-1.5 3.4-4H17V3zM3 6h4.6l9.2 11H17v-3l4 4-4 4v-3h-1.1L6.7 8H3V6zm0 10h3.7l2.1-2.5 1.3 1.5L7.6 18H3v-2z"/></svg>',
        vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
        mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm16.6 3 2.1-2.1-1.4-1.4-2.1 2.1-2.1-2.1-1.4 1.4 2.1 2.1-2.1 2.1 1.4 1.4 2.1-2.1 2.1 2.1 1.4-1.4z"/></svg>',
        gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1l.3 2.6h4l.4-2.6a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
        list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h2v2H3zm4 0h14v2H7zM3 11h2v2H3zm4 0h14v2H7zM3 17h2v2H3zm4 0h14v2H7z"/></svg>',
    };

    const fmt = (s) => {
        if (!isFinite(s) || s < 0) return "0:00";
        const m = Math.floor(s / 60);
        return m + ":" + String(Math.floor(s % 60)).padStart(2, "0");
    };

    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    function SkyshorePlayer(root, tracks) {
        if (!tracks) {
            const json = root.querySelector('script[type="application/json"]');
            tracks = json ? JSON.parse(json.textContent) : [];
        }
        if (!tracks.length) return;

        root.classList.add("sk-player");
        root.innerHTML = `<div class="sk-inner">
            <div class="sk-now">
                <div class="sk-cover" role="img"></div>
                <div class="sk-main">
                    <div class="sk-info">
                        <div class="sk-title"></div>
                        <div class="sk-artist"></div>
                    </div>
                    <div class="sk-times"><span class="sk-cur">0:00</span><span class="sk-dur">0:00</span></div>
                    <div class="sk-bar" role="slider" tabindex="0" aria-label="Seek"
                         aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                        <div class="sk-bar-track"><div class="sk-bar-buffer"></div><div class="sk-bar-fill"></div></div>
                    </div>
                    <div class="sk-controls">
                        <button class="sk-btn sk-prev" aria-label="Previous track">${ICONS.prev}</button>
                        <button class="sk-btn sk-play" aria-label="Play">${ICONS.play}</button>
                        <button class="sk-btn sk-next" aria-label="Next track">${ICONS.next}</button>
                        <span class="sk-spacer"></span>
                        <button class="sk-btn sk-shuffle" aria-label="Shuffle" aria-pressed="false">${ICONS.shuffle}</button>
                        <div class="sk-vol-wrap">
                            <button class="sk-btn sk-mute" aria-label="Mute">${ICONS.vol}</button>
                            <div class="sk-vol-pop"><input type="range" min="0" max="1" step="0.01" value="1" aria-label="Volume"></div>
                        </div>
                        <div class="sk-more-wrap">
                            <button class="sk-btn sk-more" aria-label="More options" aria-expanded="false">${ICONS.gear}</button>
                            <div class="sk-menu" hidden>
                                <button class="sk-menu-item sk-menu-shuffle" aria-pressed="false">${ICONS.shuffle}<span>Shuffle</span></button>
                                <button class="sk-menu-item sk-menu-mute">${ICONS.vol}<span>Mute</span></button>
                            </div>
                        </div>
                        <button class="sk-btn sk-toggle-list is-on" aria-label="Hide playlist" aria-pressed="true">${ICONS.list}</button>
                    </div>
                </div>
            </div>
            <ol class="sk-list">
                ${tracks.map((t, i) => `
                <li class="sk-row" tabindex="0" data-i="${i}">
                    <span class="sk-thumb"${t.cover ? ` style="background-image:url('${esc(encodeURI(t.cover))}')"` : ""}></span>
                    <span style="min-width:0">
                        <div class="sk-row-title">${esc(t.title)}</div>
                        <div class="sk-row-artist">${esc(t.artist)}</div>
                    </span>
                    <span class="sk-row-dur"></span>
                </li>`).join("")}
            </ol>
        </div>`;

        const $ = (s) => root.querySelector(s);
        const audio = new Audio();
        audio.preload = "metadata";

        const el = {
            cover: $(".sk-cover"), title: $(".sk-title"), artist: $(".sk-artist"),
            cur: $(".sk-cur"), dur: $(".sk-dur"),
            bar: $(".sk-bar"), fill: $(".sk-bar-fill"), buffer: $(".sk-bar-buffer"),
            play: $(".sk-play"), prev: $(".sk-prev"), next: $(".sk-next"),
            shuffle: $(".sk-shuffle"), mute: $(".sk-mute"), vol: $(".sk-vol-pop input"),
            more: $(".sk-more"), menu: $(".sk-menu"),
            menuShuffle: $(".sk-menu-shuffle"), menuMute: $(".sk-menu-mute"),
            listBtn: $(".sk-toggle-list"), list: $(".sk-list"),
            rows: [...root.querySelectorAll(".sk-row")],
        };

        let index = 0;
        let shuffle = false;

        // Fill playlist durations from metadata, without downloading whole files.
        tracks.forEach((t, i) => {
            const probe = new Audio();
            probe.preload = "metadata";
            probe.addEventListener("loadedmetadata", () => {
                el.rows[i].querySelector(".sk-row-dur").textContent = fmt(probe.duration);
                probe.removeAttribute("src");
            }, { once: true });
            probe.src = t.src;
        });

        function updateProgress() {
            const d = audio.duration;
            const pct = d ? (audio.currentTime / d) * 100 : 0;
            el.fill.style.width = pct + "%";
            el.cur.textContent = fmt(audio.currentTime);
            el.bar.setAttribute("aria-valuenow", Math.round(pct));
            if (d && audio.buffered.length) {
                el.buffer.style.width = (audio.buffered.end(audio.buffered.length - 1) / d) * 100 + "%";
            }
            el.prev.disabled = index === 0 && audio.currentTime < 3 && !shuffle;
        }

        function setPlayingUI(on) {
            root.classList.toggle("is-playing", on);
            el.play.innerHTML = on ? ICONS.pause : ICONS.play;
            el.play.setAttribute("aria-label", on ? "Pause" : "Play");
        }

        function load(i, autoplay) {
            index = (i + tracks.length) % tracks.length;
            const t = tracks[index];
            el.title.textContent = t.title || "";
            el.artist.textContent = t.artist || "";
            el.cover.classList.toggle("sk-cover--empty", !t.cover);
            el.cover.style.backgroundImage = t.cover ? `url("${encodeURI(t.cover)}")` : "";
            el.cover.setAttribute("aria-label", t.cover ? `${t.title} cover art` : "Skyshore Recordings");
            el.rows.forEach((r, k) => r.classList.toggle("is-active", k === index));
            el.dur.textContent = "0:00";
            el.buffer.style.width = "0";
            audio.src = t.src;
            updateProgress();
            if (autoplay) audio.play().catch(() => setPlayingUI(false));
        }

        function nextIndex() {
            if (!shuffle || tracks.length < 2) return index + 1;
            let n;
            do { n = Math.floor(Math.random() * tracks.length); } while (n === index);
            return n;
        }

        function toggle() {
            if (audio.paused) audio.play().catch(() => {});
            else audio.pause();
        }

        function seekFromEvent(e) {
            const r = el.bar.getBoundingClientRect();
            const x = Math.min(Math.max(0, e.clientX - r.left), r.width);
            if (audio.duration) audio.currentTime = (x / r.width) * audio.duration;
            updateProgress();
        }

        // --- controls ---
        el.play.addEventListener("click", toggle);
        el.prev.addEventListener("click", () => {
            if (audio.currentTime > 3) { audio.currentTime = 0; return; }
            load(index - 1, !audio.paused);
        });
        el.next.addEventListener("click", () => load(nextIndex(), !audio.paused));

        el.shuffle.addEventListener("click", () => {
            shuffle = !shuffle;
            el.shuffle.classList.toggle("is-on", shuffle);
            el.shuffle.setAttribute("aria-pressed", shuffle);
            updateProgress();
        });

        const setVolIcon = () => {
            const off = audio.muted || audio.volume === 0;
            el.mute.innerHTML = off ? ICONS.mute : ICONS.vol;
            el.mute.setAttribute("aria-label", off ? "Unmute" : "Mute");
        };
        el.mute.addEventListener("click", () => { audio.muted = !audio.muted; setVolIcon(); });
        el.vol.addEventListener("input", () => {
            audio.volume = +el.vol.value;
            audio.muted = audio.volume === 0;
            setVolIcon();
        });

        // gear menu (only visible on very narrow players): proxies shuffle + mute
        const syncMenu = () => {
            el.menuShuffle.classList.toggle("is-on", shuffle);
            el.menuShuffle.setAttribute("aria-pressed", shuffle);
            const off = audio.muted || audio.volume === 0;
            el.menuMute.innerHTML = (off ? ICONS.mute : ICONS.vol) + `<span>${off ? "Unmute" : "Mute"}</span>`;
        };
        const closeMenu = () => { el.menu.hidden = true; el.more.setAttribute("aria-expanded", "false"); };
        el.more.addEventListener("click", (e) => {
            e.stopPropagation();
            syncMenu();
            el.menu.hidden = !el.menu.hidden;
            el.more.setAttribute("aria-expanded", String(!el.menu.hidden));
        });
        el.menu.addEventListener("click", (e) => e.stopPropagation());
        el.menuShuffle.addEventListener("click", () => { el.shuffle.click(); syncMenu(); });
        el.menuMute.addEventListener("click", () => { el.mute.click(); syncMenu(); });
        document.addEventListener("click", closeMenu);
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

        el.listBtn.addEventListener("click", () => {
            const show = el.list.hidden;
            el.list.hidden = !show;
            el.listBtn.classList.toggle("is-on", show);
            el.listBtn.setAttribute("aria-pressed", show);
            el.listBtn.setAttribute("aria-label", show ? "Hide playlist" : "Show playlist");
        });

        // --- playlist rows ---
        el.rows.forEach((r, i) => {
            const pick = () => (i === index ? toggle() : load(i, true));
            r.addEventListener("click", pick);
            r.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
            });
        });

        // --- seek bar (click or drag) ---
        let dragging = false;
        el.bar.addEventListener("pointerdown", (e) => {
            dragging = true; el.bar.setPointerCapture(e.pointerId); seekFromEvent(e);
        });
        el.bar.addEventListener("pointermove", (e) => { if (dragging) seekFromEvent(e); });
        el.bar.addEventListener("pointerup", () => { dragging = false; });
        el.bar.addEventListener("keydown", (e) => {
            if (!audio.duration) return;
            if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
            else if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
            else return;
            e.preventDefault();
            updateProgress();
        });

        // --- audio events ---
        audio.addEventListener("play", () => setPlayingUI(true));
        audio.addEventListener("pause", () => setPlayingUI(false));
        audio.addEventListener("loadedmetadata", () => {
            el.dur.textContent = fmt(audio.duration);
            el.rows[index].querySelector(".sk-row-dur").textContent = fmt(audio.duration);
        });
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("progress", updateProgress);
        audio.addEventListener("ended", () => {
            if (shuffle || index < tracks.length - 1) load(nextIndex(), true);
            else { setPlayingUI(false); audio.currentTime = 0; updateProgress(); }
        });

        // Only one Skyshore player plays at a time if there are several on the page.
        audio.addEventListener("play", () => {
            document.dispatchEvent(new CustomEvent("sk-player-play", { detail: audio }));
        });
        document.addEventListener("sk-player-play", (e) => { if (e.detail !== audio) audio.pause(); });

        load(0, false);
        return { audio, load, toggle };
    }

    window.SkyshorePlayer = SkyshorePlayer;
    const init = () => document.querySelectorAll("[data-sk-player]").forEach((n) => SkyshorePlayer(n));
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
