const reveals = document.querySelectorAll(".reveal");

const revealNow = () => {
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
};

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const quickForm = document.querySelector("#quick-form");
const formMessage = document.querySelector("#form-message");

if (quickForm && formMessage) {
  quickForm.addEventListener("submit", (event) => {
    const phoneInput = quickForm.querySelector("input[name='phone']");
    const rawPhone = phoneInput ? phoneInput.value.trim() : "";
    const digits = rawPhone.replace(/\D/g, "");

    if (digits.length < 10) {
      event.preventDefault();
      formMessage.textContent = "Please enter a valid 10-digit phone number.";
      return;
    }

    formMessage.textContent = "Opening your email app with trip details...";
  });
}

window.addEventListener("scroll", revealNow);
window.addEventListener("load", revealNow);
