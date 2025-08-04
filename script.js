// ===== パーティクル背景 =====
const canvas = document.getElementById("particles-bg");
if (canvas && canvas.tagName === "CANVAS") {
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

// ===== EmailJS お問い合わせフォーム送信 =====
document.addEventListener("DOMContentLoaded", function () {
  if (window.emailjs) {
    emailjs.init("iCeORWdojmPHJx0je");
  }
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      button.textContent = "送信中...";
      button.disabled = true;
      emailjs
        .sendForm("service_cm72dfl", "template_ww5gsgz", form)
        .then(() => {
          document.getElementById("form-success").style.display = "block";
          document.getElementById("form-error").style.display = "none";
          setTimeout(() => {
            document.getElementById("form-success").style.display = "none";
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
          }, 5000);
        })
        .catch(() => {
          document.getElementById("form-error").style.display = "block";
          document.getElementById("form-success").style.display = "none";
          setTimeout(() => {
            document.getElementById("form-error").style.display = "none";
            button.textContent = originalText;
            button.disabled = false;
          }, 5000);
        });
    });
  }
});

// ===== スムーズスクロール =====
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});

// ===== Careerアコーディオン =====
document.addEventListener("DOMContentLoaded", function () {
  const careerToggles = document.querySelectorAll(".career-toggle");
  function updateCareerIcons() {
    careerToggles.forEach((btn) => {
      const icon = btn.querySelector(".career-toggle-icon");
      if (btn.getAttribute("aria-expanded") === "true") {
        icon.textContent = "▼";
      } else {
        icon.textContent = "▶";
      }
    });
  }
  careerToggles.forEach((btn) => {
    btn.addEventListener("click", function () {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      careerToggles.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const detail = document.getElementById(b.getAttribute("aria-controls"));
        if (detail) {
          detail.hidden = true;
        }
      });
      if (!expanded) {
        btn.setAttribute("aria-expanded", "true");
        const detail = document.getElementById(
          btn.getAttribute("aria-controls")
        );
        if (detail) {
          detail.hidden = false;
        }
      }
      updateCareerIcons();
    });
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });
  updateCareerIcons();
});

// ===== メンタリングページ FAQアコーディオン =====
document.addEventListener("DOMContentLoaded", function () {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const answer = this.nextElementSibling;
      const isActive = this.classList.contains("active");

      // 他のすべてのFAQを閉じる
      faqQuestions.forEach((q) => {
        q.classList.remove("active");
        q.nextElementSibling.classList.remove("active");
      });

      // クリックされたFAQを開く
      if (!isActive) {
        this.classList.add("active");
        answer.classList.add("active");
      }
    });

    // キーボード操作対応
    question.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
});

// ===== GitHub Pages用404エラーハンドリング =====
document.addEventListener("DOMContentLoaded", function () {
  // 現在のページのパスを取得
  const currentPath = window.location.pathname;

  // GitHub Pagesのベースパスを考慮（リポジトリ名がある場合）
  const basePath = window.location.pathname.split("/").slice(0, -1).join("/");

  // 存在するページのリスト（GitHub Pages用）
  const validPages = [
    "/",
    "/index.html",
    "/404.html",
    "/achievements.html",
    "/services/mentoring.html",
    "/services/pm.html",
    "/services/pm-rescue.html",
  ];

  // GitHub Pagesのベースパスを考慮した有効ページリスト
  const validPagesWithBase = validPages.map((page) => basePath + page);

  // 現在のパスが有効なページかチェック
  const isValidPage = validPagesWithBase.some((page) => {
    if (page === basePath + "/" && currentPath === basePath + "/") return true;
    if (
      page !== basePath + "/" &&
      currentPath.endsWith(page.replace(basePath, ""))
    )
      return true;
    return false;
  });

  // 無効なページの場合、404ページにリダイレクト
  if (
    !isValidPage &&
    currentPath !== basePath + "/404.html" &&
    currentPath !== "/404.html"
  ) {
    // 404ページにリダイレクト（ベースパスを考慮）
    const redirectPath = basePath + "/404.html";
    window.location.href = redirectPath;
  }
});

// ===== GitHub Pages用リンクエラーハンドリング =====
document.addEventListener("DOMContentLoaded", function () {
  // すべてのリンクにエラーハンドリングを追加
  const links = document.querySelectorAll("a[href]");

  // GitHub Pagesのベースパスを取得
  const basePath = window.location.pathname.split("/").slice(0, -1).join("/");

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // 外部リンクやアンカーリンクは除外
      if (
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // 相対パスの場合、ファイルの存在をチェック
      if (
        href.startsWith("./") ||
        href.startsWith("/") ||
        !href.includes("://")
      ) {
        const targetPath = href.startsWith("/")
          ? href
          : window.location.pathname.replace(/\/[^\/]*$/, "/") + href;

        // GitHub Pages用の有効パスリスト
        const validPaths = [
          "/",
          "/index.html",
          "/404.html",
          "/achievements.html",
          "/services/mentoring.html",
          "/services/pm.html",
          "/services/pm-rescue.html",
        ];

        // ベースパスを考慮した有効パスチェック
        const isValidPath = validPaths.some((path) => {
          const fullPath = basePath + path;
          if (
            path === "/" &&
            (targetPath === basePath + "/" || targetPath === "/")
          )
            return true;
          if (
            path !== "/" &&
            (targetPath.endsWith(path) || targetPath.endsWith(fullPath))
          )
            return true;
          return false;
        });

        if (!isValidPath) {
          e.preventDefault();
          const redirectPath = basePath + "/404.html";
          window.location.href = redirectPath;
        }
      }
    });
  });
});
