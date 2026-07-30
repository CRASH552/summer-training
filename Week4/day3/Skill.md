---
name: ai-training-daily-log-writer
description: "Write daily and weekly entries for an AI Engineering Summer Training activity log, submitted to a supervisor. Use this whenever the user describes what they did during a training/internship day and wants it turned into a log entry, asks to \"log today\", \"write up today's training\", \"fill in my daily report\", mentions their training supervisor, or wants a weekly reflection written after finishing a week of daily entries. Also trigger if the user references the daily activity log template, Day 1/Day 2/etc entries, or a weekly submission checklist for a training program."
---

Turns the user's casual, spoken-language description of a training day into a properly formatted daily log entry, matching their program's template. Runs as a 5-day batch: collect one day's description at a time, then produce all 5 daily entries plus the Weekly Reflection together, then deliver the whole thing as a PDF.

Workflow

1. **Collect 5 inputs, one day at a time.** When the skill triggers, ask the user to describe what they did, one day at a time (don't ask them to dump all 5 days at once).
   - For the **first day only**, also ask for the date.
   - For days 2–5, do NOT ask for a date — calculate it yourself as the calendar day following the previous entry's date, and just confirm the date you used when you show the entry.
2. **Draft all 5 daily entries** using the format below.
3. **Draft the Weekly Reflection** based on those 5 entries (see below).
4. **Show the user the complete report** (all 5 daily entries + Weekly Reflection) in chat and ask: "Is there something you want me to modify?"
5. **Iterate** on their feedback until they're happy.
6. **Once confirmed, save the final report as a PDF** and deliver the file — don't just leave it as chat text at that point.

Daily entry format

For each day, take the user's free-form description (not a structured Q&A) and produce an entry with exactly these fields, in this order:

### Day <N>
**Date:** <Day 1: use the date exactly as the user states it. Days 2–5: calculate it yourself as the previous entry's date + 1 calendar day>
**Today's Topic:** <short topic name>
**Daily Task Completed:** <what was completed>
**What I Learned (3–5 points):**
- <point 1>
- <point 2>
- <point 3>
**Work Evidence (GitHub / Colab / Files):** <links if the user gave any; otherwise write "(add link)">
**Challenges Faced:** <challenges as described by the user, or "None noted" if they didn't mention any>
**How I Solved Them:** <solutions, written by you based on the challenge described; omit content if no challenges were mentioned>
**Self-Evaluation:** <Excellent / Good / Fair / Need More Practice — ask the user if not stated>
**Supervisor Comments:** <leave blank — this is filled in by the supervisor>
How to fill it in
Rewrite the user's description in clear, professional but natural first-person language — don't just copy their casual phrasing verbatim.
For "What I Learned," extract 3–5 distinct, concrete takeaways from what they described. If they only described 1–2 things, ask a brief follow-up rather than padding with filler.
Only the Day 1 date comes from the user — use it as given, never guess it. For Days 2–5, calculate the date yourself (previous date + 1 calendar day) and mention it when you show the entry so the user can correct it if a day was skipped.
For "Challenges Faced" and "How I Solved Them," write both yourself from what the user describes — don't ask a separate question for these unless the user's description is too thin to infer anything from.
The only missing field worth asking the user about is the self-evaluation rating. Everything else — including work evidence links — should be inferred or defaulted (use "(add link)" if no link was given) rather than asked. Don't interrogate the user field by field.
Keep tone factual and concise; this is a training log, not a narrative essay.
Weekly Reflection (after Day 5)

Note: if the task was simple then no need to fill the report with so many information.

Once all 5 daily entries are drafted, automatically draft the Weekly Reflection section too — no need to ask permission first, since collecting 5 days' inputs already signals the user wants the full weekly report. Produce:

## Weekly Reflection
**What was the most valuable thing you learned this week?** <synthesize from the week's daily entries>
**What was the biggest challenge?** <synthesize from the week's daily entries>
**Which topic do you still need to practice?** <ask the user directly — this is forward-looking and Claude shouldn't guess>
**Additional Notes:** <leave blank unless the user has something to add>

Base the first two answers on the daily entries already produced in the conversation rather than asking the user to repeat themselves. Ask directly for "which topic to still practice" since that's a personal judgment call, not something to infer.

Review and output

1. First, show the complete report (all 5 daily entries + Weekly Reflection) as text in the chat, and ask: "Is there something you want me to modify?" Make any changes the user requests, showing the updated report again until they confirm it's good.
2. Once the user confirms, produce the final deliverable as a PDF file (not chat text) — see the `pdf` skill for how to generate it. Keep the same field structure and order as above; simple, clean formatting (headings for each day, bold field labels) is enough — no need for elaborate styling. **Put each day's entry on its own page** (a page break between Day 1, Day 2, ... Day 5), with the Weekly Reflection starting on its own page after Day 5.