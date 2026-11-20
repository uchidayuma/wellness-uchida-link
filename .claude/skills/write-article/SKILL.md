---
name: write-article
description: YouTube（@yumaapp）の社長向け動画を、cto.uchida.link の記事（articles/<slug>/index.html）に書き起こす。「記事にして」「動画NNを記事に」「記事を書いて」と言われたら使う。
---

# write-article

YouTubeの動画1本を、サイトの記事1本にする。読者は中小企業の社長。目的はGoogle検索からの流入と、見積もりレビュー・無料相談への導線。方向性は `docs/articles-direction.md`、文体は `references/writing-rules.md` を必ず読む。デザインは `DESIGN_CONSTRAINTS.md` に従う。

**ユーザーへの返答は日本語。** ユーザーは判断だけ。素材の読み込み・執筆・検品・コミットはClaudeが進める。

## 1. 素材を集める

動画の素材は `~/Documents/GitHub/youtube/<NN-slug>/` にある。優先順で読む。

| ファイル | 使い方 |
|---|---|
| `台本.md` | あれば本文の正。節ごとの「言い切る一文」をh2の下の最初の段落にする |
| `構成.md` | 台本がなければこれを正にする |
| `edit/NN.srt` | 台本も構成もなければ字幕から起こす。言い直し・つなぎ言葉は落とす |
| `公開情報.md` | タイトル、概要欄、チャプター、動画ID、関連動画、明日やることの文面 |
| `素材.md` | 図表の数字。記事の表は必ずここの数字と一致させる |
| `VIDEO_LOG.md` | 公開日、尺、実体験の出所、「要確認」の注記 |

動画IDは `公開情報.md` か `.upload.json` か `VIDEO_LOG.md` のURLから取る。公開日は公開予約日。

## 2. 書く

- `articles/maintenance-cost/index.html` をテンプレートとして複製する。head（title・description・canonical・og・JSON-LD）、kicker、h1、meta、lead、video、body、まとめ、明日やること、次の一歩、注記、の順を崩さない
- 動画の枠は `<div class="article-video" data-video-id="<ID>" data-title="<タイトル>" data-publish-at="<YYYY-MM-DD>T<HH:MM>:00+09:00"></div>` と、`</body>` 直前の `<script src="../article.js"></script>` の形にする（例: `articles/security-three-questions/index.html`）。公開済みの動画なら `data-publish-at` は省略。時刻が来るまで公開予定を表示し、来たら埋め込みに変わる
- スラッグは youtube 側のディレクトリ名から番号を外したもの（例: `08-maintenance-cost` → `maintenance-cost`）
- 文体は `references/writing-rules.md`。**1文ごとに `<br />` で改行。話し言葉を文章体に直す。冗長な繰り返しを削る**
- 表は `.article-table`。サンプルの数字には caption に「サンプルとして作成」と入れる
- 「明日やること」は動画の締めの行動を1つだけ。メール文面があれば `.quote-block` に入れる
- 「次の一歩」は2段。上が有料（見積もりレビュー ¥50,000 か、内容に近いサービス）、下が無料相談30分。価格はトップページの料金表と一致させる
- 動画内の数字・金額・固有名詞は、台本と素材の数字以外を足さない。裏取りのない数字を入れない
- 「要確認」と VIDEO_LOG に書かれた発言は、記事では和らげるか落とす

## 3. 一覧とリンク

- `articles/index.html` の `.article-list` に新しい記事を**先頭**に追加（新しい順）
- 同じシリーズの記事がある場合は、末尾の注記で相互にリンクする（見積もりシリーズ: 03・04・08）

## 4. 検品

```bash
cd ~/Documents/GitHub/wellness-uchida-link
OUT=/tmp/article-check; mkdir -p $OUT
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=1200,5200 --screenshot=$OUT/a-1200.png "file://$PWD/articles/<slug>/index.html"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --window-size=500,7000  --screenshot=$OUT/a-500.png  "file://$PWD/articles/<slug>/index.html"
grep -n "border-radius\|box-shadow\|gradient" articles/<slug>/index.html   # 出たら直す
```

- 2枚の画像を目視する。見出しの語中改行、表のはみ出し、文の途中の改行、濃色背景の文字色を見る
- ローカルの `file://` ではYouTube埋め込みが「configuration error」になる。公開後は再生される。これは不良ではない
- 相対パス（`../../styles.css` など）が階層と合っているか確認

## 5. コミットと公開

- ブランチ `articles` で作業し、記事ごとにコミットする。コミット末尾に `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`
- **main への push はサイト公開なので、ユーザーの確認を取ってから**。確認後は `git checkout main && git merge articles && git push`
- 公開後、YouTube側の概要欄に記事URLを追記する作業は youtube リポジトリ側（`公開情報.md`）で行う
