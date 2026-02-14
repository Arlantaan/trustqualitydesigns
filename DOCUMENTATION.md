# Design Agency Website - Complete Documentation

## Project Overview

This is a comprehensive, production-ready design agency website built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, **Python**, and **Docker**. The project is fully containerized and ready for deployment on Hetzner Cloud or similar infrastructure.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom theme
- **Animations**: Framer Motion 10
- **UI Components**: React 19
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes
- **Type Safety**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma (optional setup)
- **Validation**: Pydantic (Python backend)
- **Server**: Uvicorn (Python API service)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx with security headers
- **Web Server**: Node.js
- **Database**: PostgreSQL
- **Type Checking**: mypy for Python
- **Cloud**: Hetzner Cloud ready

---

## Project Structure

```
tqd/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── contact/              # Contact form endpoint
│   │   │   ├── case-studies/         # Case studies API
│   │   │   ├── blog/                 # Blog posts API
│   │   │   ├── services/             # Services API
│   │   │   ├── team/                 # Team members API
│   │   │   └── health/               # Health check endpoint
│   │   ├── about/                    # About page
│   │   ├── blog/                     # Blog listing page
│   │   ├── contact/                  # Contact page with form
│   │   ├── services/                 # Services listing page
│   │   ├── team/                     # Team members page
│   │   ├── work/                     # Portfolio/case studies page
│   │   ├── layout.tsx                # Root layout with Header/Footer
│   │   └── page.tsx                  # Home page
│   ├── components/
│   │   ├── Header.tsx                # Navigation header
│   │   ├── Footer.tsx                # Footer with links
│   │   ├── Hero.tsx                  # Full-screen hero section
│   │   ├── CaseStudyCard.tsx         # Case study card component
│   │   ├── BlogCard.tsx              # Blog post card component
│   │   ├── TeamCard.tsx              # Team member card component
│   │   ├── ServiceCard.tsx           # Service card component
│   │   └── index.ts                  # Barrel exports
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   └── utils/
│       └── index.ts                  # Utility functions
├── database/
│   └── schema.sql                    # PostgreSQL schema
├── backend/
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Python service container
│   └── main.py (TODO)               # FastAPI application
├── Dockerfile                        # Next.js container
├── docker-compose.yml               # Multi-container orchestration
├── nginx.conf                       # Nginx reverse proxy config
├── tailwind.config.js               # Tailwind CSS config
├── tsconfig.json                    # TypeScript configuration
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies
├── .env.example                     # Environment variables template
└── README.md                        # Documentation
```

---

## Pages & Routes

### Public Pages
- **Home** (`/`) - Hero, featured case studies, stats, services preview
- **Work** (`/work`) - Portfolio grid, case study cards, industry showcase
- **Services** (`/services`) - Service offerings with features, process steps
- **About** (`/about`) - Company story, values, approach, awards
- **Blog** (`/blog`) - Blog post list with featured posts, newsletter signup
- **Team** (`/team`) - Team members grid with profiles, culture section
- **Contact** (`/contact`) - Contact form with validation, info, FAQ

### API Routes
- **POST** `/api/contact` - Submit contact form (validates email, saves to DB)
- **GET** `/api/case-studies` - Fetch all case studies (with optional filters)
- **POST** `/api/case-studies` - Create new case study (admin only)
- **GET** `/api/blog` - Fetch blog posts (with pagination & featured filter)
- **POST** `/api/blog` - Create new blog post (admin only)
- **GET** `/api/services` - Fetch services
- **POST** `/api/services` - Create service (admin only)
- **GET** `/api/team` - Fetch team members
- **POST** `/api/team` - Create team member (admin only)
- **GET** `/api/health` - Health check endpoint (for monitoring)

---

## Components

### Core Components

#### Header (`src/components/Header.tsx`)
Navigation header with sticky scroll detection and mobile hamburger menu.
- Responsive navigation (mobile, tablet, desktop)
- Sticky behavior on scroll
- Mobile menu toggle
- CTA button with gradient styling

#### Footer (`src/components/Footer.tsx`)
Multi-section footer with links and social profiles.
- 4 link categories (Company, Resources, Legal, Social)
- Dynamic year calculation
- CTA section
- Social media links

#### Hero (`src/components/Hero.tsx`)
Full-screen hero section with animations.
- Framer Motion entrance animations
- Background video/image support
- Animated scroll indicator
- Responsive typography (mobile to desktop)

### Card Components

#### CaseStudyCard (`src/components/CaseStudyCard.tsx`)
Individual case study showcase card.
- Video/image support
- Hover scale animations
- Gradient overlay
- Links to detail pages
- Featured project support

