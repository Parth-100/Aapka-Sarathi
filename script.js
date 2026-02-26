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

const parseFormData = (form) => {
  const fd = new FormData(form);
  const data = {};
  fd.forEach((value, key) => {
    data[key] = typeof value === "string" ? value.trim() : value;
  });
  return data;
};

const getMessageEl = (form) => {
  let el = form.querySelector(".form-message");
  if (!el) {
    el = document.createElement("p");
    el.className = "form-message";
    el.setAttribute("aria-live", "polite");
    form.appendChild(el);
  }
  return el;
};

const validPhone = (text) => text.replace(/\D/g, "").length >= 10;

const leadForms = document.querySelectorAll("form[data-lead-form='true']");
const config = window.SITE_CONFIG || {};

leadForms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    const msg = getMessageEl(form);
    const data = parseFormData(form);
    const phone = String(data.phone || "");

    if (phone && !validPhone(phone)) {
      event.preventDefault();
      msg.textContent = "Please enter a valid 10-digit phone number.";
      return;
    }

    const webhook = String(config.leadWebhookUrl || "").trim();
    if (!webhook) {
      msg.textContent = "Opening your email app to send the inquiry...";
      return;
    }

    event.preventDefault();
    msg.textContent = "Submitting your request...";

    const payload = {
      ...data,
      form_name: form.dataset.formName || "website_form",
      source_page: window.location.pathname,
      submitted_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(webhook, {
        method: config.leadWebhookMethod || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Webhook request failed");
      }

      const thankYouPath = String(config.thankYouPath || "/thank-you.html");
      const target = `${thankYouPath}?form=${encodeURIComponent(payload.form_name)}`;
      window.location.assign(target);
    } catch (err) {
      msg.textContent = "Could not auto-submit. Please use call or WhatsApp now.";
    }
  });
});

window.addEventListener("scroll", revealNow);
window.addEventListener("load", revealNow);
