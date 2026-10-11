# Connect the contact form to Google Sheet and email

The website saves every valid message in `/admin/messages`, then posts it to your
Google Apps Script relay. The relay adds a row to your private Sheet and sends a
notification to **sarwad015@gmail.com**, with the visitor as the Reply-To address.
No Gmail password, paid email provider or Google Cloud billing account is needed.

## 1. Create your Sheet and prepare the private script

Open [sheets.new](https://sheets.new) while signed into your Google account. Name
the spreadsheet **Portfolio contact messages**. Copy its URL.

In the portfolio terminal run:

```powershell
npm run contact:prepare
```

Paste the Sheet URL when prompted. This creates `.data/contact-setup/Code.gs` with
your Sheet ID and a random shared secret, and stores that secret in `.env.local`.
It preserves your existing environment values. The generated files are private
and ignored by Git; paste the script only into your own Google project.

## 2. Create and authorize the Google script

1. Open [script.new](https://script.new) and name the project **Portfolio contact relay**.
2. Replace the default `Code.gs` contents with everything from your generated
   `.data/contact-setup/Code.gs` file. Save.
3. Select **setupPortfolioContact** in the function dropdown and click **Run**.
4. Sign in as the account that owns your Sheet and authorize Sheets access and
   sending email. Check that the project name is your own contact relay.

The setup creates the **Messages** tab and its headers. Keep the spreadsheet
private. If a Messages tab already has unrelated data, rename it first; the
script will not overwrite it.

## 3. Deploy the relay

1. Choose **Deploy → New deployment → Web app**.
2. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
3. Deploy and copy the web app URL ending in `/exec`.

Google must allow server requests without a visitor signing into Google. The
shared secret authenticates submissions; it is sent only by the portfolio
server. Google's [web app guide](https://developers.google.com/apps-script/guides/web)
explains these deployment options.

Add the URL to `.env.local`:

```dotenv
CONTACT_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

`CONTACT_WEBHOOK_SECRET` is already there from step 1. Restart local development
after changing environment variables.

## 4. Connect Vercel and verify

Open the portfolio project in Vercel → **Settings → Environment Variables**.
Add `CONTACT_WEBHOOK_URL` and `CONTACT_WEBHOOK_SECRET` for **Production** using
the same values from `.env.local`. Do not use a `NEXT_PUBLIC_` prefix.
Redeploy the latest production deployment so it receives these variables.

For an existing database run `npm run db:contact` once; it adds delivery tracking
without deleting messages. This migration has already been run for the current
hosted portfolio database.

Run:

```powershell
npm run contact:check
```

This sends **one labelled verification message** through the real relay and
checks that both destinations acknowledged it. Confirm the row in the Sheet and
the email in your inbox (including Spam). Then submit the live contact form and
check `/admin/messages` for **Delivered to Google Sheet and email**.

If delivery fails, the visitor's message remains in the dashboard. Use **Retry
delivery** after fixing the Google configuration or quota. Retries reuse the
same message ID, so the Google script keeps one Sheet row and skips notifications
already marked as sent. Google's [MailApp reference](https://developers.google.com/apps-script/reference/mail/mail-app)
documents email authorization and daily quotas.

When changing the Google script, publish a new version through **Deploy → Manage
deployments → Edit → New version**. If changing the shared secret, update both
the script configuration and Vercel before redeploying.
