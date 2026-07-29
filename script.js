/* =========================================================
   M Hassan Ashraf — Portfolio
   script.js — preloader, cursor, nav, typing, reveal,
   counters, skill bars, particles, ripple, form validation
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 400);
  });
  // Fallback in case 'load' fires slowly
  setTimeout(() => preloader && preloader.classList.add('hidden'), 2500);

  /* ---------- Current year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Custom cursor ---------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && matchMedia('(hover:hover)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, .glass, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ---------- Navbar scroll state + active link ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('main section[id]');

  function updateNav() {
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('back-to-top');
  function updateBackToTop() {
    if (window.scrollY > 500) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
    updateBackToTop();
  }, { passive: true });
  updateProgress(); updateNav(); updateBackToTop();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinksWrap = document.getElementById('nav-links');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinksWrap.classList.toggle('open');
  });
  navLinksWrap.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksWrap.classList.remove('open');
    });
  });

  /* ---------- Typing effect ---------- */
  const typedEl = document.getElementById('typed-text');
  const roles = ['Java Developer', 'Database Enthusiast', 'Networking Learner', 'Problem Solver'];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 75);
  }
  if (typedEl) typeLoop();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.count-up');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1400;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Skill progress bars ---------- */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.level + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(el => skillObserver.observe(el));

  /* ---------- Ripple effect on buttons ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------- Floating background particles (canvas) ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.documentElement.scrollHeight;
    }
    function initParticles() {
      const count = Math.min(70, Math.floor((w * window.innerHeight) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        o: Math.random() * 0.4 + 0.15
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = window.innerHeight; if (p.y > window.innerHeight) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.o})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); initParticles(); draw();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  /* ---------- Parallax on hero glow ---------- */
  const heroVisual = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (!heroVisual) return;
    const offset = window.scrollY * 0.15;
    heroVisual.style.backgroundPosition = `center ${offset}px`;
  }, { passive: true });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const msgField = form.querySelector('#message');
    const status = form.querySelector('.form-status');

    function setError(field, message) {
      const wrap = field.closest('.field');
      wrap.classList.toggle('error', Boolean(message));
      wrap.querySelector('.err-msg').textContent = message || '';
    }

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      if (!nameField.value.trim()) { setError(nameField, 'Please enter your name.'); valid = false; }
      else setError(nameField, '');

      if (!emailField.value.trim()) { setError(emailField, 'Please enter your email.'); valid = false; }
      else if (!validEmail(emailField.value.trim())) { setError(emailField, 'Enter a valid email address.'); valid = false; }
      else setError(emailField, '');

      if (!msgField.value.trim() || msgField.value.trim().length < 10) {
        setError(msgField, 'Message should be at least 10 characters.'); valid = false;
      } else setError(msgField, '');

      status.classList.remove('show', 'success', 'error');

      if (!valid) {
        status.textContent = 'Please fix the errors above and try again.';
        status.classList.add('show', 'error');
        return;
      }

      // No backend connected — this simulates a successful submission.
      // To send real emails, connect this form to a service like Formspree,
      // EmailJS, or your own backend endpoint.
      status.textContent = `Thanks, ${nameField.value.trim()}! Your message has been noted — I'll get back to you soon.`;
      status.classList.add('show', 'success');
      form.reset();
    });
  }

});
