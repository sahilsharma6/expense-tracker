💼 Expense Tracker – Pocketrocket Labs Take-Home Assignment

A full-stack web application that allows remote teams to track, manage, and visualize expenses with role-based access control.

🧰 Tech Stack

Layer

Tech

Frontend

React.js

Backend

Node.js (Express)

DB

MongoDB (Mongoose)

Auth

JWT-based

Charts

Recharts

📦 Features

✅ Authentication & RBAC

JWT-based login system

Roles: employee & admin

✅ Expense Tracking

Employees: Add & view their own expenses

Admins: View all expenses, filter, and update statuses

✅ Admin Insights (Charts)

Total expenses by category (Bar chart)

Monthly expenses (Line chart)

✅ Audit Logs

Records every key action (expense creation, status changes)

Admin-only viewer

🛠️ Setup Instructions

Prerequisites

Node.js (>=22.x)

MongoDB (local or cloud)

1. Clone the repo

git clone https://github.com/sahilsharma6/expense-tracker.git
cd expense-tracker

2. Setup Backend

cd backend
npm install

Create config/config.env

PORT=3000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=sfrfsr
JWT_EXPIRE=10d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

npm start

3. Setup Frontend

cd ../frontend
npm install
npm run dev

Unit Tests Will push soon

📸 Screenshots

(Add screenshots of each page: login, employee dashboard, admin dashboard with charts, audit log view)

📬 Contact

For questions, reach out at: sahilsharma86600@gmail.com

✅ Built with ❤️ for Pocketrocket Labs
