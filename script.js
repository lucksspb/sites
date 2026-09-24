/* ============================================
   Particles Background (Hero)
   ============================================ */
(function () {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animFrame;
  let resizeTimeout;

  function resizeCanvas() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }, 150);
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: ['#3B82F6', '#7C3AED', '#EC4899', '#60A5FA'][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      p.x = ((p.x % canvas.width) + canvas.width) % canvas.width;
      p.y = ((p.y % canvas.height) + canvas.height) % canvas.height;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();

      particles.forEach((p2) => {
        if (p === p2) return;
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / 150) * 0.1;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

/* ============================================
   Navbar Scroll Effect & Mobile Menu
   ============================================ */
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ============================================
   Back to Top Button
   ============================================ */
(function () {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================
   Scroll Reveal Animations
   ============================================ */
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  document.querySelectorAll('section').forEach((section) => {
    if (!section.classList.contains('reveal')) {
      section.classList.add('reveal');
      observer.observe(section);
    }
  });
})();

/* ============================================
   Stats Counter Animation
   ============================================ */
(function () {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          stats.forEach((stat) => {
            const target = parseInt(stat.dataset.target);
            if (isNaN(target)) return;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(counter);
              }
              stat.textContent = Math.floor(current) + '+';
            }, 16);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    observer.observe(statsSection);
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            animated = false;
            stats.forEach((stat) => {
              stat.textContent = '0';
            });
          }
        });
      },
      { threshold: 0 }
    );
    statsObserver.observe(statsSection);
  }
})();

/* ============================================
   Portfolio Filter
   ============================================ */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.classList.add('show');
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
          setTimeout(() => {
            card.classList.add('hidden');
            card.classList.remove('show');
          }, 300);
        }
      });
    });
  });
})();

/* ============================================
   Contact Form Submission
   ============================================ */
(function () {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    if (!btnText || !btnLoader) return;

    const originalText = btnText.textContent;

    btnText.textContent = '';
    btnLoader.innerHTML = '<span class="loader-spin"></span>';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.style.display = 'block';
      btnText.textContent = originalText;
      btnLoader.innerHTML = '';
      btn.disabled = false;
    }, 1500);
  });
})();

/* ============================================
   Newsletter Form
   ============================================ */
(function () {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');

    if (!input || !input.value) return;

    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    input.value = '';

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
      btn.style.background = '';
    }, 3000);
  });
})();

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#!' || !href) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ============================================
   Loader Spin Animation (inline)
   ============================================ */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .loader-spin {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
