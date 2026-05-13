# SUNSTK Team

SUNSTK Team is a full-stack learning platform with role-based access for students, instructors, and admins. The app includes course browsing, enrollment, progress tracking, reviews, and video streaming support.

## Roles

- Student
- Instructor
- Admin

## Features

- Authentication and session handling
- Course CRUD for instructors and admins
- Course browsing and enrollment
- Video streaming support
- Progress tracking
- Course reviews
- Instructor dashboard for course management
- Student dashboard for enrolled courses

## Tech Stack

- Frontend: React, Vite, React Router, Zustand, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Cookie Parser
- Media: Multer, fluent-ffmpeg, AWS S3 helpers

## Project Structure

- `backend/` - Express API, database models, middleware, and services
- `frontend/` - React client application
- `backend/uploads/` - local upload storage, including HLS output and raw media

## Setup

### Backend

1. Install dependencies in `backend/`.
2. Create a `.env` file with at least `DB_URL` and `PORT`.
3. Start the server with `npm run dev`.

### Frontend

1. Install dependencies in `frontend/`.
2. Start the Vite dev server with `npm run dev`.

## Available Scripts

### Backend

- `npm start` - start the Express server
- `npm run dev` - start the Express server in the current configuration

### Frontend

- `npm run dev` - start the Vite dev server
- `npm run build` - build the production bundle
- `npm run lint` - run ESLint

## Notes

- The backend expects a MongoDB connection string in `DB_URL`.
- The default frontend origin allowed by the backend is `http://localhost:5173`.
- Uploaded media is stored under `backend/uploads/`.
