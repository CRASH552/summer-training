| Skill | Input given | Core library | Verification step | Result |
| :--- | :--- | :--- | :--- | :--- |
| **docx** | "Test memo" text with a heading and bold run | docx (npm/JS) — write-once, no formula/recalc concerns | Convert to PDF → render to JPEG → visually inspect | Clean, no issues |
| **xlsx** | Budget table (3 line items + formulas for line totals and grand total) | openpyxl (Python) | Mandatory recalc.py (LibreOffice) — openpyxl writes formulas as strings with no cached values, so this step is non-negotiable, not just a QA nicety | total_errors: 0 on first pass |
| **pptx** | 2-slide deck (title slide + bulleted takeaway slide) | pptxgenjs (npm/JS) | validate.py (schema/relationship checks) then PDF→JPEG visual QA — two separate required checks, because pptxgenjs can emit XML that "looks fine" but corrupts on open | Validator passed; slide 1 rendered cleanly |

**Behavioral differences worth noting:**

* **Different languages by default.** docx and pptx both default to JS libraries (docx, pptxgenjs); xlsx defaults to Python (openpyxl). Same "create Office file" task class, different toolchains.
* **Verification burden scales with risk of silent failure.** docx's checklist is short (just look at the render). xlsx has a mandatory recalc step because unrecalculated formulas silently read as blank. pptx has the heaviest process — schema validation and visual QA — because pptxgenjs can produce a file that opens but is subtly corrupt (e.g., bad chart XML).
* **Each skill front-loads its own "gotchas" list** (page size defaults, hex color formatting, formula function support) rather than relying on general library knowledge — the skills exist specifically to route around known footguns in each library/runtime.