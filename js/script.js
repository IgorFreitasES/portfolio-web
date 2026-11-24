document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. MENU MOBILE (HAMBÚRGUER)
  // ==========================================
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // ==========================================
  // 2. EFEITO SCROLLING SUTIL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Anima apenas uma vez para manter elegante
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ==========================================
  // 3. PARTÍCULAS INTERATIVAS NO CABEÇALHO (REPULSÃO)
  // ==========================================
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const heroWrapper = document.querySelector(".hero-wrapper");
    let particles = [];
    const colors = ["#facc15", "#f59e0b", "#f97316", "#ea580c"]; // Amarelo e Laranja

    const mouse = {
      x: null,
      y: null,
      radius: 120 // Raio de repulsão do cursor
    };

    function resizeCanvas() {
      canvas.width = heroWrapper.offsetWidth;
      canvas.height = heroWrapper.offsetHeight;
      initParticles();
    }

    heroWrapper.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroWrapper.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Suporte para toque no celular/tablet
    heroWrapper.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    heroWrapper.addEventListener("touchend", () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.6 + 1.2;
        this.vx = (Math.random() - 0.5) * 0.9;
        this.vy = (Math.random() - 0.5) * 0.9;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebate nas bordas do cabeçalho
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Repulsão interativa com o mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius && distance > 0) {
            const force = (mouse.radius - distance) / mouse.radius;
            const pushX = (dx / distance) * force * 4.5;
            const pushY = (dy / distance) * force * 4.5;
            this.x += pushX;
            this.y += pushY;
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
      // Ajusta densidade conforme o tamanho da tela (leve no mobile)
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 85);
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

          if (distance < 115) {
            const opacity = (1 - distance / 115) * 0.35;
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

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animateParticles();
  }

  // ==========================================
  // 4. FILTRO DE PROJETOS POR CATEGORIA
  // ==========================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ==========================================
  // 5. FEEDBACK INTERATIVO NO FORMULÁRIO
  // ==========================================
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();

    formFeedback.textContent = `Obrigado, ${nome}! Sua mensagem foi registrada com sucesso.`;
    contactForm.reset();
  });
});