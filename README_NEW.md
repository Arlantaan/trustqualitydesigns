# Trust Quality Designs - Premium Digital Design Agency

A modern, high-performance website for a premium design agency built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, and **Python** backend support. 

Inspired by world-class design agencies like Siegel+Gale, but with a unique vision for Trust Quality Designs.

## 🎯 Features

### Frontend Architecture
- ✨ **Modern Responsive Design** - Mobile-first with Tailwind CSS
- 🎨 **Component Library** - Reusable, type-safe React components
- 🚀 **App Router** - Latest Next.js 15 with Server Components
- 📱 **Fully Responsive** - Desktop, tablet, and mobile optimized
- ✅ **TypeScript** - 100% type-safe codebase
- 🎬 **Smooth Animations** - Framer Motion for engaging interactions
- 🔍 **SEO Optimized** - Meta tags, structured data, sitemaps
- 🌙 **Accessibility** - WCAG 2.1 AA compliant

### Backend & Database
- 🗄️ **PostgreSQL** - Robust relational database with full-text search
- 🔐 **RESTful API** - Type-safe Next.js API routes
- 🐍 **Python Integration** - Advanced analytics with mypy type checking
- 📊 **Content Management** - Case studies, Team, Services, Blog
- 📧 **Form Handling** - Contact form with validation
- 🔒 **Security** - Environment-based configuration, input validation

### Deployment Ready
- 🚀 **Hetzner Cloud** - Optimized for cloud VPS hosting
- 📦 **Docker Support** - Containerization ready
- ⚡ **Performance** - Image optimization, lazy loading, caching
- 🔄 **CI/CD Ready** - Automated deployment scripts included

## 🛠 Tech Stack

```
Frontend:
├── Next.js 15.1.6 (React Framework)
├── React 19.2.3 (UI Library)
├── TypeScript 5 (Type Safety)
├── Tailwind CSS 4 (Styling)
├── Framer Motion (Animations)
└── Next Image (Optimization)

Backend:
├── Node.js (Runtime)
├── Next.js API Routes (Backend)
├── PostgreSQL 15+ (Database)
├── Python 3.x (Services)
└── Prisma ORM (Database Access)

Deployment:
├── Hetzner Cloud VPS
├── Docker & Docker Compose
└── Nginx (Reverse Proxy)
```

## 📦 Installation

### Prerequisites
```bash
Node.js 18+
npm or pnpm
PostgreSQL 15+
Python 3.9+ (optional)
```

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/tqd.git
cd tqd
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### Step 4: Database Setup
```bash
# Create database
createdb tqd_db

# Run schema
psql tqd_db < database/schema.sql

# Verify connection
npm run db:migrate
```

### Step 5: Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📁 Project Structure

```
tqd/
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   └── contact/
│   │   ├── layout.tsx         # Root Layout
│   │   ├── page.tsx           # Home Page
│   │   ├── work/              # Work/Portfolio Pages
│   │   └── globals.css        # Global Styles
│   ├── components/            # Reusable Components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── CaseStudyCard.tsx
│   │   └── index.ts
│   ├── lib/                   # Utilities
│   │   └── db.ts             # Database client
│   ├── types/                 # TypeScript Types
│   │   └── index.ts
│   └── utils/                 # Helper Functions
│       └── index.ts
├── database/
│   ├── schema.sql            # PostgreSQL Schema
│   └── migrations/           # DB Migrations
├── backend/                  # Python Services (Optional)
│   ├── config/
│   ├── models/
│   ├── services/
│   └── main.py
├── public/                   # Static Assets
│   ├── images/
│   ├── videos/
│   └── assets/
├── .env.example             # Environment Template
├── tailwind.config.js       # Tailwind Config
├── tsconfig.json           # TypeScript Config
├── next.config.ts         # Next.js Config
└── package.json           # Dependencies
```

## 🎨 Key Components

### Header Component
```tsx
<Header />
```
- Sticky header with smooth scroll behavior
- Responsive navigation menu
- Mobile hamburger menu
- CTA buttons

### Hero Section
```tsx
<Hero 
  title="Design Excellence"
  subtitle="Award-Winning Agency"
  cta={{ label: "Explore Work", href: "/work" }}
/>
```
- Full-screen intro
- Background video support
- Animated content
- Scroll indicator

### Case Study Grid
```tsx
<CaseStudyGrid 
  studies={caseStudies}
  featured={featuredStudy}
/>
```
- Responsive grid layout
- Video/Image showcase
- Hover effects
- Category badges

