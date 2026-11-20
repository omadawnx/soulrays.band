import { photos, tracks } from '../data/site';

const player = document.querySelector<HTMLElement>('[data-player]');
if (player) {
  const audio = player.querySelector('audio')!;
  const playButton = player.querySelector<HTMLButtonElement>('[data-play]')!;
  const title = player.querySelector('[data-title]')!;
  const credit = player.querySelector('[data-credit]')!;
  const seek = player.querySelector<HTMLInputElement>('[data-seek]')!;
  const time = player.querySelector('[data-time]')!;
  const lyrics = player.querySelector('[data-lyrics]')!;
  const buttons = [...player.querySelectorAll<HTMLButtonElement>('[data-track]')];
  const repeatButton = player.querySelector<HTMLButtonElement>('[data-repeat]');
  const volume = player.querySelector<HTMLInputElement>('[data-volume]');
  let index = 0;
  let seeking = false;
  let armSeek = false;
  let repeat = false;

  const fmt = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderLyrics = () => {
    const track = tracks[index];
    lyrics.innerHTML = `<div class="lyrics-inner"><h3>${track.title}</h3>${track.lyrics
      .map((stanza) => `<p>${stanza}</p>`)
      .join('')}</div>`;
  };

  const showTrack = (next: number) => {
    const track = tracks[(next + tracks.length) % tracks.length];
    const same = audio.currentSrc.endsWith(track.src);
    index = (next + tracks.length) % tracks.length;
    title.textContent = track.title;
    credit.textContent = track.credit;
    buttons.forEach((button, i) => button.classList.toggle('active', i === index));
    if (!same) {
      seek.value = '0';
      seeking = false;
      armSeek = false;
      audio.src = track.src;
    }
    renderLyrics();
    playButton.setAttribute('aria-label', `נגן ${track.title}`);
  };

  const applySlider = () => {
    const duration = audio.duration;
    if (!Number.isFinite(duration) || duration <= 0) return false;
    audio.currentTime = (Number(seek.value) / 1000) * duration;
    armSeek = false;
    time.textContent = fmt(audio.currentTime);
    return true;
  };

  const play = async () => {
    showTrack(index);
    if (armSeek || Number(seek.value) > 0) applySlider();
    await audio.play();
  };

  showTrack(0);

  playButton.addEventListener('click', () => {
    if (audio.paused) play();
    else audio.pause();
  });

  player.querySelector('[data-prev]')?.addEventListener('click', () => {
    showTrack(index - 1);
    play();
  });

  player.querySelector('[data-next]')?.addEventListener('click', () => {
    showTrack(index + 1);
    play();
  });

  repeatButton?.addEventListener('click', () => {
    repeat = !repeat;
    repeatButton.setAttribute('aria-pressed', String(repeat));
  });

  volume?.addEventListener('input', () => {
    audio.volume = Number(volume.value);
  });

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const next = Number(button.dataset.track);
      if (next === index && !audio.paused) audio.pause();
      else {
        showTrack(next);
        play();
      }
    });
  });

  const setLyricsOpen = (open: boolean) => {
    lyrics.classList.toggle('is-open', open);
    lyrics.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  audio.addEventListener('play', () => {
    setLyricsOpen(true);
    playButton.setAttribute('aria-label', `השהה ${tracks[index].title}`);
    playButton.dataset.state = 'playing';
  });

  audio.addEventListener('pause', () => {
    setLyricsOpen(false);
    playButton.setAttribute('aria-label', `נגן ${tracks[index].title}`);
    playButton.dataset.state = 'paused';
  });

  audio.addEventListener('ended', () => {
    if (index < tracks.length - 1 || repeat) {
      showTrack(index + 1);
      play();
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (armSeek || Number(seek.value) > 0) applySlider();
  });

  audio.addEventListener('timeupdate', () => {
    if (seeking || armSeek) return;
    time.textContent = fmt(audio.currentTime);
    if (audio.duration) {
      seek.value = String(Math.round((audio.currentTime / audio.duration) * 1000));
    }
  });

  seek.addEventListener('input', () => {
    seeking = true;
    armSeek = true;
    applySlider();
  });

  seek.addEventListener('change', () => {
    applySlider();
    seeking = false;
  });
}

const carousel = document.querySelector<HTMLElement>('[data-carousel]');
if (carousel) {
  const reel = carousel.querySelector<HTMLElement>('[data-reel]')!;
  let index = 0;
  const show = (next: number) => {
    index = (next + photos.length) % photos.length;
    reel.style.transform = `translateX(-${index * 100}%)`;
  };
  carousel.querySelector('[data-prev]')?.addEventListener('click', () => show(index - 1));
  carousel.querySelector('[data-next]')?.addEventListener('click', () => show(index + 1));
  window.setInterval(() => show(index + 1), 6000);
}
