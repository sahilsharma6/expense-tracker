### 🚀 Live Demo
https://rosybrown-fish-750672.hostingersite.com/login


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

Create .env

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

(FOR ADMIN)
<img width="1725" height="786" alt="image" src="https://github.com/user-attachments/assets/227ae5da-98df-442c-b006-f281edbaf761" />

<img width="1157" height="843" alt="image" src="https://github.com/user-attachments/assets/f8967df1-dc5f-4f9a-8448-482445ec4dd4" />

<img width="1659" height="889" alt="image" src="https://github.com/user-attachments/assets/07de99b9-5762-4163-baf5-e069bef852a9" />

<img width="1731" height="468" alt="image" src="https://github.com/user-attachments/assets/3c472b73-4d6e-47af-9c97-1718301a6ed6" />

<img width="1723" height="875" alt="image" src="https://github.com/user-attachments/assets/d155f79c-1673-49e3-ad91-e4508cf2dd7f" />

(FOR EMPLOYEE)
<img width="1654" height="583" alt="image" src="https://github.com/user-attachments/assets/9a806148-8acf-4470-8a92-dbf9df09ea15" />



📬 Contact

For questions, reach out at: sahilsharma86600@gmail.com

✅ Built with ❤️ for Pocketrocket Labs