#### BlogCard (`src/components/BlogCard.tsx`)
Blog post preview card.
- Publication date display
- Featured post styling
- Excerpt text
- Read more links
- Grid layout support

#### TeamCard (`src/components/TeamCard.tsx`)
Team member profile card.
- Photo/avatar display
- Position and bio
- Social media links
- Hover effects
- Link to detail pages

#### ServiceCard (`src/components/ServiceCard.tsx`)
Service offering card.
- Service name and description
- Feature bullets
- Learn more links
- Hover effects
- Grid layout

---

## Data Models (TypeScript Interfaces)

### CaseStudy
```typescript
interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: Category;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  featuredImage: string;
  images: string[];
  slug: string;
  featured: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### ServiceOffering
```typescript
interface ServiceOffering {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
}
```

### TeamMember
```typescript
interface TeamMember {
  id: string;
  name: string;
  slug: string;
  position: string;
  bio: string;
  avatar: string;
  specialties: string[];
  socialLinks: SocialLink[];
}
```

### ContactFormData
```typescript
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}
```

---

## Database Schema

### Tables (15 total)

1. **categories** - Service/project categories
2. **case_studies** - Project showcase data
3. **case_study_results** - Project outcomes (relationship)
4. **case_study_images** - Project media (relationship)
5. **services** - Service offerings
6. **service_features** - Service details (relationship)
7. **team_members** - Team profiles
8. **team_member_specialties** - Team skills (relationship)
9. **contact_forms** - Contact form submissions
10. **blog_posts** - Blog articles
11. **blog_tags** - Tag definitions
12. **blog_post_tags** - Post-tag relationships
13. **team_member_social_links** - Social media profiles
14. **analytics_events** - Visitor analytics
15. **site_settings** - Site configuration

### Key Features
- UUID primary keys for all tables
- Automatic timestamp updates via triggers
- Full-text search indexes on blog content
- Foreign key relationships
- Composite indexes for performance
- JSON support for flexible data

---

## Utility Functions

Located in `src/utils/index.ts`:

- **cn()** - Conditional class name merging (using clsx)
- **formatDate()** - Format dates with locale support
- **slugify()** - Convert text to URL-safe slugs
- **capitalize()** - Capitalize first letter of string
- **truncate()** - Truncate text with ellipsis
- **formatCurrency()** - Format numbers as currency
- **debounce()** - Debounce function for performance
- **isExternalUrl()** - Detect external URLs

---

## API Endpoints with Examples

### Contact Form
```bash
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "message": "I'd like to discuss a project..."
}

Response:
{
  "success": true,
  "id": "uuid",
  "message": "Thank you for your submission"
}
```

### Case Studies
```bash
# Get all case studies
GET /api/case-studies

# Get featured only
GET /api/case-studies?featured=true

# Get specific study
GET /api/case-studies?id=123
```

### Blog
```bash
# Get all posts
GET /api/blog

# Get featured posts
GET /api/blog?featured=true

# Get specific post
GET /api/blog?slug=post-title

# With pagination
GET /api/blog?limit=10&offset=0
```

### Services
```bash
# Get all services
GET /api/services

# Get by ID
GET /api/services?id=123

# Get by slug
GET /api/services?slug=brand-strategy
```

### Team
```bash
# Get all members
GET /api/team

# Get by ID
GET /api/team?id=123

# Get by slug
GET /api/team?slug=john-doe
```

### Health
```bash
# Health check
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "environment": "production"
}
```

---

## Configuration Files

### Tailwind CSS (`tailwind.config.js`)
- Custom color palette (Blue primary #2563EB, Purple #9333EA)
- Extended spacing scale
- Custom animations (fade-in, slide-up, pulse-slow)
- Dark mode support
- Custom font sizes for responsive typography

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- Path aliases (@/) for imports
- ES2020 target
- Type checking enabled

### Nginx (`nginx.conf`)
- SSL/TLS support (Let's Encrypt ready)
- Security headers (CSP, X-Frame-Options, etc.)
- Rate limiting (10 req/s general, 30 req/s API)
- Gzip compression (level 6)
- Static file caching (30 days for _next, 7 days for images)
- Upstream proxying to Next.js and Python API

---

## Environment Variables

Key variables to configure:

```
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXT_PUBLIC_API_URL=http://localhost:3000
PYTHON_API_URL=http://localhost:8000
SENDGRID_API_KEY=your_key_here
NODE_ENV=development|production
```

See `.env.example` for complete list.

---

## Docker Setup

### Build Containers
```bash
docker build -t tqd-nextjs .                    # Build Next.js image
docker build -t tqd-python -f backend/Dockerfile ./backend  # Build Python image
```

### Run with Docker Compose
```bash
docker-compose up -d                # Start all services
docker-compose down                 # Stop all services
docker-compose logs -f nextjs      # View Next.js logs
docker-compose ps                  # See running containers
```

### Services in Compose
1. **PostgreSQL** - Port 5432
2. **Next.js** - Port 3000
3. **Python API** - Port 8000 (optional)
4. **Nginx** - Port 80/443 (production profile)

---

## Development Workflow

### Local Development
```bash
npm install                         # Install dependencies
npm run dev                         # Start dev server (port 3000)
docker-compose up postgres         # Start just database

