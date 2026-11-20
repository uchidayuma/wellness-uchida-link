# cto.uchida.link — プロジェクトルール

- ユーザーへの返答は**必ず日本語**
- デザインは `DESIGN_CONSTRAINTS.md` が制約。角丸・影・カードUI・3色以外は禁止。変更は本人の承認が要る
- 出荷前の検品はヘッドレスChromeのスクリーンショット（1200px幅と500px幅）で目視する
- **main への push はサイト公開**。ユーザーの確認を取ってから押す
- 記事（`articles/`）の執筆は `/write-article`。方向性は `docs/articles-direction.md`、文体は `.claude/skills/write-article/references/writing-rules.md`
- 料金の正典は `~/Documents/GitHub/youtube/fractional-cto/strategy/01_positioning.md`。サイト内のミラーは `strategy/README.md`
- 動画の素材は `~/Documents/GitHub/youtube/<NN-slug>/`（台本・構成・字幕・公開情報・素材）

- Google Analytics 4: 測定ID G-8G766V3E9K（alberorana@gmail.com のアカウント）。全ページの head で gtag.js と `/ga.js` を読み込む。新しいページを作るときも同じ2行を入れる。Search Console も同じアカウント（HTMLファイル googlec68581d368dcf47f.html は消さない）
