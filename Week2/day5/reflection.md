# Reflection: AI Assistance vs. Manual Intervention

**Methodology:** Vibecoding — Building software by describing the desired outcomes to an AI and iteratively refining it.

---

### 1. Where AI Helped
* **Rapid Bug Resolution:** AI quickly diagnosed and fixed the real-time chat rendering issue, providing the correct logic to update the chat list instantly without a manual page refresh.
* **Feature Implementation:** AI handled the technical setup of the HTML FileReader API, successfully converting uploaded check-in photos to Base64 strings and displaying them directly in the timeline.
* **Writing Boilerplate & Guardrails:** AI easily generated the conditional logic needed to display warning messages and lock down the user interface once a shipment is marked complete.

### 2. Where Manual Intervention Was Necessary
* **Identifying Security Loopholes:** The AI did not automatically foresee that an employee could use the browser's back button to bypass state locks. I had to manually test the app, discover this loophole, and direct the AI to block access to the check-in view.
* **Verifying User Experience (UX):** I had to manually test the interface to ensure the chat messages appeared smoothly, photos rendered without breaking the layout, and warning messages were clear and easy to read.
* **Validating File and Environment Paths:** Hands-on manual testing was required to make sure files, photos, and chat states persisted properly across different accounts (Manager, Employee, and Client) in the local setup.