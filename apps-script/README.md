# AiSED Registration Google Apps Script

Use `registration-webapp.gs` as the Google Apps Script web app for the AiSED registration portal.

## Deployment

1. Open the AiSED Registration Master Google Sheet.
2. Go to `Extensions > Apps Script`.
3. Paste the full contents of `registration-webapp.gs`.
4. Deploy as a web app:
   - Execute as: `Me`
   - Who has access: `Anyone`
5. Copy the web app URL.
6. Paste that URL into `conference_site/config.js`:

```js
window.AISED_CONFIG = {
  registrationEndpoint: "PASTE_WEB_APP_URL_HERE"
};
```

## Email Sender

The script uses route-specific sender details:

- General registration: `registration@aisedconference.org`
- Call for Papers: `papers@aisedconference.org`

For the email to appear directly from either mailbox, that address must be configured as a Gmail sender alias for the Google account that deploys the script. If the alias is not configured, the script will still send from the deploying script account and set the correct reply-to mailbox.

Call for Papers confirmation emails include the registration reference, paper title, Submit to SCOPUS answer, and the note that the paper will be reviewed by the committee with the next step communicated by 29th August 2026.
