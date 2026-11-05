/* =========================================================================
   APOSTELLO DETAILING — SITE CONFIG
   Shiloh: this file is where you update pricing, service-area zips, and
   the before/after gallery. No HTML/CSS editing required for those three.
   ========================================================================= */

// The referral form and email signup form open a pre-filled email addressed
// here (no backend / no 3rd-party form service). Swap in Shiloh's real inbox.
const CONTACT_EMAIL = "apostello.business@gmail.com";
const CONTACT_PHONE = "(540) 484-3990";
const CONTACT_PHONE_TEL = "+15404843990";

// Business is Apostello Detailing, 5831c Old Franklin Turnpike, Glade Hill, VA
// 24092 — 5.0★ (4 reviews) on Google as of this listing snapshot.
//
// Two earlier attempts at this both 404'd:
//   - /local/writereview?placeid=<CID> — that endpoint needs Google's
//     alphanumeric Place ID (ChIJ...), not a numeric CID. Wrong ID type.
//   - google.com/maps?cid=<CID> — opened the listing but not proven to
//     reach the review composer.
// This URL is different: it's the ACTUAL address bar link captured live
// while the review pop-up was open on Shiloh's real listing (confirmed by
// the user, not guessed) — the !9m1!1b1 flag is what triggers the write-
// review dialog to open automatically. Trust this one over any hand-built
// alternative. The ?entry=ttu&g_ep=... suffix is Google's click-tracking
// and is very likely optional, but leave it as-is since this exact string
// is the one proven to work — don't "clean it up" without re-testing live.
const GOOGLE_REVIEW_URL = "https://www.google.com/maps/place/Apostello+Detailing/@37.0067829,-79.7772451,17z/data=!4m8!3m7!1s0x884d676b4ceb58f9:0x84f0e111fb99887a!8m2!3d37.0067829!4d-79.7772451!9m1!1b1!16s%2Fg%2F11zx49b7n7?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D";

// ---- CAR DETAILING PRICING ----
// Straight from Shiloh's price sheet graphic (Nov 5 2026). Every page renders
// cards, add-ons, sizes and recurring from these objects — change prices here.
// `includes` = add-on keys a package already contains (shown as "Included").
// `recurring` = eligible for the recurring discount ("Base packages only").
const CAR_PACKAGES = {
  exterior: { name: "Exterior", price: 100, recurring: true,
              desc: "Wash, wheels, tires, windows, spray wax" },
  interior: { name: "Interior", price: 100, recurring: true,
              desc: "Vacuum, wipe-down, windows, spot clean" },
  full:     { name: "Full Detail", price: 175, recurring: true, badge: "Most Popular", featured: true,
              desc: "Interior + exterior + spray wax" },
  deep:     { name: "Deep Clean", price: 250, badge: "Save $25", includes: ["carpet", "seat"],
              desc: "Full detail + carpet shampoo + seat upholstery" },
};

const VEHICLE_SIZES = {
  sedan: { name: "Sedan / coupe", price: 0 },
  suv:   { name: "SUV / truck",   price: 25 },
  big:   { name: "3-row / van",   price: 50 },
};

const ADD_ONS = {
  carpet: { name: "Carpet shampoo",  price: 60 },
  seat:   { name: "Seat upholstery", price: 40 },
};

// Percent off the package price only (not size or add-ons), base packages only.
const RECURRING_PLANS = {
  monthly:  { name: "Monthly",   pct: 15, cadence: "every month" },
  biweekly: { name: "Bi-weekly", pct: 20, cadence: "every 2 weeks" },
};

const PRICING_NOTE = "Not sure what you need? Book the Full Detail. I'll inspect your vehicle and recommend any extras before I start. No surprise charges.";
const SOILING_NOTE = "Heavy pet hair, sand, or soiling: +$25–50, quoted before work begins.";

