# AI and finance opportunities

A free, static dashboard for internships, hackathons, fellowships and scholarships in AI and finance. Data lives in `data/listings.json`.

## Run locally

Opening `index.html` directly will not load the data. Use a local server:

```
python -m http.server 8000
```

Then open http://localhost:8000

## Deploy for free (GitHub Pages)

1. Create a GitHub account and a new **public** repository, for example `opportunity-hub`.
2. Click **Add file > Upload files**, drag in everything from this folder (`index.html`, `README.md`, and the `data` folder), and commit.
3. Go to **Settings > Pages**. Under **Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/opportunity-hub/`.

## Listing format

Each entry in `data/listings.json`:

| Field | Values |
|---|---|
| id | unique string |
| title, org, summary | text |
| type | Internship, Hackathon, Fellowship, Scholarship |
| domain | AI, Finance, AI × Finance |
| region | Global, Online, Asia, Europe, North America, Africa, ... |
| funding | Paid, Fully funded, Prize, Unpaid |
| level | Undergraduate, Graduate, Early career, Anyone |
| deadline | YYYY-MM-DD (listings disappear after this date) |
| url | official source link |
| checked | date you last verified it |
| sample | true only for placeholder entries |

## Rules for real listings

- Only add an opportunity after confirming it on the organizer's official page.
- Always include the source `url` and today's date in `checked`.
- Remove `"sample": true` once an entry is real. The sample banner disappears when no samples remain.

## Roadmap

- Day 2: script that turns a URL into a draft listing using a free LLM
- Day 3: daily GitHub Action to collect, dedupe, and drop expired listings
- Day 4: profile matching and chat search
- Day 5: submit form, email digest, launch
