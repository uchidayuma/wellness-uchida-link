/* 記事ページ共通。公開予約中の動画は、時刻が来るまで埋め込みを出さず、公開予定を表示する。
   使い方: <div class="article-video" data-video-id="XXXX" data-publish-at="2026-11-25T19:00:00+09:00"></div>
   data-publish-at が無い、または過去なら、そのまま埋め込む。 */
(function () {
  var boxes = document.querySelectorAll('.article-video[data-video-id]');
  Array.prototype.forEach.call(boxes, function (box) {
    var id = box.getAttribute('data-video-id');
    var title = box.getAttribute('data-title') || '';
    var at = box.getAttribute('data-publish-at');
    var due = !at || isNaN(Date.parse(at)) || Date.parse(at) <= Date.now();

    if (due) {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + id;
      iframe.title = title;
      iframe.loading = 'lazy';
      iframe.setAttribute('allow', 'encrypted-media; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(iframe);
      return;
    }

    var d = new Date(at);
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var label = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    box.innerHTML =
      '<div class="article-video-pending">' +
      '<p class="article-kicker">動画は ' + label + ' に公開</p>' +
      '<p>公開までは、下の文章でお読みください。</p>' +
      '</div>';
  });
})();
