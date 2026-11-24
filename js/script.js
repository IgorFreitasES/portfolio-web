document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ==========================================
  // 1. MENU QUE SURGE APÓS ROLAR A ABERTURA + OPACIDADE DO FUNDO
  // ==========================================
  const siteHeader = document.getElementById("site-header");
  const heroScreen = document.getElementById("inicio");

  function handleScrollState() {
    const triggerPoint = heroScreen ? heroScreen.offsetHeight * 0.45 : 260;
    const isPastHero = window.scrollY > triggerPoint;

    if (isPastHero) {
      siteHeader.classList.add("visible");
      siteHeader.setAttribute("aria-hidden", "false");
      document.body.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("visible");
      siteHeader.setAttribute("aria-hidden", "true");
      document.body.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScrollState, { passive: true });
  handleScrollState();

  // ==========================================
  // 2. MENU MOBILE & BOTÃO DE ALTO CONTRASTE (ACESSIBILIDADE)
  // ==========================================
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const contrastToggle = document.getElementById("contrast-toggle");
  contrastToggle.addEventListener("click", () => {
    const active = document.body.classList.toggle("high-contrast");
    contrastToggle.setAttribute("aria-pressed", String(active));
  });

  // ==========================================
  // 3. SCROLL REVEAL SUTIL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal");

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -25px 0px"
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // ==========================================
  // 4. FUNDO INTERATIVO EM TODA A PÁGINA (MOUSE & TOQUE)
  // ==========================================
  const canvas = document.getElementById("particles-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const colors = ["#facc15", "#f59e0b", "#f97316", "#ea580c"];

    const mouse = {
      x: null,
      y: null,
      radius: 135
    };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    window.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener("touchend", () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 1.2;
        this.vx = (Math.random() - 0.5) * 0.85;
        this.vy = (Math.random() - 0.5) * 0.85;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius && distance > 0) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 4.5;
            this.y += (dy / distance) * force * 4.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 13000), 85);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.32;
            ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();
  }

  // ==========================================
  // 5. VALIDAÇÃO ACESSÍVEL DO FORMULÁRIO
  // ==========================================
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !mensagem) {
      formFeedback.textContent = "Por favor, preencha nome, e-mail e mensagem antes de enviar.";
      return;
    }

    formFeedback.textContent = `Obrigado, ${nome}! Sua mensagem foi registrada com sucesso.`;
    contactForm.reset();
  });
});