# Sisimwo Estate — Node.js Backend

Express + MongoDB backend for the Sisimwo Estate website.

---

## Project Structure

```
sisimwo-backend/
├── server.js              ← Entry point
├── seed.js                ← One-time DB seed script
├── FRONTEND_PATCH.js      ← Two functions to drop into index.html
├── .env.example           ← Copy to .env and fill in your values
├── models/
│   ├── Product.js         ← Product catalogue
│   ├── Order.js           ← Customer orders
│   └── Comment.js         ← Visitor reviews
├── routes/
│   ├── products.js        ← GET /api/products
│   ├── orders.js          ← POST /api/orders  · GET /api/orders
│   └── comments.js        ← GET /api/comments · POST /api/comments
└── utils/
    └── mailer.js          ← Nodemailer (order confirmation + admin alerts)
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI, SMTP credentials and admin email
```

### 3. Seed the database (run once)
```bash
node seed.js
```

### 4. Start the server
```bash
# Development (auto-restart on save)
npm run dev

# Production
npm start
```

Server runs on **http://localhost:5000**

---

## API Endpoints

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | /api/health         | Health check                       |
| GET    | /api/products       | All products                       |
| GET    | /api/products?category=coffee | Filtered by category   |
| GET    | /api/products/:id   | Single product                     |
| POST   | /api/orders         | Place an order (emails customer + admin) |
| GET    | /api/orders         | List all orders (admin)            |
| GET    | /api/comments       | All comments, newest first         |
| POST   | /api/comments       | Post a new comment (emails admin)  |

---

## Connecting the Frontend

Open `FRONTEND_PATCH.js` — it contains:

1. The `API_URL` constant to add at the top of your script block
2. A new `checkout()` function — replaces the existing one in `index.html`
3. A new `submitComment()` function — replaces the existing one in `index.html`
4. An optional `loadCommentsFromDB()` function — call it on page load

**No other changes to `index.html` are needed.**

---

## Email Setup (Gmail)

1. Go to your Google Account → Security → 2-Step Verification → App Passwords
2. Generate a password for "Mail"
3. Paste the 16-character password into `SMTP_PASS` in your `.env`

---

## Deployment

- **Backend:** Deploy to Railway, Render, or a VPS. Set all `.env` variables as environment variables.
- **Frontend:** Update `API_URL` in `FRONTEND_PATCH.js` to your live backend URL before deploying `index.html`.
