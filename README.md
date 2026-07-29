# Verve — Full-Stack Ecommerce Platform

A complete, working implementation of the Ecommerce Platform project from your resume:
customer storefront, cart, checkout, order history, JWT authentication, and an admin
dashboard for managing products and orders.

## Stack

**Frontend:** React.js, Vite, Redux Toolkit, Tailwind CSS, React Router, Axios
**Backend:** Node.js, Express, JWT authentication, bcrypt password hashing

> **A note on the backend datastore:** your resume lists Spring Boot + MongoDB + Redis +
> Cloudinary. This sandbox environment can't run a standalone Java/Maven toolchain or spin
> up MongoDB/Redis server processes, so the backend here is Express with the **same REST
> API shape and JWT auth design**, backed by an embedded JSON file database (via `lowdb`)
> instead of MongoDB. Everything — auth, product CRUD, cart, checkout, orders, admin — is
> fully functional end to end. See "Upgrading to MongoDB + Redis" below for how to swap
> the datastore back in for a production deployment that matches your resume exactly.

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
│   └── data/db.json   the "database" file (created on first run)
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

## Upgrading to MongoDB + Redis (matching your resume's stack exactly)

The API layer is already structured so this is a swap, not a rewrite:

1. **MongoDB:** replace `backend/src/db.js` with a Mongoose connection, and turn
   `db.data.products` / `.users` / `.orders` into Mongoose models (`Product`, `User`,
   `Order`). The route handlers in `routes/*.js` only touch `db.data.<collection>` as
   arrays — swap those lines for `Model.find()`, `Model.create()`, etc.
2. **Redis:** add `ioredis`, and in `middleware/auth.js` cache verified JWT payloads (or
   session/cart state) with a TTL, invalidating on logout.
3. **Cloudinary:** add the `cloudinary` SDK, accept `multipart/form-data` uploads on
   `POST /products` via `multer`, and store the returned secure URL in the `image` field
   (already a plain string field, so no schema change needed).
4. **Spring Boot:** if you want the backend itself in Java to match the resume word-for-
   word, the REST contract above (routes, request/response shapes, JWT claims) is the
   spec to re-implement — the frontend won't need to change at all since it only talks to
   `/api/*`.

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
