document.addEventListener("DOMContentLoaded", () => {

  /* ===== 1. CUSTOM CURSOR ===== */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (cursorDot) { cursorDot.style.left = mouseX + "px"; cursorDot.style.top = mouseY + "px"; }
  });
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (cursorRing) { cursorRing.style.left = ringX + "px"; cursorRing.style.top = ringY + "px"; }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverables = document.querySelectorAll("a, button, .skill-tag, .social-link, input, textarea, .project-card, .flip-card, [data-hover]");
  hoverables.forEach(el => {
    el.addEventListener("mouseenter", () => { cursorRing?.classList.add("hover"); cursorDot?.classList.add("hover"); });
    el.addEventListener("mouseleave", () => { cursorRing?.classList.remove("hover"); cursorDot?.classList.remove("hover"); });
  });

  /* ===== 2. MAGNETIC BUTTONS ===== */
  document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });

  /* ===== 3. TILT ===== */
  document.querySelectorAll("[data-tilt]").forEach(el => {
    el.style.transformStyle = "preserve-3d";
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  /* ===== 4. TYPING ===== */
  const typingEl = document.querySelector(".typing-text");
  if (typingEl) {
    const phrases = JSON.parse(typingEl.getAttribute("data-text"));
    let pIdx = 0, cIdx = 0, deleting = false;
    function type() {
      const cur = phrases[pIdx];
      typingEl.textContent = cur.substring(0, deleting ? cIdx - 1 : cIdx + 1);
      cIdx += deleting ? -1 : 1;
      let speed = deleting ? 40 : 90;
      if (!deleting && cIdx === cur.length) { speed = 1800; deleting = true; }
      else if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; speed = 400; }
      setTimeout(type, speed);
    }
    type();
  }

  /* ===== 5. HERO PARTICLES ===== */
  const canvas = document.getElementById("dots");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    let W, H, particles = [];
    function resize() {
      W = canvas.width = container.offsetWidth;
      H = canvas.height = container.offsetHeight;
      particles = [];
      const count = Math.floor((W * H) / 14000);
      for (let i = 0; i < count; i++) {
        particles.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: Math.random()*2+1 });
      }
    }
    resize();
    window.addEventListener("resize", resize);

    let mx = -9999, my = -9999;
    canvas.addEventListener("mousemove", e => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    canvas.addEventListener("mouseleave", () => { mx = -9999; my = -9999; });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const isDark = document.body.classList.contains("dark");
      const dotColor = isDark ? "rgba(192, 132, 252, 0.6)" : "rgba(77, 25, 77, 0.55)";
      const lineColor = isDark ? "192, 132, 252" : "138, 54, 138";
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = dotColor; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${lineColor}, ${0.25 * (1 - d/130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        const mdx = particles[i].x - mx, mdy = particles[i].y - my;
        const md = Math.sqrt(mdx*mdx + mdy*mdy);
        if (md < 120) { particles[i].x += (mdx/md)*1.2; particles[i].y += (mdy/md)*1.2; }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ===== 6. NAVBAR SCROLL + PROGRESS ===== */
  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    const st = window.scrollY;
    navbar?.classList.toggle("scrolled", st > 30);
    const total = document.body.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = ((st/total)*100) + "%";
  });

  /* ===== 7. MOBILE MENU ===== */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  menuToggle?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });
  document.querySelectorAll(".nav-link").forEach(l => {
    l.addEventListener("click", () => { navMenu?.classList.remove("active"); menuToggle?.classList.remove("active"); });
  });

  /* ===== 8. REVEAL + COUNTERS ===== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("active");
        e.target.querySelectorAll(".num[data-count]").forEach(n => {
          if (n.dataset.done) return;
          n.dataset.done = "1";
          const target = parseInt(n.dataset.count);
          let cur = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const iv = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(iv); }
            n.textContent = cur + "+";
          }, 40);
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  /* ===== 9. ACTIVE NAV ===== */
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const y = window.scrollY + 150;
    sections.forEach(s => {
      const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
      if (!link) return;
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });

  /* ===== 10. CONTACT FORM ===== */
  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (toast) {
      toast.textContent = "Message sent successfully! ✨";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }
    form.reset();
  });
});

/* ===== 11. THEME TOGGLE ===== */
(function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  if (initial === "dark") document.body.classList.add("dark");

  toggle?.addEventListener("click", () => {
    const rect = toggle.getBoundingClientRect();
    const ripple = document.createElement("div");
    ripple.className = "theme-ripple";
    const size = 40;
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = (rect.left + rect.width/2 - size/2) + "px";
    ripple.style.top = (rect.top + rect.height/2 - size/2) + "px";
    document.body.appendChild(ripple);
    const nextDark = !document.body.classList.contains("dark");
    ripple.style.background = nextDark ? "#0b0614" : "#EDAFB8";
    requestAnimationFrame(() => ripple.classList.add("active"));

    setTimeout(() => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    }, 250);
    setTimeout(() => ripple.remove(), 900);
  });
})();
/* ============ 12. TOUCH: tap-to-flip cert cards ============ */
(function initTouchFlip() {
  if (!window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("flipped"));
  });
})();
