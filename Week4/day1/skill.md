# 📄 1. docx — Word Document Skill
Core Focus: Programmatic creation, editing, and restructuring of text-heavy, formatted documents (.docx, .dotx).

## 💡 Problem It Solves
Bypasses the complexity of Word's internal XML structure and formatting rules to easily handle non-trivial document elements:

Document Structure: Dynamic tables of contents, heading hierarchies, page numbering, and section breaks.

Branding & Layout: Applying letterheads, margins, and custom document templates.

Collaboration & Edits: Inserting/accepting tracked changes, adding comments, performing styled find-and-replace operations.

Media: Programmatically inserting, positioning, or replacing images.

## 🎯 When It Triggers
Invoked whenever a Word document is explicitly referenced by name, extension, or functional role.

Example Triggers:

"Make me a report"

"Edit this .docx file"

"Insert a table of contents"

"Reorganize the content in this Word template"

"Do a find-and-replace in this document"

⛔ Exclusions: Does not trigger for PDFs, spreadsheets, Google Docs, or generic programming requests.

# 📊 2. pptx — PowerPoint Skill
Core Focus: Generating, modifying, and inspecting visual slide decks and presentation templates (.pptx, .potx).

## 💡 Problem It Solves
Eliminates the need to navigate PowerPoint's spatial XML schema manually by providing direct control over slide elements:

Slide & Template Layouts: Creating custom layouts, applying .potx templates, and adjusting element coordinates.

Content Management: Editing slide text, formatting shape boundaries, and managing speaker notes.

Data Extraction: Parsing visual slide content into structured text.

## 🎯 When It Triggers
Broader than expected: Triggers for any interaction with a presentation file, including reading/extracting text from slides even if the final result is intended for an email or plain-text summary.

Key Trigger Words: deck, slides, presentation, or any .pptx / .potx filename.

Example Triggers:

"Build a pitch deck for..."

"Extract the text and speaker notes from this slide deck"

"Update the layout on slide 3"

# 📈 3. xlsx — Spreadsheet Skill
Core Focus: Reading, processing, cleaning, and generating grid-based data files (.xlsx, .xlsm, .xltx, .csv, .tsv).

## 💡 Problem It Solves
Transforms raw or messy data into structured, production-ready workbooks:

Data Hygiene: Aligning malformed rows, handling missing headers, and fixing data types.

Modeling & Computation: Injecting dynamic formulas, constructing calculation sheets, and setting up cross-sheet references.

Visual Presentation: Formatting number masks, adjusting cell borders, adding zebra striping, and building dynamic charts.

## 🎯 When It Triggers
Narrowly scoped: Only triggers when the spreadsheet file itself is the direct input or final required deliverable.

Example Triggers:

"Clean up this CSV file"

"Add a formula column to this .xlsx"

"Build a financial model"

⛔ Exclusions: If the final deliverable is actually a Word report, HTML page, or script—even if tabular data is used along the way—this skill does not trigger.