// Shared renderers so home, services and book can't drift apart.
function packageCardHTML(key, p, { tag = 'div', selected = false } = {}) {
  const badge = p.badge
    ? `<span class="absolute -top-3 right-6 chip selected text-[11px] py-1 ${p.featured ? '' : 'text-[var(--gold-400)]'}" style="${p.featured ? '' : 'border-color:var(--gold-400)'}">${p.badge}</span>`
    : '';
  const attrs = tag === 'button' ? `type="button" data-pkg="${key}"` : '';
  return `<${tag} ${attrs} class="surface tier-card ${p.featured ? 'tier-best' : ''} relative flex flex-col justify-start text-left p-6 md:p-7 w-full ${selected ? 'ring-2 ring-[var(--blue-400)]' : ''}">
    ${badge}
    <div class="flex items-start justify-between gap-4 mb-2">
      <p class="font-bold text-lg text-[var(--white)]">${p.name}</p>
      <p class="font-display text-4xl leading-none ${p.featured ? 'text-[var(--gold-400)]' : ''}">$${p.price}</p>
    </div>
    <p class="text-sm text-[var(--muted)]">${p.desc}</p>
  </${tag}>`;
}
function pricingExtrasHTML() {
  const row = (l, r) => `<div class="flex justify-between gap-3 py-1"><span>${l}</span><span class="font-bold text-[var(--white)]">${r}</span></div>`;
  return `
  <div class="surface p-6"><p class="eyebrow mb-3 text-[var(--muted)]">Add-ons</p><div class="text-sm text-[var(--muted)]">
    ${Object.values(ADD_ONS).map(a => row(a.name, '$' + a.price)).join('')}</div></div>
  <div class="surface p-6"><p class="eyebrow mb-3 text-[var(--muted)]">Vehicle size</p><div class="text-sm text-[var(--muted)]">
    ${Object.values(VEHICLE_SIZES).map(s => row(s.name, s.price ? '+$' + s.price : 'Base')).join('')}</div></div>
  <div class="surface p-6"><p class="eyebrow mb-3 text-[var(--muted)]">Recurring</p><div class="text-sm text-[var(--muted)]">
    ${Object.values(RECURRING_PLANS).map(r => row(r.name, r.pct + '% off')).join('')}
    <p class="text-xs text-[var(--muted-2)] mt-1">Base packages only</p></div></div>`;
}

// ---- BOAT DETAILING (from your boat flyer) ----
const BOAT_RATE_PER_FT = 15;
const BOAT_EXAMPLES = [
  { ft: 16, price: 240 }, { ft: 18, price: 270 }, { ft: 20, price: 300 },
  { ft: 22, price: 330 }, { ft: 24, price: 360 }, { ft: 26, price: 390 },
];
const BOAT_INCLUDES = ["Exterior wash", "Hull cleaning", "Spray wax", "Exterior shine & finish", "Mobile service — I come to you"];

// ---- SERVICE AREA ----
// Franklin County, VIRGINIA (Rocky Mount / Smith Mountain Lake area — 540 area
// code, confirmed by Shiloh's real zip 24092) plus the nearest surrounding
// towns. Double check this list with Shiloh and add/remove zips as needed.
const SERVICE_AREA_ZIPS = [
  "24151", // Rocky Mount (county seat)
  "24092", // Glade Hill
  "24065", // Boones Mill
  "24067", // Callaway
  "24085", // Endicott
  "24088", // Ferrum
  "24101", // Hardy
  "24102", // Henry
  "24137", // Penhook
  "24174", // Union Hall
  "24184", // Wirtz
  "24121", // Moneta (Smith Mountain Lake)
  "24095", // Goodview (Smith Mountain Lake)
  "24175", // Vinton (Roanoke County, nearby)
  "24011","24012","24013","24014","24015","24016","24017","24018","24019", // Roanoke
  "24523", // Bedford
];

// ---- BEFORE / AFTER VIDEOS (primary gallery — Shiloh mostly shoots vertical clips) ----
// Add a new one by pushing { src: "videos/xyz.mov", label: "..." }. Drop the file in
// videos/ and add an entry here — no other changes needed.
const VIDEO_ITEMS = [
  { src: "videos/before-after-1.mov", label: "Full Detail" },
  { src: "videos/before-after-2.mov", label: "Full Detail" },
  { src: "videos/before-after-3.mov", label: "Full Detail" },
];

// The single real before/after photo (cropped from Shiloh's composite) is
// hardcoded directly into the "Drag to Compare" sections on index.html and
// gallery.html (images/gallery/interior-before.jpg / interior-after.jpg).
// When more real photo pairs come in, follow that same pattern — drop the
// pair in images/gallery/ and duplicate one of those .ba-slider blocks.

// ---- REVIEWS ----
// Placeholder testimonials styled like Google review cards. Wire to a live
// widget (e.g. Elfsight Google Reviews) once Shiloh's Business Profile is set up.
const REVIEWS = [
  { name: "Jordan M.", rating: 5, text: "Came out to my driveway and my car looked brand new inside and out. Super easy to book too.", source: "Google" },
  { name: "Aaliyah R.", rating: 5, text: "Best detail I've had in Franklin County, hands down. Booked online in like two minutes.", source: "Facebook" },
  { name: "Trevor S.", rating: 5, text: "Did my boat before we launched for the weekend. $15/ft was fair and the hull looked incredible.", source: "Google" },
];
