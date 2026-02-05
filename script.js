document.addEventListener("DOMContentLoaded", () => {

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const currentPath = window.location.pathname;

  /* ================= CONTACT PAGE ================= */
  if (currentPath.includes("contact")) {
    navLinks.forEach(link => {
      if (link.getAttribute("href") === "contact.html") {
        link.classList.add("active");
      }
    });
    return;
  }

  /* ================= HOME PAGE SCROLL ================= */
  function setActiveLink() {
    let scrollY = window.scrollY;

    // 🔹 RESET ALL FIRST (IMPORTANT FIX)
    navLinks.forEach(link => link.classList.remove("active"));

    // 🔹 TOP OF PAGE → HOME ACTIVE
    if (scrollY < 200) {
      const homeLink = document.querySelector('.nav-link[href="#home"]');
      if (homeLink) homeLink.classList.add("active");
      return;
    }

    // 🔹 OTHER SECTIONS
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        const activeLink = document.querySelector(
          `.nav-link[href="#${sectionId}"]`
        );
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);
  setActiveLink(); // run on load
});


document.addEventListener("DOMContentLoaded", () => {
  lottie.loadAnimation({
    container: document.getElementById("hero-lottie"),
    renderer: "svg",            
    autoplay: true,
    path: "img/business.json",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
      progressiveLoad: true
    }
  });
});

