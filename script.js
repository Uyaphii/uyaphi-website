document.addEventListener("DOMContentLoaded", () => {
  /* Navigation menu that shows on mobile */
  const menuOpenButton = document.querySelector("#menu-open-button");
  const menuCloseButton = document.querySelector("#menu-close-button");
  const navLinks = document.querySelectorAll(".nav-link");

  const openMenu = () => {
    document.body.classList.add("show-mobile-menu");
    document.documentElement.classList.add("show-mobile-menu");
  };
  const closeMenu = () => {
    document.body.classList.remove("show-mobile-menu");
    document.documentElement.classList.remove("show-mobile-menu");
  };

  menuOpenButton.addEventListener("click", openMenu);
  menuCloseButton.addEventListener("click", closeMenu);

  // Close the mobile menu whenever a nav link is used
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // Close when clicking the dimmed backdrop (outside the menu panel)
  document.addEventListener("click", (event) => {
    const isOpen = document.body.classList.contains("show-mobile-menu");
    if (!isOpen) return;
    const menu = document.querySelector(".nav-menu");
    const clickedInsideMenu = menu.contains(event.target);
    const clickedOpenButton = menuOpenButton.contains(event.target);
    if (!clickedInsideMenu && !clickedOpenButton) closeMenu();
  });

  /* Header background on scroll*/
  const header = document.querySelector("#site-header");
  const updateHeaderState = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* Scroll reveal for (.reveal) elements  */
  const revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  /* Scrollspy: highlighting the active nav link  */
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && sections.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.dataset.section === id);
            });
          }
        });
      },
      { threshold: 0.4, rootMargin: "-90px 0px -40% 0px" }
    );
    sections.forEach((section) => spyObserver.observe(section));
  }

  /*Back to top floating button */
  const backToTop = document.querySelector("#back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => backToTop.classList.toggle("show", window.scrollY > 500),
      { passive: true }
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /*Footer year*/
  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Contact form validation and enquiry submission */
  const form = document.querySelector("#contact-form");
  if (form) {
    const nameInput = document.querySelector("#form-name");
    const emailInput = document.querySelector("#form-email");
    const phoneInput = document.querySelector("#form-phone");
    const messageInput = document.querySelector("#form-message");
    const submitButton = document.querySelector("#submit-button");
    const feedback = document.querySelector("#form-feedback");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-\s()]{7,}$/;

    const setError = (input, message) => {
      const errorEl = document.querySelector(`#error-${input.id.replace("form-", "")}`);
      if (errorEl) errorEl.textContent = message || "";
      input.classList.toggle("invalid", Boolean(message));
    };

    const validateField = (input) => {
      const value = input.value.trim();

      if (input === nameInput) {
        if (!value) return setError(input, "Please tell us your name.") || false;
        setError(input, "");
        return true;
      }

      if (input === emailInput) {
        if (!value) return setError(input, "Please add an email address.") || false;
        if (!emailPattern.test(value)) return setError(input, "That email doesn't look right.") || false;
        setError(input, "");
        return true;
      }

      if (input === phoneInput) {
        if (value && !phonePattern.test(value)) return setError(input, "Please check that phone number.") || false;
        setError(input, "");
        return true;
      }

      if (input === messageInput) {
        if (!value) return setError(input, "Let us know what you need.") || false;
        if (value.length < 10) return setError(input, "A few more details would help.") || false;
        setError(input, "");
        return true;
      }

      return true;
    };

    [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("invalid")) validateField(input);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isPhoneValid = validateField(phoneInput);
      const isMessageValid = validateField(messageInput);

      if (!(isNameValid && isEmailValid && isPhoneValid && isMessageValid)) {
        feedback.textContent = "Please fix the highlighted fields.";
        feedback.className = "form-feedback error";
        return;
      }

      submitButton.disabled = true;
      submitButton.querySelector(".submit-label").textContent = "Sending...";
      feedback.textContent = "";
      feedback.className = "form-feedback";

      // No backend is wired up just yet for the contact form
      setTimeout(() => {
        feedback.textContent = `Thanks, ${nameInput.value.trim().split(" ")[0]}! Your enquiry is in — we'll be in touch soon.`;
        feedback.className = "form-feedback success";
        submitButton.disabled = false;
        submitButton.querySelector(".submit-label").textContent = "Send Enquiry";
        form.reset();
        [nameInput, emailInput, phoneInput, messageInput].forEach((input) => setError(input, ""));
      }, 900);
    });
  }
});
