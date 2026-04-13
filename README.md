
# Admin Analytics Dashboard (MEAN Stack)

---

##  Project Overview

This is a full-stack **Admin Dashboard with Analytics & Reporting** built using the **MEAN stack (MongoDB, Express.js, Angular, Node.js)**.

The application allows administrators to:

* Monitor analytics (users, revenue, activity)
* Manage users and content
* View real-time charts and reports
* Access secure, role-based features

---

##  Features

*  Dashboard with analytics (users, revenue, metrics)
*  Real-time charts using Chart.js
*  User management (view, update, delete)
*  Authentication using JWT
*  Role-based access control (Admin/User)
*  Content management system
*  Settings & profile page
*  Fully responsive UI

---

##  Tech Stack

### Frontend

* Angular (v16+)
* TypeScript
* HTML5, CSS3
* Chart.js

### Backend

* Node.js (v20+)
* Express.js

### Database

* MongoDB Atlas

### Tools

* npm
* Git & GitHub

---

---

##  Complete Setup Instructions (Step-by-Step)

###  Step 1: Clone the Repository

```
git clone https://github.com/Sathwika06-gif/Admin-Analytics-Dashboard.git
cd Admin-Analytics-Dashboard
```

---

##  Step 2: Backend Setup

### Go to backend folder

```
cd backend
```

### Install dependencies

```
npm install
```

### Create `.env` file inside backend folder

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

Example MongoDB Atlas URL:

```
mongodb+srv://username:password@cluster.mongodb.net/adminDashboard
```

### Run backend server

```
node index.js
```

 Backend runs at:

```
http://localhost:5000
```

---

##  Step 3: Frontend Setup

### Open new terminal and go to frontend

```
cd frontend
```

### Install dependencies

```
npm install
```

### Run Angular app

```
ng serve
```

 Frontend runs at:

```
http://localhost:4200
```

---

##  Authentication Details

* Login is implemented using JWT
* Passwords are encrypted using bcrypt
* Protected routes using middleware
* Role-based access (Admin/User)

---

##  Demo Login Credentials

```
Email: admin@smartwinnr.com
Password: admin123
```

Note: Make sure this user exists in MongoDB

---

##  Dashboard Functionalities

* Total users and active users tracking
* Revenue analytics
* Real-time charts using Chart.js
* Data fetched from backend APIs

---

##  API Endpoints

```
POST   /api/auth/login
GET    /api/users
POST   /api/content
GET    /api/dashboard
```

---





##  How to Run (Quick Summary)

```
# Backend
cd backend
npm install
node index.js

# Frontend (new terminal)
cd frontend
npm install
ng serve
```



