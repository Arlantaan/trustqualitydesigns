# Changelog

All notable changes to Trust Quality Designs website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-14

### ✨ Added
- Initial Next.js 15 application with App Router
- Dark red theme (gray-950 → red-950 → black gradients)
- Responsive navigation with morphing blob mobile menu
- Hero section with CTA buttons
- Services page with 6 service categories:
  - Brand Identity Design
  - Channel Letter Signs
  - Monument Signs
  - Wayfinding Systems
  - Vehicle Wraps & Graphics
  - Interior Signage
- Portfolio/case studies page with 2 showcase projects
- Team member profiles page
- Contact form with email validation
- Blog listing page
- About page with company story
- SEO optimization (meta tags, Open Graph, Twitter Cards)
- Mobile features:
  - Gyroscope tilt effects on images (iOS + Android)
  - Shake-to-click functionality with toggle button
  - Device motion detection with permission handling
  - Haptic feedback integration
- Interactive animations:
  - Framer Motion transitions
  - Magnetic cursor effect
  - Particle network background
  - Liquid blob animations
- Professional Unsplash images for case studies and team
- API routes for dynamic content
- Type-safe TypeScript throughout

### 🚀 Deployment
- Deployed to Hetzner VPS (46.225.69.136)
- Ubuntu 24.04 LTS server configuration
- Node.js 20.20.0 runtime
- PM2 6.0.14 process management
- Nginx 1.24.0 reverse proxy
- UFW firewall configuration
- Deployment scripts:
  - PowerShell script for Windows
  - Bash scripts for Linux/Mac
  - Automated deployment pipeline

### 📝 Documentation
- Comprehensive README.md with project overview
- DEPLOYMENT_SUMMARY.md with full deployment details
- GITHUB_SETUP.md with version control guide
- Deployment scripts with inline documentation
- Code comments and TypeScript types

### 🔧 Technical
- Next.js 15.1.6 with React 19.0.0
- Tailwind CSS 3.4.17 for styling
- Framer Motion 11.15.0 for animations
- TypeScript for type safety
- ESLint for code quality
- PostCSS for CSS processing

### 🎨 Design
- Custom color scheme (red-400, red-300, red-200 accents)
- Dark glassmorphism card designs
- Transparent outlined buttons
- Smooth transitions and hover effects
- Mobile-first responsive design
- Accessibility considerations

### 🐛 Fixed
- Mobile menu z-index overlap issue
- Button alignment in hero section
- Removed bouncing animations
- Fixed build errors with Tailwind CSS
- Resolved PM2 restart issues on deployment

### 🔒 Security
- UFW firewall enabled
- Root password changed
- Ports restricted (SSH, HTTP, HTTPS only)
- Environment variables separated
- .gitignore configured for sensitive files

---

## [Unreleased]

### 🔮 Planned
- SSL certificate (Let's Encrypt)
- Custom domain configuration
- GitHub Actions CI/CD pipeline
- Automated backup system
- Contact form backend integration
- Blog post functionality
- Admin dashboard for content management
- Performance monitoring
- Error tracking (Sentry)
- Analytics integration (Google Analytics)

### 🎯 Future Enhancements
- CMS integration (Sanity/Contentful)
- Image optimization improvements
- Progressive Web App (PWA) features
- Multi-language support
- Dark/Light theme toggle
- More interactive animations
- Client testimonials section
- Project filtering and search
- Newsletter subscription
- Social media integration

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-02-14 | Initial production deployment |

---

## Contributors

- Development Team: Trust Quality Designs
- Deployment: GitHub Copilot
- Repository: https://github.com/arlantaan/trustqualitydesigns

---

**Last Updated:** February 14, 2026
