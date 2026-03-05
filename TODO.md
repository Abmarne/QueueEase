# QueueEase MVP Todo List 🚀

This todo list outlines the necessary steps to achieve the first release (MVP) of QueueEase, based on the Product Requirements Document and Design specifications.

## ✅ 1. Project Initialization

- [x] Initialize Next.js project with TypeScript and Tailwind CSS.
- [x] Set up Supabase project (Database + Auth).
- [x] Install necessary dependencies (`@supabase/supabase-js`, `lucide-react`, etc.).
- [x] Configure environment variables (`.env.local`) for Supabase connectivity.

## ✅ 2. Database & Security (Supabase)

- [x] Create `users` table with roles (`business`, `customer`).
- [x] Create `queues` table (id, business_id, name, status, created_at).
- [x] Create `tokens` table (id, queue_id, customer_id, guest_name, position, status, created_at).
- [x] Set up Database ENUMs for roles and statuses.
- [x] Configure Row Level Security (RLS) policies for businesses and public guests.

## ✅ 3. Authentication & RBAC

- [x] Implement Registration/Login flow for Businesses.
- [x] Implement Guest entry logic for Customers (guest name storage).
- [x] Handle role assignment upon user signup via database triggers.

## ✅ 4. Business Dashboard

- [x] Create Dashboard Layout and overview cards.
- [x] Implement "Create and Delete Queue" functionality.
- [x] Build Live Queue View with real-time updates.
- [x] Actions: "Serve Customer" and "Remove/Left".
- [x] Implement QR Code generation for each queue.
- [x] Build Analytics Tab with key metrics.

## ✅ 5. Customer Interface

- [x] Build Queue Entry Page for guests via QR/Link.
- [x] Build Queue Status Page (Token #, Current Position, Est. Wait).
- [x] Implement "Leave Queue" functionality.

## ✅ 6. Real-time Features

- [x] Integrate Supabase Realtime for instant dashboard updates.
- [x] Auto-update customer position on the status page.
- [x] "Turn is Near" UI alerts when position ≤ 3.

## 🚀 7. Final Polish & Deployment

- [x] Fix guest name storage and RLS for public access.
- [x] Ensure Mobile-First Responsive Design for all pages (Dashboard Sidebar fixed).
- [ ] Perform End-to-End testing.
- [ ] Deploy the application to Vercel.

---

## 🏗 Phase 2: Post-MVP / Next Release (Advanced Features)

- [ ] **Email & Push Notifications**: Real notifications when turn is near (using Resend or OneSignal).
- [ ] **Appointment Scheduling**: Allow booking specific time slots alongside the live queue.
- [ ] **Advanced Analytics**: Peak hour calculation, staff performance, and demand forecasting.
- [ ] **Multi-staff Management**: Allow multiple staff members to serve customers from the same queue.
- [ ] **Loyalty Program**: Simple point-based rewards for returning customers.
- [ ] **Multilingual Support**: Support for local languages for the customer interface.
- [ ] **PWA Support**: Allow businesses to install the dashboard as an app.
