// ===== パーティクル背景 =====
const canvas = document.getElementById("particles-bg");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let w = window.innerWidth,
    h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  let particles = [];
  const PARTICLE_NUM = 60;
  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }
  window.addEventListener("resize", resize);
  function randomColor() {
    const colors = ["#00C896", "#1E3A5F", "#E8F4F8"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1.5,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
      color: randomColor(),
    });
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1.0;
      // 線
      for (let q of particles) {
        let dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.12;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      }
    }
  }
  function update() {
    for (let p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    }
  }
  function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== スクロールフェードイン =====
const fadeEls = document.querySelectorAll(".fade-in");
const fadeInObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeInObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
fadeEls.forEach((el) => fadeInObserver.observe(el));

// ===== スキルバーアニメーション =====
function animateSkillBars() {
  document.querySelectorAll(".skill-bar").forEach((bar) => {
    const level = bar.getAttribute("data-level");
    bar.style.setProperty("--level", level);
    setTimeout(() => bar.classList.add("animated"), 300);
  });
}
window.addEventListener("DOMContentLoaded", animateSkillBars);

// ===== タイピングアニメーション =====
function typingEffect() {
  const el = document.querySelector(".typing");
  if (!el) return;
  const text = el.textContent;
  el.textContent = "";
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, text[i - 1] === "\n" ? 400 : 38);
    }
  }
  type();
}
window.addEventListener("DOMContentLoaded", typingEffect);

// ===== アクセシビリティ: キーボードナビ対応 =====
document.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    document.body.classList.add("user-is-tabbing");
  }
});
document.addEventListener("mousedown", function () {
  document.body.classList.remove("user-is-tabbing");
});

// ===== Worksアコーディオン =====
document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll(".work-toggle");
  toggles.forEach((btn) => {
    btn.addEventListener("click", function () {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      // すべて閉じる
      toggles.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const detail = document.getElementById(b.getAttribute("aria-controls"));
        if (detail) {
          detail.hidden = true;
          detail.setAttribute("aria-hidden", "true");
        }
      });
      // 今回だけ開く
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        const detail = document.getElementById(
          btn.getAttribute("aria-controls")
        );
        if (detail) {
          detail.hidden = false;
          detail.setAttribute("aria-hidden", "false");
        }
      }
    });
    // キーボード操作対応
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
});
