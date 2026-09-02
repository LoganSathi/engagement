# Art generation checklist — Logan & Venolia mural

Generate these 8 images with your AI image tool, save into `web/public/art/`
with the exact filenames below, then tell Claude — each one gets wired in and
seam-checked individually.

**Append this style anchor to EVERY prompt** (your existing `temple.png` is
the style reference):

> in the style of a detailed 3D-rendered South Indian temple illustration,
> vibrant jewel tones, soft ambient light, high detail, clean edges

Rules that make the seams work:
- Nothing important in the top/bottom 8% of any image — those are fade zones.
- Keep key subjects inside the middle 60% of the width (temple-pan: middle 42%).
- Edge colors must fade to the EXACT flat hex given — that's what stitches
  sections together invisibly.

---

## 1. `temple-pan.png` — 1600 × 4800 (the signature scroll)
Tall portrait scene: top 15% is flat sky-blue `#8EC5EC` with a few soft clouds
(the couple's names sit in this sky). Golden gopuram crowns begin ~18% down;
a majestic multi-tiered South Indian temple gopuram covered in carved deities,
flanked by lush green trees, fills the frame down to ~90%. Bottom 8% fades to
flat warm cream `#F6EBD3`. Main tower centered within the middle 42% width.

## 2. `gateway-wall.png` — 2400 × 1600, transparent arch opening
A temple courtyard wall decorated with marigold garland swags, on flat cream
`#F6EBD3` at the top edge. Centered: an ornate pastel Meenakshi-style gateway
arch (pinks, mint, blue, gold) whose interior opening is FULLY TRANSPARENT and
spans the middle 55% of the width. Bottom 8% fades to `#FBF3E0`.

## 3. `pillar-border.png` — 512 × 2048, tileable vertically
A single carved stone pillar column with small deity figures and floral
capitals. MUST tile seamlessly top-to-bottom (loopable). The inner 25% (right
side) fades to transparent. Used mirrored on the page's right edge.

## 4. `garland-scene.png` — 2400 × 2000
Top 10% flat pale sky `#BEE3F1`. A cute stylized (chibi) Indian couple
exchanging flower garlands — bride in saree, groom in veshti/white shirt —
in front of golden-yellow gopuram towers, banana leaves framing the sides,
marigold garlands. A lotus-flower stage strip across ~85% height. Bottom 6%
fades to flat maroon `#7A1F2B`.

## 5. `story-ornaments.png` — 2000 × 2600, transparent center
Ornate red-and-gold arch border frame with palm-tree corner ornaments, drawn
on a FULLY TRANSPARENT background (the page provides the maroon behind it).
Center must stay empty/transparent for the photo + text.

## 6. `venue-showcase.png` — 2400 × 1350
Deep maroon `#45080E` background (top AND bottom 8% flat). A glowing golden
temple silhouette centered, flanked by two ornamental golden peacocks and
lotus flowers. Keep the bottom-center 20% clear/dark for the venue name text.

## 7. `rsvp-temples.png` — 2400 × 1400
Top 8% fades from `#45080E` down into a cream scene `#F5EBD0`. Two elegant
gold-and-cream temple towers flanking the left and right thirds; the middle
40% stays clear cream for the RSVP text and button. Bottom 8% flat `#F5EBD0`.

## 8. `countdown-gateway.png` — 2400 × 1600
Top 8% flat warm gold `#F5C64F` (sky). A grand golden gateway arch centered,
with open sky-gold space above it (a floating heart + countdown sit there).
Bottom 8% fades to `#F5EBD0`.

---

Optional later: 2 small embossed motif PNGs (800×800, transparent) for the
gallery corners, and 2–3 soft cloud PNGs for hero parallax.
