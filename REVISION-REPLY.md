# Reply to Shiloh — mandatory phone number

**Status: shipped and confirmed live.** Pushed as `e74d346`, deployed, and re-verified against
`https://apostellodetailing.com/book.html` itself — 40/40 checks, desktop and mobile. The "now
live" line below is a checked fact, not an assumption. The email is the only thing left.

**Why I didn't send it myself:** there are no mail credentials on this machine, and I'm not
pulling the production ones onto it. Two ways to send:

1. **Through the dashboard** — open his ticket in Revisions and hit *Mark done*. That fires the
   normal completion email from production and CCs the agency, so the ticket closes properly and
   the reply is on the record. This is the better route.
2. **By hand** — paste the text below.

---

**Subject:** Revision complete — phone number is now required on your booking form

Hi Shiloh,

The change you asked for is done and now live on the booking page.

A phone number is now required before anyone can generate a booking receipt. Specifically:

- The phone box is marked required, alongside name and email, with a line under the form
  explaining that you need a number to confirm the booking.
- It won't accept a filler answer. Entering "n/a" or a few stray digits gets turned back with
  "That phone number does not look right. Please include the area code." It needs a real
  10-digit number.
- Previously, if someone left the phone box empty, the receipt printed a dash where the number
  should have been — so a booking could reach you with no way to call anyone back. That can't
  happen now. If there's a receipt, there's a real number on it.
- On a phone it brings up the number keypad and offers autofill, so it's one tap for most people
  rather than a reason to abandon the form.

I tested it on desktop and mobile, including trying to get past it with a blank box, with "n/a",
and with a too-short number — all three are refused.

Have a look when you get a chance and let me know if you'd like the wording on any of the
messages changed.

— Inspiring Websites

---

## What actually changed

`book.html`, commit `6b83a2b`:

- All three receipt fields (`receiptName`, `receiptPhone`, `receiptEmail`) now carry
  `required` + `aria-required`, and an asterisk in the placeholder.
- Validation checks for a *plausible* value, not just a non-empty one: 10–15 digits for the
  phone, a real-looking address for the email.
- Each refusal names one problem, focuses that field and flashes its outline for 2s.
- The `phone || '—'` fallback on the receipt is gone.

Verified by `../verify-apostello-phone.mjs` — 40 checks, desktop + mobile, driven through the
intro splash gate with real mouse clicks. Blank / `n/a` / `555` are negative controls.
