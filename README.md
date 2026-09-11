# n8n-nodes-firmafind

Official [n8n](https://n8n.io/) community node for [firmafind](https://firmafind.at), a modern REST API for Austrian company data (Firmenbuch, GISA, UID/VAT validation, and annual financial statements).

![firmafind n8n node](https://firmafind.at/opengraph-image)

---

## Features

- **Search Companies**: Search registered Austrian entities by name, keyword, or Firmenbuchnummer (FN).
- **Get Details**: Retrieve normalized master data, registered office, legal form, UID/VAT status, active status, and authorized representatives (Geschäftsführer, Prokuristen, Vorstand).
- **Company Changes**: Poll daily Firmenbuch change logs and new registrations for monitoring and compliance.
- **Financials**: Retrieve normalized balance sheet items and financial metrics from annual filings (Jahresabschlüsse).
- **Documents**: Search available court filings, statutes, and balance sheet PDFs/XMLs.

---

## Installation

### In Self-Hosted n8n

1. Go to **Settings > Community Nodes** in your n8n instance.
2. Select **Install a community node**.
3. Enter `n8n-nodes-firmafind` into the input field.
4. Agree to the risks and click **Install**.

Once installed, restart your n8n instance (if running in Docker or PM2).

---

## Configuration & Credentials

1. Sign up for a free account or trial at [firmafind.at](https://firmafind.at).
2. Generate an API Key under [Dashboard > API Keys](https://firmafind.at/dashboard/keys).
3. In n8n, create a new credential of type **firmafind API** and paste your `ff_live_...` API key.

---

## Example Workflows

Pre-configured workflow templates are available in the [templates/](https://github.com/firmafind/n8n-nodes/tree/main/templates) directory:

1. **CRM / Lead Data Enrichment**: Automatically enrich new leads from Typeform, HubSpot, or Google Sheets with Austrian Firmenbuch data, UID, and legal address.
2. **Firmenbuch & Insolvency Monitoring**: Run a weekly check on your suppliers and customers to get Slack or Email alerts whenever a status change or management update occurs.

---

## Resources & Documentation

- [firmafind REST API Documentation](https://firmafind.at/docs)
- [firmafind Dashboard](https://firmafind.at/dashboard)
- [Support](mailto:support@firmafind.at)

---

## License

[MIT](LICENSE)
