# Alchemy Oliver - Version 2

## What's New in V2

This is a complete redesign based on your sister's feedback:

### Key Changes:
1. **Logo**: Uses the glitchy "alchemy_oliver" PNG logo in the nav
2. **Single Font**: Space Mono used consistently throughout
3. **Hoverable Portfolio Menu**: Inspired by vaquettelouis.xyz - hover over project titles to see images in center
4. **One-Page Scroll**: Continuous scrolling experience like sasha.miami
5. **Contact Strip**: Always-visible contact info (name, email, Instagram) in top right
6. **Slim Navigation**: Narrower nav bar (60px height)
7. **Cobalt Blue Accent**: #0047AB used for all links, menus, and highlights

### Sections:
- **Hero**: Opening statement with scanography description
- **Portfolio**: 10 hoverable project titles with center image display
- **About**: Artist statement with poetry
- **Store**: Ordering information
- **Footer**: Simple copyright

## Setup Instructions

Same as V1:

1. Make sure Node.js is installed
2. Navigate to this folder in Terminal
3. Run `npm install`
4. Run `npm run dev`
5. Open the URL shown in Terminal (probably http://localhost:5173 or 5174)

## Adding Real Images

### For Portfolio Projects:

1. Put 10 print images in the `public` folder
2. Name them something like: `print-01.jpg`, `print-02.jpg`, etc.
3. In `src/App.jsx`, update the `projects` array:

```javascript
const projects = [
  { id: 1, title: 'petals leaning into a fence', image: '/print-01.jpg' },
  { id: 2, title: 'another fragment', image: '/print-02.jpg' },
  // etc...
];
```

### For the Logo:

The logo is already set up at `/public/logo.png` (your chem_logo.png file)

## Customization

### Colors:
Edit in `src/App.css`:
```css
:root {
  --cobalt-blue: #0047AB;  /* Main accent color */
}
```

### Project Titles:
Edit the `projects` array in `src/App.jsx`

### Text Content:
All text is directly in `src/App.jsx` - search for the section and edit

## How the Portfolio Works

When you hover over a project title in the left menu:
1. The project becomes "active" (gets blue underline)
2. The corresponding image appears in the center display
3. The scan line animation plays over the image
4. Click the title to go to a detail page (not built yet - next step)

## Next Steps

Once the 10 images are added, we can build:
1. Individual product pages for each print
2. Add to cart functionality
3. Checkout integration
4. Size/framing option selectors
5. Price display

## Deploying

Same process as V1 - use Vercel or Netlify for free hosting.

---

Built for Alchemy Oliver with love ✨
