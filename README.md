# G2 Software Scraper – Product Reviews & Ratings

Scrape software product reviews, ratings, and comparisons from G2. Get structured data for competitor analysis, product research, and market intelligence.

## What it extracts

- Product names and descriptions
- Star ratings and review counts
- User reviews and sentiment
- Pricing information
- Category and feature comparisons

## Use cases

- **Competitor analysis** — Compare software products in your space
- **Product research** — Understand user sentiment about specific tools
- **Market intelligence** — Identify trending software categories
- **Vendor evaluation** — Research options before purchasing

## Notes

- Scrapes publicly available G2 data
- No account required
- Supports search by product category or keyword

## Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| query | string | Yes | Product name or category |
| limit | number | No | Max products to extract (default: 20) |
