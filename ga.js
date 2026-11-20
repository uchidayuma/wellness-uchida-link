/* Google Analytics 4（測定ID G-8G766V3E9K）。全ページの head で gtag.js の直後に読み込む。
   目標（コンバージョン）として送るイベント:
   - calendly_click: Calendly へのリンクを押した
   - contact_submit: 問い合わせフォームを送信した
   - quote_review_cta: 見積もりレビューへの導線（#quote-review）を押した
   - checklist_view: チェックシートのページを開いた
   - article_view: 記事のページを開いた */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-8G766V3E9K', { anonymize_ip: true });

(function () {
  var path = location.pathname;
  if (path.indexOf('/checklists/') === 0 && path !== '/checklists/') {
    gtag('event', 'checklist_view', { page_path: path });
  } else if (path.indexOf('/articles/') === 0 && path !== '/articles/') {
    gtag('event', 'article_view', { page_path: path });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('calendly.com') !== -1) {
      gtag('event', 'calendly_click', { page_path: path, link_text: (a.textContent || '').trim().slice(0, 60) });
    } else if (href.indexOf('#quote-review') !== -1) {
      gtag('event', 'quote_review_cta', { page_path: path, link_text: (a.textContent || '').trim().slice(0, 60) });
    }
  }, true);

  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f && f.tagName === 'FORM') {
      var type = f.querySelector('select') ? f.querySelector('select').value : '';
      gtag('event', 'contact_submit', { page_path: path, contact_type: type });
    }
  }, true);
})();
