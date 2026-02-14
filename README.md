# Trust Quality Designs - Branding & Signage Website

Modern Next.js website for Trust Quality Designs, a branding and signage construction company. Features dark red theme, interactive mobile features (gyroscope tilt effects and shake-to-click), and professional portfolio presentation.

## 🎯 Project Overview

**Live Demo:** http://46.225.69.136  
**Repository:** https://github.com/arlantaan/trustqualitydesigns  
**Framework:** Next.js 15.1.6 with React 19.0.0  
**Styling:** Tailwind CSS 3.4.17  
**Animation:** Framer Motion 11.15.0  

## 🚀 Features

- **Dark Red Theme**: Professional gradient backgrounds (gray-950 → red-950 → black)
- **Mobile Interactions**:
  - Gyroscope tilt effects on images (case studies, team photos)
  - Shake-to-click functionality with toggle button
  - Device motion detection with iOS permission handling
- **Responsive Design**: Mobile-first, optimized for all devices
- **Animated UI**: Smooth transitions, morphing blob menu, magnetic cursor
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards
- **Performance**: Static generation, optimized images via Unsplash

## 📁 Project Structure

```
tqd/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage with hero
│   │   ├── about/             # About page
│   │   ├── services/          # Services showcase
│   │   ├── work/              # Portfolio/case studies
│   │   ├── team/              # Team members
│   │   ├── contact/           # Contact form
│   │   ├── blog/              # Blog listing
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── Header.tsx         # Morphing blob navigation
│   │   ├── Hero.tsx           # Homepage hero section
│   │   ├── Footer.tsx         # Site footer
│   │   ├── ServiceCard.tsx    # Service display cards
│   │   ├── CaseStudyCard.tsx  # Portfolio cards with gyroscope
│   │   ├── TeamCard.tsx       # Team member cards with gyroscope
│   │   ├── BlogCard.tsx       # Blog post cards
│   │   ├── GyroscopeTilt.tsx  # Device orientation parallax
│   │   └── ShakeToClick.tsx   # Shake gesture interaction
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── deployment/                # Deployment scripts & docs
└── docker-compose.yml         # Docker configuration
```

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1.6 | React framework, App Router |
| React | 19.0.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4.17 | Utility-first styling |
| Framer Motion | 11.15.0 | Animations |
| Device Motion API | Native | Gyroscope/accelerometer |

## 💻 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/arlantaan/trustqualitydesigns.git
cd trustqualitydesigns

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

### Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Production Server
- **IP:** 46.225.69.136
- **OS:** Ubuntu 24.04 LTS
- **Node.js:** 20.20.0
- **Process Manager:** PM2 6.0.14
- **Web Server:** Nginx 1.24.0

### Deploy to Production

```powershell
# From your local Windows machine:
.\deployment\quick-deploy.ps1
```

Or manually:
```bash
# Build locally
npm run build

# Create archive
tar -czf tqd-deploy.tar.gz --exclude=node_modules --exclude=.git .

# Upload to server
scp tqd-deploy.tar.gz root@46.225.69.136:/tmp/

# SSH to server
ssh root@46.225.69.136

# Deploy
cd /var/www/tqd
tar -xzf /tmp/tqd-deploy.tar.gz
npm install
npm run build
pm2 restart tqd-website
```

### Server Management

```bash
# Check application status
pm2 status

# View logs
pm2 logs tqd-website

# Restart application
pm2 restart tqd-website

# Monitor resources
pm2 monit

# Check Nginx
systemctl status nginx
nginx -t
```

## 🎨 Design System

### Colors
```css
/* Backgrounds */
--bg-dark: #030712         /* gray-950 */
--bg-red: #450a0a          /* red-950 */
--bg-black: #000000

/* Accents */
--accent-red: #f87171      /* red-400 */
--accent-light: #fca5a5    /* red-300 */
--accent-lighter: #fecaca  /* red-200 */

/* Text */
--text-primary: #ffffff
--text-secondary: #d1d5db  /* gray-300 */
```

### Component Design
- **Cards**: Dark glassmorphism (red-900/40 to red-950/40 with backdrop-blur)
- **Buttons**: Transparent outlined (border-2 border-white) with hover effects
- **Forms**: Dark inputs (gray-900/50 background, red-800/30 borders)
- **Navigation**: Fixed header with scroll effects, morphing blob mobile menu

## 📱 Mobile Features

### Gyroscope Tilt
Detects device orientation and applies parallax effect to images.

**Usage:**
```tsx
import { GyroscopeTilt } from '@/components';

<GyroscopeTilt intensity={20}>
  <img src="image.jpg" alt="Tilting image" />
</GyroscopeTilt>
```

**Props:**
- `intensity` (number): Tilt strength (default: 15)
- `className` (string): Additional CSS classes

### Shake to Click
Detects phone shaking and clicks elements at screen center.

**Features:**
- Floating toggle button (bottom-right)
- Visual feedback (animated finger icon)
- Haptic feedback (vibration)
- 25 acceleration threshold
- 500ms cooldown between detections

**Note:** Both features auto-detect device compatibility and hide on desktop.

## 🔐 Security

### Server Security Checklist
- [x] Firewall enabled (UFW)
- [x] SSH access secured
- [x] Root password changed
- [ ] SSH key authentication (recommended)
- [ ] Fail2ban configured
- [ ] Regular updates scheduled
- [ ] Non-root user for deployment (recommended)

## 📊 Performance

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

### Optimizations
- Static page generation
- Image optimization via Next.js Image
- Code splitting
- CSS purging via Tailwind
- Gzip compression via Nginx

## 🧪 Testing

### Test on Mobile
1. Deploy to server
2. Open http://46.225.69.136 on phone
3. Test gyroscope tilt (tilt phone)
4. Test shake-to-click:
   - Tap floating button to enable
   - Shake phone near interactive elements
   - Should click and provide haptic feedback

### iOS Testing
- First visit prompts for motion permission
- Must allow for features to work

## 🔄 GitHub Workflow

### Initial Setup
```bash
# Initialize git (if not done)
git init

# Add remote
git remote add origin https://github.com/arlantaan/trustqualitydesigns.git

# Create .gitignore (already exists)

# Initial commit
git add .
git commit -m "Initial commit: Trust Quality Designs website"

# Push to GitHub
git push -u origin main
```

### Development Flow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# After review, merge to main

# Pull latest changes
git checkout main
git pull origin main

# Deploy to production
.\deployment\quick-deploy.ps1
```

## 📝 Environment Variables

Create `.env.local` for local development:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Production (on server):
```env
NEXT_PUBLIC_SITE_URL=http://46.225.69.136
NODE_ENV=production
```

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### 502 Bad Gateway
```bash
# Check PM2 status
pm2 status

# Restart app
pm2 restart tqd-website

# Check logs
pm2 logs tqd-website
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Gyroscope Not Working
- Enable motion sensors in browser settings
- On iOS: Allow motion permission when prompted
- Check console for permission errors

## 📞 Support

For issues or questions:
1. Check [deployment/DEPLOYMENT.md](deployment/DEPLOYMENT.md)
2. Review server logs: `pm2 logs tqd-website`
3. Check Nginx logs: `tail -f /var/log/nginx/error.log`

## 📄 License

Proprietary - All rights reserved Trust Quality Designs

## 👥 Team

**Development:** Trust Quality Designs Development Team  
**Deployment:** Hetzner VPS (46.225.69.136)  
**Repository:** https://github.com/arlantaan/trustqualitydesigns

---

**Last Updated:** February 14, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
