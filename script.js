const reveals = document.querySelectorAll(".reveal");
const revealNow = () => {
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", revealNow);
window.addEventListener("load", revealNow);
