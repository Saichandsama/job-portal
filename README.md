**Full-Stack Job Portal** (India) 🚀
A modern, full-stack job portal application built with React, Node.js, Express, and SQLite. This platform allows Candidates to apply for jobs and Employers to post jobs, featuring real Indian company profiles (TCS, Infosys, Flipkart, Zomato, etc.).

**Features**
Role-Based Access Control: Separate dashboards for Candidates and Employers.
Employer Dashboard: Post new job listings with location, description, and salary.
Candidate Dashboard: Browse all available jobs, apply with one click, and track application status.
JWT Authentication: Secure login and registration flows.
Modern UI: Built with a sleek, dark-themed responsive design using Vanilla CSS.
**Tech Stack**
Frontend: React.js, Vite, React Router DOM, Axios, Vanilla CSS.
Backend: Node.js, Express.js.
Database: SQLite (requires zero external setup).
Security: JSON Web Tokens (JWT), bcrypt for password hashing.
**Quick Start**
1. Clone & Install Dependencies
First, install the required dependencies for both the frontend and backend.

bash

# Install backend dependencies
cd backend
npm install
# Install frontend dependencies
cd ../frontend
npm install
2. Run the Backend
The backend runs on http://localhost:5000. Running the seed script will automatically generate the SQLite database with dummy data for real Indian companies.

bash

cd backend
node seed.js  # Run this once to populate the database
node server.js # Start the backend server
3. Run the Frontend
In a new terminal window, start the React development server.

bash

cd frontend
npm run dev
Open your browser and navigate to http://localhost:5173.

Default Test Accounts
Candidate: student@india.com | Password: password123
Employer: employer@tech.com | Password: password123
