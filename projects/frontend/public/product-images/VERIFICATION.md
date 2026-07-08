## Product Images Verified

### Current Status: NY Knicks Team Store

The product image set has been replaced with Knicks-branded SVG illustrations
and verified end-to-end against the running stack.

### Image Structure
```
/frontend/public/product-images/
├── air-jordan-1.svg     — Sneakers (AJ1, AJ4, AF1, Harden)
├── spalding-nba.svg     — Basketballs (Spalding NBA, Wilson, Streetball)
├── knicks-jersey.svg    — NY Knicks Statement Jersey
├── knicks-hoodie.svg    — Courtside + Jordan Dri-FIT Hoodies
├── knicks-tee.svg       — Association + Big Logo Tees
└── placeholder.svg      — Fallback
```

### API Integration
- Backend `routes/products.ts` CASE blocks return `/product-images/*.svg`
- `simple-product-service.js` `getImageForProduct()` maps names to the same paths
- Gateway `/api/products` returns the SVGs as `image_url` for all 12 products

### Browser Verification
- Frontend served at `http://localhost:3000`
- All SVGs load directly via `<img src="/product-images/...svg">` in nginx
- Theme color is Knicks blue `#006BB6`

### Replacing With Real Photography
1. Drop a JPG/PNG into this folder using the same filename (changing the
   extension to `.jpg` is fine; update the CASE blocks if you do).
2. Rebuild the frontend and restart the stack.