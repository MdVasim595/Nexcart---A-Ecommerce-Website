# NexCart

## Production setup

1. Copy `backend/.env.example` to `backend/.env` and replace every placeholder. Use Razorpay live keys only in production.
2. Generate a long JWT secret:
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
3. Generate the admin password hash from `backend/`:
   `npm run hash-admin-password -- "your-long-unique-password"`
4. Set `FRONTEND_ORIGINS` to the exact HTTPS frontend origin. Separate multiple origins with commas.
5. In Razorpay Dashboard, enable automatic capture and create a webhook pointing to:
   `https://YOUR_API_DOMAIN/api/payment/webhook`
6. Subscribe the webhook to `payment.captured` and `payment.failed`, then place its secret in `RAZORPAY_WEBHOOK_SECRET`. This must be different from the API key secret.
7. Set frontend `VITE_API_URL` to `https://YOUR_API_DOMAIN/api`. The Razorpay key is returned by the authenticated order endpoint, so no frontend Razorpay environment variable is needed.
8. Deploy both services behind HTTPS, keep MongoDB network access restricted to the backend, and run `npm audit --omit=dev` during CI/deploys.

## Verification

Run `npm run build` and `npm run lint` in `frontend/`. Run `npm audit --omit=dev` and `node --check server.js` in `backend/`.

Before going live, complete a Razorpay test-mode payment, verify the order becomes `Paid`, test a failed payment, and confirm signed webhook delivery in the Razorpay Dashboard.
