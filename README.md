# Portfolio & Resume

This repository hosts the portfolio website and the source code for generating the resume PDF/HTML.

## Resume Management

The resume is managed as code using `resume.json` (Japanese) and `resume-en.json` (English).

### Setup

```bash
npm install
```

### Local Preview

To preview the resume locally:

**Japanese:**
```bash
npm run serve
```

**English:**
```bash
npm run serve:en
```
Open [http://localhost:4000](http://localhost:4000) in your browser.

### Export PDF & HTML

To generate all resume files in `resume/` directory:

```bash
npm run export
```
This produces:
- `resume/resume-ja.pdf`
- `resume/index.html` (Japanese)
- `resume/resume-en.pdf`
- `resume/resume-en.html` (English)

### Editing content

1. Edit `resume.json` for Japanese or `resume-en.json` for English.
2. Push to `main` branch.
3. GitHub Actions will automatically generate the artifacts.