### Footer Component
```tsx
<Footer />
```
- Multi-column layout
- Social links
- Newsletter signup
- Legal links

## 🗄️ Database Schema

### Core Tables
- **case_studies** - Project portfolio
- **categories** - Classification system
- **services** - Service offerings
- **team_members** - Team profiles
- **blog_posts** - Blog articles
- **contact_forms** - Contact submissions

See [database/schema.sql](database/schema.sql) for complete details.

## 🔗 API Endpoints

### Case Studies
```
GET    /api/case-studies           # List all
GET    /api/case-studies?featured=true  # Featured projects
GET    /api/case-studies/:id       # Get by ID
POST   /api/case-studies           # Create (admin)
PUT    /api/case-studies/:id       # Update (admin)
DELETE /api/case-studies/:id       # Delete (admin)
```

### Contact
```
POST   /api/contact                # Submit contact form
```

### Blog
```
GET    /api/blog                   # List blog posts
GET    /api/blog/:slug             # Get by slug
GET    /api/blog?tag=design        # Filter by tag
```

## 🎨 Design System

### Colors
```
Primary (Blue):
  50: #f0f9ff    500: #0ea5e9    900: #0c3d66

Accent (Purple):
  50: #faf5ff    500: #a855f7    900: #581c87

Neutral (Gray):
  50: #f9fafb    500: #6b7280    900: #111827
```

### Typography
```
Display: Bold, large headings (sans-serif)
Body: Regular text (sans-serif)
Code: Monospace for technical content
```

### Spacing Scale
```
0.25rem (1px)
0.5rem (2px)
1rem (4px)
1.5rem (6px)
... up to 36rem
```

## ⚡ Performance Tips

- ✅ Use Next.js Image for all images
- ✅ Lazy load components with dynamic import
- ✅ Keep bundle size small
- ✅ Optimize database queries
- ✅ Cache static content
- ✅ Monitor Core Web Vitals

```bash
# Check bundle size
npm run build
npm run analyze  # with @next/bundle-analyzer
```

## 🚀 Deployment

### Hetzner Cloud VPS Deployment

1. **Create Server**
   ```bash
   # Choose: Ubuntu 22.04, Shared vCPU, 4GB RAM, 80GB NVMe
   ```

2. **SSH into Server**
   ```bash
   ssh root@your_ip
   ```

3. **Install Dependencies**
   ```bash
   apt update && apt upgrade -y
   apt install -y nodejs npm postgresql docker.io docker-compose
   ```

4. **Setup Database**
   ```bash
   sudo -u postgres createdb tqd_db
   psql tqd_db < database/schema.sql
   ```

5. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

6. **Setup SSL with Nginx**
   ```bash
   apt install -y nginx certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```

### Environment Variables on Server
```bash
cat > .env.production << EOF
DATABASE_URL=postgresql://user:pass@localhost:5432/tqd_db
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
EOF
```

## 🐍 Python Backend (Optional)

### Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
mypy . --strict  # Type checking
python main.py
```

### Example Service
```python
# backend/services/image_processor.py
from typing import Tuple

def resize_image(path: str, width: int, height: int) -> str:
    """Resize image while preserving aspect ratio."""
    # Implementation with mypy type checking
    return processed_path
```

## 🧪 Testing

```bash
# Run tests (when added)
npm run test

# Lint code
npm run lint

# Type check
npm run type-check
```

## 📊 SEO & Analytics

### Meta Tags
All pages include:
- Title tags
- Meta descriptions
- Open Graph tags
- Twitter Card tags
- Canonical URLs

### Sitemap
Auto-generated at `/sitemap.xml`

### Analytics Ready
Ready to integrate:
- Google Analytics
- Hotjar
- Segment

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ Input validation on forms
- ✅ SQL injection prevention (Parameterized queries)
- ✅ CSRF protection (Next.js built-in)
- ✅ XSS prevention (React auto-escaping)
- ✅ HTTPS only in production
- ✅ Security headers configured

## 📖 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Author

**Trust Quality Designs**
- Website: https://trustqualitydesigns.com
- Email: hello@trustqualitydesigns.com
- Twitter: [@trustqualitydesign](https://twitter.com/trustqualitydesign)

## 🙏 Acknowledgments

Inspired by:
- Siegel+Gale (design excellence)
- Next.js community
- Tailwind CSS ecosystem
- PostgreSQL community

---

**Built with ❤️ for design excellence**

*Last Updated: February 2026*
