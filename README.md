#  BlogHub — Full Stack MERN Blogging Platform

A modern, full-stack blogging application built using the MERN Stack (MongoDB, Express.js, React, Node.js) with TypeScript, JWT Authentication, and Tailwind CSS. Users can register, create, edit, publish blog posts with image uploads, interact with other posts through likes and comments, and customize their user profiles.

---

 Key Features

-  JWT Authentication & Authorization: Secure signup, login, and protected routes using JWT & bcrypt password hashing.
-  Blog Management: Full CRUD support to create, update, draft, publish, and delete blog posts.
-  Image Uploads: Upload post cover images and user profile avatars handled via `Multer` with automatic local storage cleanup.
- Interactive Comments & Likes: Engage with content through real-time count updates for likes and blog post discussion comments.
-  Modern Responsive UI: Built with React, Tailwind CSS, custom glassmorphism effects, and smooth micro-animations.
-  Type-Safe Architecture: Fully typed codebase using TypeScript across both frontend and backend modules.

---

 Tech Stack

### Frontend
- Framework: React 19 (TypeScript)
- Routing: React Router DOM v6
- Styling: Tailwind CSS, @tailwindcss/typography, @tailwindcss/forms
- HTTP Client: Axios

### Backend
- Runtime: Node.js & Express.js (TypeScript)
- Database: MongoDB with Mongoose ODM
- Authentication: JSON Web Tokens (JWT) & bcryptjs
- File Storage: Multer (Local Disk Storage / Cloudinary support)
- Security: Helmet, CORS, Express Rate Limit

---

## Project Structure

```
blog-app/
├── client/                     # React Frontend Application
│   ├── public/                 # Static Assets
│   ├── src/                    
│   │   ├── components/         # Reusable UI Components (Navbar, BlogCard, etc.)
│   │   ├── contexts/           # AuthContext & Axios Interceptors
│   │   ├── pages/              # Application View Pages (Home, Dashboard, BlogDetail, etc.)
│   │   ├── services/           # Axios REST API Wrappers
│   │   └── types/              # Shared TypeScript Interfaces
│   ├── tailwind.config.js      # Tailwind Configuration
│   └── package.json            
│
├── server/                     # Node.js + Express Backend Server
│   ├── src/
│   │   ├── config/             # Database Connection Configuration
│   │   ├── controllers/        # Express Handlers (Auth, Blogs, Comments)
│   │   ├── middleware/         # Auth Guard, Multer Storage, Error Handling
│   │   ├── models/             # Mongoose Data Schemas (User, BlogPost, Comment)
│   │   ├── routes/             # REST Endpoints Definition
│   │   └── server.ts           # Server Entry Point
│   ├── uploads/                # Directory for Local Image Uploads
│   └── package.json            
│
├── package.json                # Root Concurrently Script Runner
└── README.md                   # Repository Documentation
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed locally:
- [Node.js](https://nodejs.org/) (v16.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017` (or a MongoDB Atlas connection URI)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/blog-app.git
   cd blog-app
   ```

2. **Install all dependencies** for root, client, and server:
   ```bash
   npm run install-all
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/blog-app
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Run the Application**:
   Start both the backend server and frontend client concurrently:
   ```bash
   npm run dev
   ```
   - Frontend will run on: `http://localhost:3000`
   - Backend API will run on: `http://localhost:5000`

##  License

This project is licensed under the [MIT License](LICENSE).
