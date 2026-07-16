# AiSED International Conference 2026 Registration Form

Use this structure in Google Forms.

## Form title

AiSED International Conference 2026 Registration

## Form description

2-4 December 2026  
Shah Alam Convention Centre, Malaysia

## Questions

1. Full Name
   - Short answer
   - Required

2. Email Address
   - Short answer
   - Required
   - Response validation: email

3. Mobile / WhatsApp Number
   - Short answer
   - Required

4. Organisation / Institution
   - Short answer
   - Required

5. Country
   - Short answer
   - Required

6. Registration Type
   - Multiple choice
   - Required
   - Options:
     - Visitor
     - Speaker
     - Partner

7. Visitor Category
   - Multiple choice
   - Show if Registration Type = Visitor
   - Options:
     - Student
     - General Visitor
     - Government Official
     - Corporate Visitor
     - Academic / Researcher

8. Speaker Category
   - Multiple choice
   - Show if Registration Type = Speaker
   - Options:
     - Keynote Speaker
     - Panel Speaker
     - Paper Presenter
     - Moderator / Chair

9. Partner Category
   - Multiple choice
   - Show if Registration Type = Partner
   - Options:
     - Strategic Partner
     - Ecosystem Partner
     - Sponsor
     - Media Partner

10. Paper / Presentation Title
    - Short answer
    - Optional

11. Submit to SCOPUS
    - Multiple choice
    - Show for Call for Papers presenter submissions
    - Required for presenters
    - Options:
      - Yes
      - No

12. Abstract / Full paper submission
    - File upload
    - Show for Call for Papers presenter submissions
    - Required for presenters

13. Dietary / Accessibility Notes
    - Paragraph
    - Optional

14. Consent
    - Checkbox
    - Required
    - Text: I confirm that the information provided is accurate and may be used by the AiSED Conference 2026 Secretariat for registration and event communication.

## Call for Papers auto-reply

- Sender / reply-to mailbox: papers@aisedconference.org
- Trigger: Call for Papers registration submission
- Message: acknowledge receipt, include the registration reference, paper title, and Submit to SCOPUS answer, and state that the paper will be reviewed by the committee with the next step communicated by 29th August 2026.

## Recommended Google Form settings

- Collect email addresses: On
- Send responders a copy: On
- Limit to 1 response: Off, unless you only want one response per Google account
- Link responses to Google Sheets: On

## After creating the form

Copy the public form link from Google Forms:

Send > Link > Copy

Then paste it into:

```js
registration: "YOUR_GOOGLE_FORM_LINK"
```

inside `config.js`.
