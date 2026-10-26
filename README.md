# Project name
Bazar Dor Website Project

# Description
This is a responsive Bengali-language market-price dashboard for everyday products in Bangladesh. Users can compare essential-product prices, see which products are rising or falling, browse by category, and view product prices across markets. Protected product details and profile updates use Better Auth.

## Technologies used
**Next.js App Router** — routing, API handlers, dynamic routes, and server-side protection
- **React 19 + TypeScript** — reusable, typed UI components
- **Tailwind CSS v4 + custom CSS** — responsive styling and design tokens
- **Better Auth** — email/password authentication, Google and GitHub OAuth, user-profile updates
- **MongoDB** — Better Auth persistence
- **react-hot-toast** — success, validation, authentication, and error notifications

## Main features

1. **Bengali price ticker** with product emoji, price, and daily percentage movement.
2. **Market overview hero** with a same-page “সব পণ্যের দাম দেখুন” anchor.
3. **Price movers** showing the top six increases and decreases.
4. **Responsive product grid** with Bengali prices, units, category tags, and direction badges.
5. **Category pages** with skeleton loading states and numeric low-to-high / high-to-low sorting.
6. **Protected product-detail pages** with minimum, maximum, average, and market-wise prices.
7. **Email/password authentication and social sign-in** with Better Auth, Google, and GitHub.
8. **Profile and update-information pages**, implemented with Better Auth's `updateUser` client method.