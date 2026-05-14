# Mixed beverage receipts (Texas)

## Tracked in git

- Smaller samples and **analysis notes** stay in the repo (`*.md`, `*sample*.json`).

## Not tracked (too large for GitHub)

Files matching `*-zips-full-*.json` are **gitignored**. They are optional local pulls from:

- [Texas Open Data — Mixed Beverage Gross Receipts (`naix-2893`)](https://data.texas.gov/resource/naix-2893)

Download with your preferred tool (portal export, Socrata API, or Comptroller open data) and save beside this README. The playbook references the downtown wedge export used on **2026-05-13**; filename pattern:

`mixed-beverage-travis-core-downtown-zips-full-2026-05-13.json` (~59 MB)

## Slimming repo history

If that file was pushed before it was gitignored, it still bloats **git history**. To remove it from history (destructive, coordinate with collaborators):

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) or `git filter-repo` / BFG.
