document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();
  AOS.init({ duration: 1000, once: true });

  const RULES = {
    nameMin: 3,
    mobileLength: 10,
    messageMin: 10
  };

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  const fields = {
    fullName: form.fullName,
    mobile: form.mobile,
    email: form.email,
    message: form.message
  };

  let timers = {};

  function debounce(key, fn, delay = 700) {
    clearTimeout(timers[key]);
    timers[key] = setTimeout(fn, delay);
  }

  function removeTooltip(input) {
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    const tip = input.parentElement.querySelector(".custom-tooltip");
    if (tip) tip.remove();
    input.style.borderColor = "";
  }

  function showTooltip(input, message) {
    removeTooltip(input);

    const tooltip = document.createElement("div");
    const id = "err-" + Math.random().toString(36).slice(2);
    tooltip.id = id;
    tooltip.className = "custom-tooltip";
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position:absolute;
      top:calc(100% + 8px);
      left:0;
      background:#EF4444;
      color:#fff;
      padding:8px 12px;
      font-size:12px;
      font-weight:600;
      border-radius:8px;
      white-space:nowrap;
      z-index:9999;
      animation:tooltipSlide .25s ease;
    `;

    input.parentElement.appendChild(tooltip);
    input.style.borderColor = "#EF4444";
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", id);
  }

  /* Live validation */
  fields.fullName.addEventListener("input", e => {
    removeTooltip(e.target);
    debounce("name", () => {
      if (e.target.value && e.target.value.length < RULES.nameMin)
        showTooltip(e.target, "⚠️ Name must be at least 3 characters");
    });
  });

  fields.mobile.addEventListener("input", e => {
    removeTooltip(e.target);
    debounce("mobile", () => {
      if (e.target.value && e.target.value.length !== RULES.mobileLength)
        showTooltip(e.target, "⚠️ Mobile must be 10 digits");
    });
  });

  fields.email.addEventListener("input", e => {
    removeTooltip(e.target);
    debounce("email", () => {
      if (e.target.value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value))
        showTooltip(e.target, "⚠️ Invalid email format");
    });
  });

  fields.message.addEventListener("input", e => {
    removeTooltip(e.target);
    debounce("message", () => {
      if (e.target.value && e.target.value.length < RULES.messageMin)
        showTooltip(e.target, "⚠️ Minimum 10 characters required");
    });
  });

  /* Submit */
  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (!navigator.onLine) {
      status.textContent = "⚠️ You are offline. Please check your connection.";
      status.className = "text-red-600";
      return;
    }

    let valid = true;
    let firstInvalid = null;

    Object.values(fields).forEach(removeTooltip);

    if (fields.fullName.value.length < RULES.nameMin) {
      showTooltip(fields.fullName, "⚠️ Enter a valid name");
      firstInvalid ??= fields.fullName;
      valid = false;
    }

    if (fields.mobile.value.length !== RULES.mobileLength) {
      showTooltip(fields.mobile, "⚠️ Enter a valid mobile number");
      firstInvalid ??= fields.mobile;
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) {
      showTooltip(fields.email, "⚠️ Enter a valid email");
      firstInvalid ??= fields.email;
      valid = false;
    }

    if (fields.message.value.length < RULES.messageMin) {
      showTooltip(fields.message, "⚠️ Message must be at least 10 characters");
      firstInvalid ??= fields.message;
      valid = false;
    }

    if (!valid) {
      firstInvalid.focus();
      status.textContent = "⚠️ Please fix the errors above";
      status.className = "text-red-600";
      return;
    }

    const btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Sending...";
    status.textContent = "";

    try {
      await fetch("https://script.google.com/macros/s/AKfycbzC7f_00D8bSIomyyZ_U-BYBM3ZhbpVmo1mF9xZHtvWofF0vWtOifqtjcyA-5cqhBgwaw/exec", {
        method: "POST",
        body: JSON.stringify({
          fullName: fields.fullName.value.trim(),
          mobile: fields.mobile.value.trim(),
          email: fields.email.value.trim().toLowerCase(),
          message: fields.message.value.trim()
        })
      });

      status.textContent = "✅ Message sent successfully!";
      status.className = "text-green-600";
      form.reset();

    } catch {
      status.textContent = "⚠️ Submission failed. Try again.";
      status.className = "text-red-600";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send Message";
    }
  });
});
