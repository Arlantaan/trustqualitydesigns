// The one list of what Trust Quality Design actually does.
//
// There were previously three, and they disagreed:
//   - the homepage      Fascia & 3D Letters, Pylon, Billboards, Vehicle Wraps,
//                       Interior & Event Branding, Retail & Point-of-Sale
//   - /services         Brand Identity Design, Channel Letter Signs, Monument
//                       & Pylon, Wayfinding Systems, Vehicle Graphics,
//                       Interior Signage          (marked "Mock services")
//   - /api/services     Brand Strategy, Product Design, Digital Marketing, Web
//                       Development, Content Strategy, "Analytics & Analytics"
//                       -- a digital agency's services, left over from the
//                       starter template, for a company that builds signs
//
// This list is taken from TQD's own service poster (public/images/websitepics/
// t_q_d_1.jpg), which reads: PRINTING OF BILLBOARDS, SIGNBOARDS, TOTEM SIGNS,
// OFFICE BRANDING, ROLL UP, STICKERS, BANNERS, BUSINESS CARDS, LETTER HEADS,
// CALENDARS, FLYERS, T-SHIRTS, CAPS, MUGS.
//
// Dropped as things TQD does not offer: brand strategy, identity design,
// wayfinding systems, product design, web development, digital marketing,
// content strategy, analytics.

export type Service = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
  alt: string;
  includes: string[];
};

export const services: Service[] = [
  {
    slug: 'signboards-3d-letters',
    name: 'Signboards & 3D Letters',
    blurb: 'Shop fronts, fascias, office walls and illuminated lettering.',
    image: '/images/websitepics/T_Q_D_11.jpg',
    alt: 'Premier Banking by Ecobank fascia sign above a branch entrance',
    includes: ['Fascia signs', '3D wall logos', 'Illuminated letters', 'Lightboxes', 'Office branding'],
  },
  {
    slug: 'totem-pylon-signs',
    name: 'Totem & Pylon Signs',
    blurb: 'Free-standing roadside signs built to be read at distance.',
    image: '/images/websitepics/T_Q_D_13.jpg',
    alt: 'GNPC pylon sign with stacked illuminated letters',
    includes: ['Totem signs', 'Pylon signs', 'Forecourt signs', 'Steel fabrication', 'Installation'],
  },
  {
    slug: 'billboards',
    name: 'Billboards & Hoardings',
    blurb: 'Large-format campaign sites, built and printed in house.',
    image: '/images/websitepics/T_Q_D_9.jpg',
    alt: 'OIC Banjul Summit roadside billboards',
    includes: ['Roadside billboards', 'Site hoardings', 'Event boards', 'Frames & structures'],
  },
  {
    slug: 'banners-printing',
    name: 'Banners & Printing',
    blurb: 'Roll-ups, banners, stickers and everyday business print.',
    // Cropped from TQD's own service poster (t_q_d_1.jpg). NOTE: that poster
    // panel looks like a manufacturer shot of a Roland press rather than a
    // photograph of the machine on site — worth replacing with a real one.
    // It is here because the previous choice (T_Q_D_2.jpg) is dominated by
    // armoured vehicles, with the printed hoarding only a strip at the back.
    image: '/images/websitepics/tqd-printing.jpg',
    alt: 'Large-format roll-to-roll printer running a full-colour print',
    includes: ['Banners', 'Roll-up stands', 'Stickers', 'Flyers', 'Business cards', 'Letterheads', 'Calendars'],
  },
  {
    slug: 'branded-merchandise',
    name: 'Branded Merchandise',
    blurb: 'T-shirts, caps, mugs and pens carrying your mark.',
    image: '/images/websitepics/tqd-merchandise.jpg',
    alt: 'Branded polo shirt, caps, mugs and cups printed with client logos',
    includes: ['T-shirts & polos', 'Caps', 'Mugs & cups', 'Pens', 'Promotional items'],
  },
  {
    slug: 'vehicle-branding',
    name: 'Vehicle Branding',
    blurb: 'Full and partial wraps that work wherever the vehicle goes.',
    image: '/images/websitepics/T_Q_D_22.jpg',
    alt: 'Armanti Quality Food delivery van in a full printed wrap',
    includes: ['Full wraps', 'Partial graphics', 'Fleet branding', 'Cut vinyl'],
  },
];
