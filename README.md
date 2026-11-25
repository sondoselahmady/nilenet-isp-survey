# NileNet ISP Survey

A Google Apps Script customer-satisfaction survey with a scoring flow and an admin dashboard for viewing or clearing responses. Responses are stored in Script Properties.

## Files
- `Code.gs`: survey scoring, response storage, and PIN-checked admin functions.
- `Index.html`: customer survey.
- `Admin.html`: submissions dashboard.

## Set your private admin PIN
Before deploying, edit `Code.gs` and replace `REPLACE_WITH_YOUR_PRIVATE_PIN` with a new private PIN. Do not commit your real PIN to a public repository. The placeholder is intentionally non-working. Then deploy the Apps Script web app and keep its access settings appropriate for the survey and dashboard.
