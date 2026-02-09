# QueueEase MVP Todo List 🚀

This todo list outlines the necessary steps to achieve the first release (MVP) of QueueEase, based on the Product Requirements Document and Design specifications.

## 🛠 1. Project Initialization

- [ ] Initialize Next.js project with TypeScript and Tailwind CSS.
- [ ] Set up Supabase project (Database + Auth).
- [ ] Install necessary dependencies (`@supabase/supabase-js`, `lucide-react`, etc.).
- [ ] Configure environment variables (`.env.local`) for Supabase connectivity.

## 🗄 2. Database & Security (Supabase)

- [ ] Create `users` table with roles (`business`, `customer`).
- [ ] Create `queues` table (id, business_id, name, status, created_at).
- [ ] Create `tokens` table (id, queue_id, customer_id, position, status, created_at).
- [ ] Set up Database ENUMs:
  - [ ] `user_role`: business, customer
  - [ ] `queue_status`: active, closed
  - [ ] `token_status`: waiting, served, left
- [ ] Configure Row Level Security (RLS) policies:
  - [ ] Businesses can manage their own queues and tokens.
  - [ ] Customers can join queues and view their own token/queue status.

## 🔐 3. Authentication & RBAC

- [ ] Implement Registration/Login flow for Businesses.
- [ ] Implement Guest entry logic for Customers (optional login for MVP).
- [ ] Handle role assignment upon user signup.

## 🏢 4. Business Dashboard

- [ ] Create Dashboard Layout.
- [ ] Implement "Create Queue" modal/form.
- [ ] Build Live Queue View:
  - [ ] List of waiting customers.
  - [ ] Actions: "Serve Customer" (updates status to `served`).
  - [ ] Actions: "Remove/Left" (updates status to `left`).
- [ ] Implement QR Code generation for each queue to share with customers.
- [ ] Build Analytics Tab:
  - [ ] Total served count.
  - [ ] Average wait time calculation.

## 📱 5. Customer Interface

- [ ] Build Queue Entry Page (Business name + "Join Queue" button).
- [ ] Build Queue Status Page:
  - [ ] Display Token Number.
  - [ ] Display Current Position (calculated dynamically).
  - [ ] Display Estimated Wait Time.
- [ ] Implement "Leave Queue" button.

## 🔄 6. Real-time Features & Notifications

- [ ] Integrate Supabase Realtime:
  - [ ] Dashboard updates automatically when customers join/leave.
  - [ ] Customer position updates automatically when someone is served.
- [ ] Implement "Turn is Near" Notifications:
  - [ ] Trigger notification (Email/Push) when position ≤ 3.

## 🚀 7. Final Polish & Deployment

- [ ] Ensure Mobile-First Responsive Design for all pages.
- [ ] Perform End-to-End testing:
  - [ ] Business creating queue -> Customer joining -> Business serving.
- [ ] Deploy the application to Vercel.
- [ ] Verification of performance (<2s updates) and 99% uptime.
