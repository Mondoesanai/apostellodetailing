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

// ---- CAR DETAILING PACKAGES (from your pricing flyer) ----
const CAR_PACKAGES = {
  good:   { name: "Good",   price: 100, tagline: "The essentials, done right",
            features: ["Interior vacuum & wipe down", "Basic interior cleaning", "Exterior wash", "Wheels & tires cleaned"] },
  better: { name: "Better", price: 150, tagline: "Our most popular detail", featured: true,
            features: ["Full deep interior detail", "Thorough interior cleaning", "Thorough exterior wash", "Wheels & tires cleaned"] },
  best:   { name: "Best",   price: 200, tagline: "The full Apostello treatment",
            features: ["Full deep interior detail", "All surfaces & crevices", "Premium exterior wash & finish", "Wheels & tires cleaned"] },
};
const VEHICLE_UPCHARGE = 40; // trucks w/ bed, 3rd row, or large-trunk SUVs

const ADD_ONS = {
  sprayWax:   { name: "Spray Wax",         price: 40, blurb: "Shine + long-lasting paint barrier" },
  carnauba:   { name: "Carnauba Wax",      price: 60, blurb: "Hand-applied deep gloss & protection" },
  carpet:     { name: "Carpet Upholstery", price: 60, blurb: "Full vehicle deep clean" },
  seat:       { name: "Seat Upholstery",   price: 40, blurb: "Full vehicle deep clean" },
};

// Suggested recurring pricing (NOT on the original flyer — placeholder discount
// off the Better package. Confirm real numbers with Shiloh before launch.)
const RECURRING_PLANS = {
  monthly:  { name: "Monthly Maintenance",   pricePerVisit: 125, cadence: "every month",   save: 25 },
  biweekly: { name: "Bi-Weekly Maintenance", pricePerVisit: 115, cadence: "every 2 weeks", save: 35 },
};

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
