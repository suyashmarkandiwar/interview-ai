# GenAI Interview Preparation Platform

A full-stack, AI-powered interview preparation platform that analyzes a candidate's resume and a target job description to generate a highly customized, day-by-day interview preparation roadmap. 

It evaluates match scores, identifies skill gaps, formulates potential technical and behavioral questions, and even allows users to export a tailored, ATS-friendly PDF resume via Puppeteer.

---

## ✨ Key Features

- **🧠 AI-Powered Analysis**: Accurately compares your resume against real job descriptions using Google Gemini.
- **📊 Match Scoring**: Get an instant percentage match to see where you stand.
- **🛣️ Day-by-Day Roadmap**: A customized, actionable study plan that focuses strictly on your weak points.
- **❓ Targeted Questions**: Practice with technical and behavioral questions (complete with interviewer intentions and ideal answers).
- **📄 Auto-Generated Resumes**: Generate and instantly download an optimized, ATS-friendly PDF resume tailored directly to the job.
- **🔒 Secure Authentication**: Full user account system with encrypted JWT HTTP-only cookies.

---

## 🏗️ System Architecture

This project is built using the **MERN Stack** (MongoDB, Express, React, Node.js) combined with **Google's Gemini AI**.

- **Frontend (Client)**: 
  - **Framework**: React (Bootstrapped with Vite)
  - **Styling**: SCSS / SASS for scoped and global styles
  - **State Management & Data Fetching**: Context API, Axios, custom React Hooks (`useAuth`, `useInterview`)
  - **Routing**: React Router DOM

- **Backend (Server)**:
  - **Framework**: Node.js & Express.js
  - **Database**: MongoDB (Mongoose for ODM)
  - **Authentication**: JWT (JSON Web Tokens) stored in HTTP-only cookies
  - **PDF Generation**: Puppeteer (Headless Chrome for HTML-to-PDF conversion)

- **AI Integration**:
  - **Provider**: Google GenAI SDK (`@google/genai`)
  - **Model**: `gemini-3.5-flash`
  - **Functionality**: Uses strict JSON schema enforcement to predictably extract match scores, questions, skill gaps, and preparation roadmaps.

---

## 📁 Folder Structure

```text
GENAI-FULLSTACK-PROJECT/
├── Backend/                    # Express.js Server
│   ├── config/                 # Database configuration (MongoDB)
│   ├── controllers/            # Route controllers (Auth, Interview)
│   ├── middleware/             # Express middlewares (Auth guard, error handling)
│   ├── models/                 # Mongoose schemas (User, InterviewReport)
│   ├── routes/                 # API route definitions
│   ├── services/               # Core business logic (ai.service.js using Gemini)
│   ├── .env                    # Backend environment variables
│   └── server.js               # Entry point
│
├── Frontend/                   # React.js Client (Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── features/           # Feature-based folder structure
│   │   │   ├── auth/           # Authentication pages, hooks, and services
│   │   │   └── interview/      # Dashboard, Report generation, and hooks
│   │   ├── style/              # Global SCSS components (buttons, layout)
│   │   ├── App.jsx             # Main React component
│   │   ├── app.routes.jsx      # Routing configuration
│   │   └── main.jsx            # Entry point
│   ├── .env                    # Frontend environment variables
│   └── vite.config.js          # Vite configuration
│
├── .gitignore                  # Global git ignores
└── README.md                   # Project documentation
```

---

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Google Gemini API Key](https://aistudio.google.com/)

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd GENAI-FULLSTACK-PROJECT
```

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Create a .env file based on your environment
# Ensure the following variables are set:
# PORT=3000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# GOOGLE_API_KEY=your_gemini_api_key

# Start the backend development server
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

### 4. Open the App
Navigate to `http://localhost:5173` in your browser. You can register a new account, upload a PDF/Word resume, paste a job description, and generate your customized interview roadmap!

---

## 📜 License

This project is licensed under the MIT License - feel free to use, modify, and distribute it as you see fit.

*Built with ❤️ for developers preparing for their next big role.*
