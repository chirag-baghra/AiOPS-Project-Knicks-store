# Product Images

This folder contains branded SVG product illustrations for the NY Knicks team store.

## Current Image Files

Each product is mapped to a category-themed illustration (orange + blue Knicks palette):

| File | Category | Used For |
|---|---|---|
| `air-jordan-1.svg` | Sneakers | Air Jordan 1, Air Jordan 4, Air Force 1, Adidas Harden |
| `spalding-nba.svg` | Basketballs | Spalding NBA, Wilson Evolution, Spalding Streetball |
| `knicks-jersey.svg` | Jerseys | NY Knicks Statement Jersey |
| `knicks-hoodie.svg` | Hoodies | NY Knicks Courtside, Jordan Dri-FIT Hoodie |
| `knicks-tee.svg` | T-Shirts | NY Knicks Association Tee, Big Logo Tee |
| `placeholder.svg` | Fallback | Any product without a specific mapping |

## Replacing With Real Photography

When you have licensed product photography, replace the matching `.svg` file with a
`.jpg`/`.png` of the same name, then update the `getImageForProduct()` function in
`simple-product-service.js` (and the `CASE` blocks in
`backend/services/product-service/src/routes/products.ts`) to point at the new file.

For the smoothest swap, keep the filenames identical and just change the file
extension/contents in this folder.

## Image Specs

- **Format**: SVG (vector) for the current set, JPG/PNG for production photography
- **Dimensions**: 600x600 (1:1) for product cards, 1200x1200 for detail zoom
- **Backgrounds**: Knicks blue (`#006BB6`), orange (`#F58426`), or light court gray (`#F4F6F8`)

## Adding New Products

1. Add the new product to the SQL seed (`database/init/20-init-schema.sql`) and to
   the mock catalog (`mock-product-service.js`).
2. Drop the new image into this folder.
3. Update the `getImageForProduct()` mapping in `simple-product-service.js` to
   include the new product's name match, and add a `WHEN p.name ILIKE '%...%'`
   line to the `CASE` block in `routes/products.ts`.
4. Rebuild the frontend (`cd frontend && npm run build`) and restart the stack
   (`docker compose up -d --build`).

## Placeholder

`placeholder.svg` is used as a fallback for any product without a specific image
mapping. Replace with a neutral "no image" photo for production.