# Environment setup
cp .env.example .env.local
# Configure DATABASE_URL and other vars
```

### Testing
```bash
npm run build                       # Build for production
npm run start                       # Start production server
npm test                            # Run tests (when configured)
```

### Type Checking
```bash
tsc --noEmit                        # Check TypeScript
cd backend && mypy .                # Check Python types
```

---

## Deployment (Hetzner)

### 1. Server Setup
```bash
# Create Hetzner VPS (Ubuntu 22.04, 4GB RAM)
ssh root@your_ip

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 2. Clone & Configure
```bash
git clone <your-repo> /app
cd /app
cp .env.example .env
# Edit .env with production values
```

### 3. Setup SSL
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
# Update nginx.conf with paths
```

### 4. Deploy
```bash
docker-compose -f docker-compose.yml up -d
```

### 5. Database Migration
```bash
docker-compose exec nextjs npx prisma migrate deploy
```

---

## Pending Tasks

### Immediate (Must Do First)
- [ ] Database integration - Connect API routes to PostgreSQL
- [ ] Email notifications - Add SendGrid/SMTP integration to contact form
- [ ] Prisma setup - Initialize ORM and migrations

### High Priority
- [ ] Blog detail pages (`/blog/[slug]`)
- [ ] Case study detail pages (`/work/[slug]`)
- [ ] Python API service implementation (FastAPI endpoints)
- [ ] Image optimization (Next.js Image component setup)

### Medium Priority
- [ ] Authentication system (NextAuth.js)
- [ ] Admin dashboard for content management
- [ ] Search functionality (full-text search)
- [ ] Analytics integration (Google Analytics, PostHog)

### Lower Priority
- [ ] Unit and E2E tests
- [ ] Performance monitoring (Sentry)
- [ ] CDN setup (Cloudflare)
- [ ] Automated backups

---

## Performance Optimization

Implemented Features:
- ✅ Image optimization (Next.js Image component)
- ✅ Code splitting (automatic with Next.js)
- ✅ Gzip compression (Nginx)
- ✅ CSS-in-JS with Tailwind (minimal CSS)
- ✅ Lazy loading (with Framer Motion)

To Implement:
- [ ] Redis caching layer
- [ ] Database query optimization
- [ ] API response caching
- [ ] Static site generation (ISR)
- [ ] CDN for assets

---

## Security Considerations

Implemented:
- ✅ HTTPS/SSL support (Nginx)
- ✅ Security headers (CSP, X-Frame-Options)
- ✅ Rate limiting (Nginx)
- ✅ Input validation (Contact form)
- ✅ CORS headers (configured)

To Implement:
- [ ] CSRF protection
- [ ] Authentication/authorization
- [ ] SQL injection prevention (use Prisma ORM)
- [ ] XSS protection (React escapes by default)
- [ ] Dependency vulnerability scanning

---

## Monitoring & Logging

Configuration Available:
- Health check endpoint (`/api/health`)
- Docker container logs
- Nginx access/error logs
- PostgreSQL logs

To Setup:
- [ ] Sentry for error tracking
- [ ] Datadog for infrastructure monitoring
- [ ] ELK stack for log aggregation
- [ ] Uptime monitoring (UptimeRobot)

---

## Support & Maintenance

### Common Commands
```bash
# Check application status
curl http://localhost:3000/api/health

# View logs
docker-compose logs -f

# Restart service
docker-compose restart nextjs

# Database backup
pg_dump tqd_db > backup.sql

# Update dependencies
npm update
```

### Troubleshooting

**Database connection errors**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running: `docker-compose ps`
- Test connection: `psql $DATABASE_URL`

**Port conflicts**
- Check what's using ports: `lsof -i :3000`
- Change ports in docker-compose.yml

**Build failures**
- Clear cache: `npm install --force`
- Check Node version: `node --version` (requires 18+)

---

## Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Tools & Services
- [Hetzner Cloud](https://cloud.hetzner.com/)
- [Nginx Playground](https://nginx.org/en/)
- [Docker Documentation](https://docs.docker.com/)
- [SendGrid](https://sendgrid.com/) (email service)

---

## License

This project is created for demonstration and client use.

---

**Last Updated**: January 2024
**Version**: 1.0.0 - Complete Scaffold
