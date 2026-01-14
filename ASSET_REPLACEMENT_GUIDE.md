# Asset Replacement Guide

This guide will help you replace the placeholder assets (logo and fonts) with the actual Plural brand assets.

## 🎨 Replacing the Logo

### Current State
The application currently uses a placeholder logo (letter "P" in a blue circle).

### Steps to Replace

1. **Prepare your logo file**
   - Recommended format: SVG (for scalability) or PNG (with transparent background)
   - Recommended size: At least 128x128px
   - File name: `plural-logo.svg` or `plural-logo.png`

2. **Add the logo file**
   - Place the logo file in the `public/` directory
   - Path: `public/plural-logo.svg`

3. **Update the Header component**
   - Open: `components/Header.tsx`
   - Find lines 26-30 (the placeholder logo)
   - Replace with:

```tsx
import Image from "next/image";

// In the component:
<div className="flex items-center gap-2">
  <Image 
    src="/plural-logo.svg" 
    alt="Plural" 
    width={32} 
    height={32}
    className="object-contain"
  />
  <span className="text-xl font-bold text-primary">Plural</span>
</div>
```

4. **Optional: Remove the text if logo includes it**
   - If your logo already includes the "Plural" text, you can remove the `<span>` element

## 🔤 Adding Gilroy Fonts

### Current State
The application is configured to use Gilroy fonts but currently falls back to system fonts.

### Steps to Add Fonts

1. **Prepare your font files**
   - You need 4 font files in WOFF2 format:
     - `Gilroy-Regular.woff2` (weight: 400)
     - `Gilroy-Medium.woff2` (weight: 500)
     - `Gilroy-SemiBold.woff2` (weight: 600)
     - `Gilroy-Bold.woff2` (weight: 700)

2. **Convert fonts if needed**
   - If you have TTF or OTF files, convert them to WOFF2 using:
     - Online: https://cloudconvert.com/ttf-to-woff2
     - Or use a font conversion tool

3. **Add font files to the project**
   - Place all 4 files in: `app/fonts/`
   - The directory already exists with a `.gitkeep` file

4. **Update the layout file**
   - Open: `app/layout.tsx`
   - Replace the current font configuration (lines 1-6) with:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gilroy = localFont({
  src: [
    {
      path: "./fonts/Gilroy-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Gilroy-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Gilroy-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Gilroy-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
});
```

5. **Update the body className**
   - In the same file, find line 20
   - Replace:
```tsx
<body className="antialiased font-sans">{children}</body>
```
   - With:
```tsx
<body className={`${gilroy.variable} antialiased font-sans`}>{children}</body>
```

6. **Verify the font is working**
   - Restart the dev server: `npm run dev`
   - Open the browser and inspect any text element
   - The computed font should show "Gilroy" instead of system fonts

## 🧪 Testing After Replacement

### Logo Testing
1. Check that the logo appears in the header
2. Verify it's properly sized and aligned
3. Test on different screen sizes
4. Ensure it looks sharp on retina displays

### Font Testing
1. Inspect text elements in browser DevTools
2. Verify "Gilroy" appears in the computed font family
3. Check that different font weights are loading:
   - Regular (400): Body text
   - Medium (500): Some headings
   - SemiBold (600): Buttons, labels
   - Bold (700): Main headings
4. Test on different browsers

## 🔍 Troubleshooting

### Logo Issues

**Logo not appearing:**
- Check the file path is correct
- Verify the file is in the `public/` directory
- Check browser console for errors
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

**Logo looks blurry:**
- Use SVG format for best quality
- Or use PNG with 2x or 3x resolution
- Adjust the `width` and `height` props

### Font Issues

**Fonts not loading:**
- Verify all 4 font files are in `app/fonts/`
- Check file names match exactly (case-sensitive)
- Ensure files are in WOFF2 format
- Restart the dev server
- Clear browser cache

**Wrong font weight:**
- Check the weight values in the font configuration
- Verify the font files themselves have the correct weights
- Use browser DevTools to inspect computed styles

## 📝 Quick Checklist

- [ ] Logo file added to `public/` directory
- [ ] Header component updated with Image component
- [ ] Logo displays correctly in browser
- [ ] All 4 Gilroy font files added to `app/fonts/`
- [ ] Layout file updated with font configuration
- [ ] Body className updated with font variable
- [ ] Dev server restarted
- [ ] Fonts loading correctly in browser
- [ ] All font weights working properly
- [ ] Tested on multiple browsers

## 🎉 Done!

Once you've completed these steps, your Plural Health Dashboard will have:
- ✅ The official Plural logo
- ✅ Gilroy fonts throughout the application
- ✅ A polished, professional appearance

If you encounter any issues, refer to the troubleshooting section or check the Next.js documentation for font and image optimization.

