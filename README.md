# Dayflow HRMS

Dayflow HRMS is a full-stack Human Resource Management System designed to manage daily HR tasks in a digital and organized way. It includes features like employee management, attendance tracking, leave management, payroll, and more.

## Features
- **Employee Dashboard**: View profile, attendance, payroll, and apply for leaves.
- **HR Dashboard**: Manage employees, approve leaves, and view reports.
- **Admin Dashboard**: Full access to all modules.
- **Authentication**: JWT-based authentication with role-based access control.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)

### Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Install Dependencies
Install dependencies for both the frontend and backend:
npm run install:all

###Configure Environment Variables
1.Copy the .env.example file to .env:
    cp server/.env.example server/.env
2.Fill in the required values in the .env file:
    MONGODB_URI=mongodb://localhost:27017/dayflow_hrms
    JWT_SECRET=your_jwt_secret
    PORT=5000
###Run the Application
Start both the frontend and backend servers:
  npm run dev

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api


