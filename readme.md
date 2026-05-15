# SunStk Learning Management System (LMS)

A robust, full-stack Learning Management System built with the MERN stack, featuring adaptive video streaming, role-based access control, and automated video transcoding.

## 🚀 Key Features

- **Adaptive Video Streaming:** Automatic transcoding of raw MP4 uploads into HLS (HTTP Live Streaming) format for smooth playback.
- **Sequential Video Queue:** Custom task queue to manage heavy FFmpeg processing without overwhelming the server.
- **Role-Based Access Control (RBAC):** Dedicated dashboards and permissions for Students, Instructors, and Admins.
- **Course Management:** Instructors can create courses, manage curricula, and track video processing status in real-time.
- **Student Experience:** Interactive learning view, progress tracking, and course reviews.
- **Security:** JWT-based authentication with HTTP-only cookies and global error handling.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Zustand, React Hook Form, Video.js.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Processing:** FFmpeg (Transcoding), SimpleVideoQueue (Task Management).
- **Storage:** AWS S3 (Raw and HLS assets).

## 📁 Project Structure

```text
D:\SUNSTK-TEAM\
├── backend/            # Express API & Video Services
│   ├── APIs/           # Role-based API routes
│   ├── middlewares/    # Auth and Error middlewares
│   ├── models/         # Mongoose Schemas
│   ├── services/       # Video processing & Auth logic
│   └── server.js       # Entry point
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI & Page components
    │   ├── store/      # Zustand state management
    │   └── App.jsx     # Routing logic
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- FFmpeg installed on your system
- AWS S3 Bucket

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=3000
DB_URL=your_mongodb_url
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET_NAME=your_bucket
AWS_REGION=your_region
# Optional
AWS_CLOUDFRONT_DOMAIN=your_cloudfront_url
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Deployment

### Backend (Render/Heroku)
- Set the Root Directory to `backend`.
- Ensure FFmpeg is installed in the environment.
- Update `cors` settings in `server.js` to allow your production frontend URL.

### Frontend (Vercel/Netlify)
- Set the Root Directory to `frontend`.
- Build Command: `npm run build`.
- Output Directory: `dist`.
- Include a `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 🛡️ Security & Performance
- **Global Error Handler:** Consistent API responses across all endpoints.
- **Atomic Updates:** Surgical database updates for video statuses to prevent data loss.
- **Thread Management:** FFmpeg is limited to 2 threads to maintain API responsiveness during processing.
