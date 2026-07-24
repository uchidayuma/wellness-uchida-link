// ===== モバイルメニュー =====
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", function () {
      menu.classList.toggle("hidden");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.add("hidden");
      });
    });
  }
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

      if (!name || !email) {
        alert(
          currentLang === "ja"
            ? "お名前とメールアドレスを入力してください。"
            : "Please fill in your name and email."
        );
        button.textContent = originalText;
        button.disabled = false;
        return;
      }
      emailjs
        .sendForm("service_cm72dfl", "template_ww5gsgz", form)
        .then(() => {
          document.getElementById("form-success").classList.remove("hidden");
          document.getElementById("form-error").classList.add("hidden");
          setTimeout(() => {
            document.getElementById("form-success").classList.add("hidden");
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
          }, 5000);
        })
        .catch(() => {
          document.getElementById("form-error").classList.remove("hidden");
          document.getElementById("form-success").classList.add("hidden");
          setTimeout(() => {
            document.getElementById("form-error").classList.add("hidden");
            button.textContent = originalText;
            button.disabled = false;
          }, 5000);
        });
    });
  }
});

// ===== 言語切り替え機能 =====
function initLanguageSwitcher() {
  let currentLang = localStorage.getItem("preferredLanguage");

  if (!currentLang) {
    const browserLang = navigator.language || navigator.userLanguage;
    currentLang = browserLang.startsWith("ja") ? "ja" : "en";
  }

  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      switchLanguage(lang);
    });
  });

  switchLanguage(currentLang);
}

function switchLanguage(lang) {
  localStorage.setItem("preferredLanguage", lang);
  document.documentElement.setAttribute("lang", lang);

  const customTitleJa = document.body?.getAttribute("data-title-ja");
  const customTitleEn = document.body?.getAttribute("data-title-en");
  if (customTitleJa && customTitleEn) {
    document.title = lang === "ja" ? customTitleJa : customTitleEn;
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  document.querySelectorAll("[data-ja][data-en]").forEach((element) => {
    const text = element.getAttribute(lang === "ja" ? "data-ja" : "data-en");
    if (text !== null) {
      element.textContent = text;
    }
  });

  document
    .querySelectorAll("[data-placeholder-ja][data-placeholder-en]")
    .forEach((element) => {
      const placeholder = element.getAttribute(
        lang === "ja" ? "data-placeholder-ja" : "data-placeholder-en"
      );
      if (placeholder !== null) {
        element.setAttribute("placeholder", placeholder);
      }
    });

  document.querySelectorAll(".lang-ja-only").forEach((el) => {
    el.style.display = lang === "ja" ? "" : "none";
  });
  document.querySelectorAll(".lang-en-only").forEach((el) => {
    el.style.display = lang === "en" ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initLanguageSwitcher();
});
