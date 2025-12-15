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
      const currentLang = localStorage.getItem("preferredLanguage") || "ja";

      button.textContent = currentLang === "ja" ? "送信中..." : "Sending...";
      button.disabled = true;

      const name = form.user_name.value.trim();
      const email = form.user_email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        alert(
          currentLang === "ja"
            ? "すべての項目を入力してください。"
            : "Please fill in all fields."
        );
        button.textContent = originalText;
        button.disabled = false;
        return;
      }
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
        if (q.nextElementSibling) {
          q.nextElementSibling.classList.remove("active");
        }
      });

      // クリックされたFAQを開く
      if (!isActive) {
        this.classList.add("active");
        if (answer) {
          answer.classList.add("active");
        }
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

// ===== 言語切り替え機能 =====
function initLanguageSwitcher() {
  // 保存された言語を取得
  let currentLang = localStorage.getItem("preferredLanguage");

  // 保存された言語がない場合、ブラウザの言語設定を確認
  if (!currentLang) {
    const browserLang = navigator.language || navigator.userLanguage;
    currentLang = browserLang.startsWith("ja") ? "ja" : "en";
  }

  // 言語切り替えボタンのイベントリスナー
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      switchLanguage(lang);
    });
  });

  // 初期言語を設定
  switchLanguage(currentLang);
}

function switchLanguage(lang) {
  localStorage.setItem("preferredLanguage", lang);
  document.documentElement.setAttribute("lang", lang);

  const customTitleJa = document.body?.getAttribute("data-title-ja");
  const customTitleEn = document.body?.getAttribute("data-title-en");
  if (customTitleJa && customTitleEn) {
    document.title = lang === "ja" ? customTitleJa : customTitleEn;
  } else if (lang === "ja") {
    document.title = "打田裕馬 | エンジニアPMポートフォリオ";
  } else {
    document.title = "Yuma Uchida | Engineer PM Portfolio";
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll("[data-ja][data-en]").forEach((element) => {
    const jaText = element.getAttribute("data-ja");
    const enText = element.getAttribute("data-en");
    if (lang === "ja" && jaText !== null) {
      element.textContent = jaText;
    } else if (lang === "en" && enText !== null) {
      element.textContent = enText;
    }
  });

  document
    .querySelectorAll("[data-placeholder-ja][data-placeholder-en]")
    .forEach((element) => {
      const jaPlaceholder = element.getAttribute("data-placeholder-ja");
      const enPlaceholder = element.getAttribute("data-placeholder-en");
      if (lang === "ja" && jaPlaceholder !== null) {
        element.setAttribute("placeholder", jaPlaceholder);
      } else if (lang === "en" && enPlaceholder !== null) {
        element.setAttribute("placeholder", enPlaceholder);
      }
    });

  document
    .querySelectorAll("select option[data-ja][data-en]")
    .forEach((option) => {
      const jaText = option.getAttribute("data-ja");
      const enText = option.getAttribute("data-en");
      if (lang === "ja" && jaText !== null) {
        option.textContent = jaText;
      } else if (lang === "en" && enText !== null) {
        option.textContent = enText;
      }
    });

  document.querySelectorAll("[data-ja-title][data-en-title]").forEach((el) => {
    const jaTitle = el.getAttribute("data-ja-title");
    const enTitle = el.getAttribute("data-en-title");
    if (lang === "ja" && jaTitle !== null) {
      el.setAttribute("title", jaTitle);
    } else if (lang === "en" && enTitle !== null) {
      el.setAttribute("title", enTitle);
    }
  });

  const form = document.getElementById("contact-form");
  if (form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.textContent = lang === "ja" ? "送信" : "Send";
    }
  }

  const typingEl = document.querySelector(".typing");
  if (
    typingEl &&
    typingEl.hasAttribute("data-ja") &&
    typingEl.hasAttribute("data-en")
  ) {
    typingEl.textContent =
      lang === "ja"
        ? typingEl.getAttribute("data-ja")
        : typingEl.getAttribute("data-en");
    typingEffect();
  }

  document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

document.addEventListener("DOMContentLoaded", function () {
  initLanguageSwitcher();
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
