// Central source of truth for blog posts.
// Used by the /blog list and the /blog/[slug] article pages.
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  featured?: boolean;
  author: string;
  readTime: string;
  image: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Why Quality Signage Is Your Best Marketing Investment',
    slug: 'why-quality-signage-is-best-marketing',
    excerpt:
      'A well-made sign works 24 hours a day, 7 days a week. Here\'s why investing in quality signage delivers the highest long-term return for Gambian businesses.',
    publishedAt: new Date('2025-03-10'),
    featured: true,
    author: 'Trust Quality Design',
    readTime: '5 min read',
    image: '/images/websitepics/T_Q_D_14.jpg',
    content: [
      'Every marketing channel has a cost per exposure. Radio spots stop when the ad budget runs out. Social media posts disappear beneath the next wave of content. But a well-built sign keeps working long after it is paid for — day and night, in every kind of weather, for years at a time.',
      'That is what makes signage the highest long-term return in most marketing budgets. A single storefront sign can generate tens of thousands of impressions a month from foot and vehicle traffic alone, at a cost that drops toward zero the longer it stays up.',
      'The key word, though, is quality. A faded, peeling, or poorly lit sign sends the opposite message — it tells customers your business is not being cared for. A crisp, well-illuminated, professionally installed sign signals stability, trust, and attention to detail before a customer ever walks through the door.',
      'For businesses across The Gambia, from Banjul to Serrekunda, this is where the investment pays off. Durable materials chosen for heat, humidity, and harmattan dust mean your sign still looks new years later. That longevity is what turns a one-time cost into a permanent marketing asset.',
      'When you plan your next marketing budget, think beyond the campaign that ends. Think about the asset that keeps earning. That is what quality signage does.',
    ],
  },
  {
    id: '2',
    title: 'LED vs. Traditional Illuminated Signs: What\'s Right for Your Business?',
    slug: 'led-vs-traditional-illuminated-signs',
    excerpt:
      'We break down the energy savings, lifespan, and visual impact of modern LED signage compared to older fluorescent and neon options.',
    publishedAt: new Date('2025-02-18'),
    author: 'Trust Quality Design',
    readTime: '6 min read',
    image: '/images/websitepics/T_Q_D_15.jpg',
    content: [
      'Illuminated signs make your business visible when it matters most — in the evening, when people are deciding where to eat, shop, or do business. But not all illumination is equal. The choice between modern LED and traditional fluorescent or neon systems affects your running costs, your maintenance, and your look for years.',
      'LED signage has become the standard for good reason. LEDs use a fraction of the electricity of fluorescent tubes or neon, which matters everywhere but especially where power is expensive or inconsistent. Lower draw also means an LED sign pairs more easily with backup power.',
      'Lifespan is the second big difference. Quality LEDs can run for 50,000 hours or more — often a decade of nightly use — with minimal drop in brightness. Neon and fluorescent tubes dim, flicker, and fail far sooner, meaning more service calls and more downtime when your sign is dark.',
      'Visually, LEDs give you sharper, more even illumination and a much wider range of colors and effects. Neon still has a distinctive retro character some brands love, but for most businesses LED delivers a cleaner, more modern, more legible result.',
      'The honest trade-off is upfront cost: a quality LED build can cost more to fabricate than a basic tube-lit box. But when you add up the energy savings and years of avoided maintenance, LED almost always wins over the life of the sign. For most Gambian businesses, it is the smarter long-term choice.',
    ],
  },
  {
    id: '3',
    title: 'How Strong Branding Builds Customer Trust in The Gambia',
    slug: 'strong-branding-builds-customer-trust-gambia',
    excerpt:
      'From Serrekunda to Banjul, businesses with consistent visual identity consistently outperform those without. Here\'s the evidence.',
    publishedAt: new Date('2025-01-22'),
    author: 'Trust Quality Design',
    readTime: '5 min read',
    image: '/images/websitepics/T_Q_D_16.jpg',
    content: [
      'Trust is the currency of business. Before a customer spends money with you, they make a quick, often unconscious judgment about whether you are credible and reliable. Branding is how you win that judgment.',
      'Consistency is what does the work. When your logo, colors, and signage look the same on your shopfront, your vehicles, your receipts, and your social media, customers see a business that is organized and established. When those elements clash or look improvised, doubt creeps in — even if the product is excellent.',
      'Across The Gambia, the businesses that grow fastest tend to be the ones that take identity seriously early. A consistent visual identity makes a single shop feel like a brand, and a brand feel like it could be anywhere — which is exactly the impression that earns repeat customers and word-of-mouth.',
      'Strong branding also protects your pricing. Customers will pay more, and complain less, when they believe they are buying from a quality operation. That perception is built almost entirely through visual consistency and presentation.',
      'You do not need to rebrand everything overnight. Start with a clear logo, a defined color palette, and signage that reflects both — then apply them everywhere, without exception. Consistency compounds, and trust grows with it.',
    ],
  },
  {
    id: '4',
    title: 'The Complete Guide to Wayfinding Signage for Large Facilities',
    slug: 'guide-to-wayfinding-signage',
    excerpt:
      'Hospitals, universities, and government complexes all rely on clear wayfinding. Learn the principles behind effective directional signage systems.',
    publishedAt: new Date('2024-12-05'),
    author: 'Trust Quality Design',
    readTime: '7 min read',
    image: '/images/websitepics/T_Q_D_17.jpg',
    content: [
      'When someone walks into a hospital, a university, or a government complex for the first time, they are often stressed and short on time. Good wayfinding signage quietly removes that stress by answering one question at every decision point: which way do I go?',
      'The foundation of wayfinding is a clear hierarchy of information. Identification signs tell you where you are. Directional signs tell you where to turn. Informational signs give you details like hours or department names. Regulatory signs tell you the rules. Mixing these up is the fastest way to confuse visitors.',
      'Placement matters as much as content. Signs should appear exactly where decisions are made — at entrances, intersections, and elevators — and they should be readable at the distance and speed people are moving. A sign in the wrong place, however beautiful, does not help anyone.',
      'Consistency ties the system together. The same fonts, colors, arrow styles, and terminology should repeat throughout the facility so visitors learn the language of the space quickly. In The Gambia, bilingual signage often widens accessibility further.',
      'Finally, plan for accessibility and durability from the start: legible contrast, tactile and accessible-height signs where needed, and materials built to last. A wayfinding system is infrastructure — designed once, relied on daily for years.',
    ],
  },
  {
    id: '5',
    title: 'Choosing the Right Materials for Outdoor Signs in West Africa',
    slug: 'outdoor-sign-materials-west-africa',
    excerpt:
      'Heat, humidity, and harmattan dust demand specific material choices. We explain what holds up best in the Gambian climate.',
    publishedAt: new Date('2024-10-14'),
    author: 'Trust Quality Design',
    readTime: '6 min read',
    image: '/images/websitepics/T_Q_D_18.jpg',
    content: [
      'A sign that looks perfect on installation day but fades, warps, or peels within a year is not a bargain — it is a repeat expense. In the West African climate, material choice is the single biggest factor in how long your sign survives.',
      'Heat and sun are the first enemies. Intense UV exposure fades low-grade vinyls and inks quickly, so we specify UV-stable materials and premium printed films rated for years of direct sunlight. This is why two signs that look identical on day one can look completely different after a dry season.',
      'Humidity and coastal salt air are the second. Moisture attacks unprotected steel and cheap fixings, causing rust streaks and structural weakening. Aluminum composite panels, stainless or galvanized hardware, and properly sealed enclosures resist corrosion far better near the coast.',
      'Then there is harmattan dust, which abrades surfaces and coats illuminated faces. Smooth, sealed finishes clean easily and resist scratching, keeping signs bright and legible with simple maintenance.',
      'The takeaway is straightforward: match the material to the environment, not just the budget. Spending a little more on climate-appropriate materials up front almost always costs less than replacing a failed sign — and it keeps your brand looking sharp year-round.',
    ],
  },
  {
    id: '6',
    title: 'Color Psychology: How to Pick Brand Colors That Convert',
    slug: 'color-psychology-brand-colors',
    excerpt:
      'The colors you choose for your logo and signage trigger real emotional responses in customers. Here\'s how to choose them strategically.',
    publishedAt: new Date('2024-08-30'),
    author: 'Trust Quality Design',
    readTime: '5 min read',
    image: '/images/websitepics/T_Q_D_19.jpg',
    content: [
      'Color is the first thing a customer registers about your brand — before they read a word or process a shape. That first impression is emotional, immediate, and surprisingly consistent from person to person. Choosing color strategically is one of the highest-leverage branding decisions you can make.',
      'Different colors carry different associations. Red signals energy, urgency, and confidence, which is why it commands attention on signage and calls to action. Blue communicates trust and stability, a favorite of banks and professional services. Green suggests growth and freshness; black and gold read as premium and exclusive.',
      'But psychology is only half the story — contrast and legibility decide whether your sign actually works. A color scheme that looks elegant on a screen can be invisible from across the street. Strong contrast between text and background is what makes signage readable at a distance and at speed.',
      'Consistency multiplies the effect. When you use the same two or three brand colors everywhere — signage, packaging, uniforms, social media — customers begin to recognize you by color alone. That recognition is a real competitive advantage.',
      'Choose a small, deliberate palette: one dominant color, one supporting color, and a neutral. Test it in the real world, at real signage scale, before you commit. Color chosen with intent does more than decorate — it converts.',
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
