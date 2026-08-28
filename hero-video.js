const addHeroVideos = () => {
  document.querySelectorAll(".op-hero").forEach((hero) => {
    if (hero.querySelector(".hero-background-video")) return;

    const video = document.createElement("video");
    video.className = "hero-background-video";
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");

    const source = document.createElement("source");
    source.src = "../assets/hero-presentation.mp4";
    source.type = "video/mp4";
    video.appendChild(source);
    hero.prepend(video);

    hero.style.position = "relative";
    hero.style.overflow = "hidden";
    const content = hero.querySelector(".op-hero-inner");
    if (content) {
      content.style.position = "relative";
      content.style.zIndex = "1";
    }
    const title = hero.querySelector("h1");
    if (title) title.style.fontSize = "clamp(4rem, 6vw, 8.4rem)";
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addHeroVideos, { once: true });
} else {
  addHeroVideos();
}
