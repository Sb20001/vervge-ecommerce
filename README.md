# Verve — Full-Stack Ecommerce Platform

A complete, production-style ecommerce platform featuring a customer storefront, shopping
cart, checkout flow, order history, JWT authentication, and an admin dashboard for managing
products and orders.

## Stack

**Frontend:** React.js, Vite, Redux Toolkit, Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express, JWT authentication, bcrypt password hashing

## Project structure

```
ecommerce-project/
├── backend/           Express REST API
│   ├── src/
│   │   ├── routes/    auth.js, products.js, orders.js
│   │   ├── middleware/auth.js   (JWT verify + role guard)
│   │   ├── db.js      lowdb JSON datastore
│   │   ├── seed.js    seeds demo products + admin account
│   │   └── server.js
│   └── data/db.json   the database file (created on first run)
└── frontend/           React app
    └── src/
        ├── app/store.js          Redux store
        ├── features/              auth, cart, products, orders slices
        ├── pages/                 Home, Shop, ProductDetail, Cart, Login,
        │                          Register, Checkout, OrderConfirmation,
        │                          MyOrders, Admin
        └── components/            Navbar, ProductCard
```

## Running it locally

Requires Node.js 18+.

### 1. Backend

```bash
cd backend
npm install
npm run seed     # populates data/db.json with 8 products + an admin account
npm run dev       # starts on http://localhost:4000
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

Open **http://localhost:5173**.

### Demo accounts

- **Admin:** `admin@verve.shop` / `admin123` — visit `/admin` to add/edit/delete products
  and update order status.
- Or register a new customer account from the UI to browse, add to cart, and check out.

## What's implemented

**Auth**
- Register / login with hashed passwords (bcrypt) and JWT tokens (7-day expiry)
- Role-based access: `customer` vs `admin`

**Storefront**
- Product grid with category filter, text search, and price/newest sorting
- Product detail page with quantity selector and add-to-cart
- Persistent cart (survives refresh, stored client-side)
- Checkout with shipping address, order total calculation, stock validation
- Order confirmation and full order history per user

**Admin dashboard** (`/admin`, admin-only)
- Create, edit, delete products
- View all orders and update their status (confirmed → processing → shipped → delivered)

**API** (all endpoints under `/api`)
| Method | Route | Auth |
|---|---|---|
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| GET | `/products` | — |
| GET | `/products/:id` | — |
| POST | `/products` | admin |
| PUT | `/products/:id` | admin |
| DELETE | `/products/:id` | admin |
| POST | `/orders` | customer |
| GET | `/orders/my` | customer |
| GET | `/orders` | admin |
| PUT | `/orders/:id/status` | admin |

## Roadmap

- **MongoDB:** swap the JSON datastore for Mongoose models.
- **Redis:** cache verified JWT payloads / session state with a TTL.
- **Cloudinary:** accept image uploads and store secure URLs on products.

## Environment variables

`backend/.env` (optional, defaults shown):
```
PORT=4000
JWT_SECRET=verve-dev-secret-change-in-production
```

`frontend/.env`:
```
VITE_API_URL=http://localhost:4000/api
```
