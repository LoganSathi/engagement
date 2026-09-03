export const EVENT_TITLE = "Logan & Venolia's Engagement Ceremony";
export const EVENT_LOCATION =
  "No 9, Jalan CV 4B/1, Cyber Valley, 63300 Cyberjaya, Selangor, Malaysia";
export const EVENT_DESC =
  "Join us as we celebrate the engagement of Logan & Venolia.";

// 2026-09-11 19:30 MYT (UTC+8) -> 11:30 UTC. Ceremony window assumed 3 hours.
export const EVENT_START_UTC = "20260911T113000Z";
export const EVENT_END_UTC = "20260911T143000Z";
export const EVENT_TARGET_MS = Date.parse("2026-09-11T19:30:00+08:00");

export function buildGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT_TITLE,
    dates: `${EVENT_START_UTC}/${EVENT_END_UTC}`,
    details: EVENT_DESC,
    location: EVENT_LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsBlobUrl() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Logan Venolia Engagement//EN",
    "BEGIN:VEVENT",
    "UID:logan-venolia-engagement-2026@invite",
    `DTSTAMP:${EVENT_START_UTC}`,
    `DTSTART:${EVENT_START_UTC}`,
    `DTEND:${EVENT_END_UTC}`,
    `SUMMARY:${EVENT_TITLE}`,
    `DESCRIPTION:${EVENT_DESC}`,
    `LOCATION:${EVENT_LOCATION}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  return URL.createObjectURL(blob);
}

export const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=No+9,+Jalan+CV+4B/1,+Cyber+Valley,+63300+Cyberjaya,+Selangor,+Malaysia&output=embed";

export const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=No+9,+Jalan+CV+4B%2F1,+Cyber+Valley,+63300+Cyberjaya,+Selangor,+Malaysia";

export const WAZE_EMBED_SRC =
  "https://embed.waze.com/iframe?zoom=16&lat=2.911001&lon=101.625303&ct=livemap";

export const WAZE_DIRECTIONS_URL = "https://waze.com/ul/hw28289cjx";

// TODO: replace with the real WhatsApp number (country code + digits only,
// e.g. Malaysian mobile "60123456789") before sharing the site.
export const RSVP_WHATSAPP_PHONE = "60123456789";

export function buildWhatsAppUrl() {
  const text =
    "Hi! RSVP for Logan & Venolia's Engagement (Fri 11 Sep 2026, 7:30PM, Cyber Valley):\n" +
    "Name: \nNumber of guests: ";
  return `https://wa.me/${RSVP_WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}
