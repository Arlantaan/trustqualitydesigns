# Client Logos

This folder contains client and partner logos that appear in the moving logo marquee on the homepage.

## Adding Logos

1. Place your logo images in this folder
2. Recommended format: PNG with transparent background
3. Recommended size: 400x200px (width x height)
4. Name your files sequentially: `logo1.png`, `logo2.png`, `logo3.png`, etc.

## Supported Formats

- PNG (recommended for transparency)
- JPG
- SVG
- WebP

## Tips

- Use transparent backgrounds for best results
- Logos will be displayed in grayscale until hovered
- Keep aspect ratios around 2:1 (width:height)
- Optimize images for web (compress before uploading)

## Updating the Logo List

The logo list is defined in `/src/components/LogoMarquee.tsx`. Update the `logos` array with your actual logo paths:

```tsx
logos = [
  '/images/logos/logo1.png',
  '/images/logos/logo2.png',
  '/images/logos/logo3.png',
  // Add more logos here
]
```
