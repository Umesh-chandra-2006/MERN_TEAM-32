import { useState, useEffect } from "react";
import { api, useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

function InstructorDashboard() {
  const currentUser = useAuth((state) => state.currentUser);
  const authLoading = useAuth((state) => state.loading);
  const authReady = useAuth((state) => state.authReady);

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getMyCourses() {
      setLoading(true);
      try {
        let res = await api.get("/instructor-api/courses");
        
        if (res.status === 200) {
          setCourses(res.data.payload || []);
        }
      } catch (err) {
        const msg = err.response?.data?.message || "Unable to fetch courses";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) {
        getMyCourses();
      } else if (authReady) {
        setLoading(false);
    }
      }, [currentUser, authReady]);

  const handleCreateCourse = () => {
    navigate("/create-course");
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  if (loading || authLoading || !authReady) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-slate-950"></div>
        <p className="font-medium text-slate-500">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500">Instructor dashboard</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Manage your courses</h1>
            <p className="mt-3 text-slate-600">Keep your catalog organized, track student activity, and publish polished course content.</p>
          </div>
          <button 
            onClick={handleCreateCourse}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-semibold text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5 active:scale-95"
          >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Course
          </button>
        </div>
      </div>

      <div className="mb-12 overflow-hidden rounded-[2.5rem] border border-slate-950/10 bg-[linear-gradient(160deg,#0f172a,#1d4ed8)] p-8 text-white shadow-[0_30px_100px_-40px_rgba(15,23,42,0.75)]">
        <h2 className="mb-2 text-2xl font-bold">Welcome back, {currentUser?.firstName}!</h2>
        <p className="max-w-2xl text-blue-100/90">
          You have <span className="font-bold text-white">{courses.length}</span> active courses. Keep up the great work inspiring students!
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-950">Your published courses</h3>
      </div>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="group flex flex-col overflow-hidden rounded-4xl border border-slate-200/80 bg-white/85 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_-36px_rgba(15,23,42,0.45)]"
            >
              <div className="relative aspect-video bg-slate-50 transition-all group-hover:brightness-95">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] shadow-sm border ${
                    course.status === "PUBLISHED" 
                      ? "border-emerald-500 bg-emerald-500 text-white" 
                      : "border-amber-300 bg-amber-300 text-amber-950"
                  }`}>
                    {course.status || "DRAFT"}
                  </span>
                </div>
              </div>
              <div className="grow p-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
                    {course.category}
                  </span>
                  <span className="flex items-center text-xs font-bold text-amber-500">
                    ★ {course.averageRating || "0.0"}
                  </span>
                </div>
                <h3 className="mb-2 line-clamp-1 text-lg font-bold text-slate-950 transition-colors group-hover:text-blue-700">
                  {course.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {course.description}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-5 py-4">
                 <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    {course.totalStudents || 0} Students
                 </div>
                 <button 
                   onClick={() => handleEditCourse(course._id)}
                   className="rounded-xl p-2 text-slate-700 transition-all hover:bg-white hover:text-blue-700 active:scale-95"
                 >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/70 py-20 text-center backdrop-blur">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl shadow-slate-950/5">
              <svg className="h-10 w-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-950">No courses created yet</h3>
            <p className="mx-auto mb-8 max-w-sm text-slate-500">Start sharing your knowledge with the world by creating your first course today.</p>
            <button 
              onClick={handleCreateCourse}
              className="rounded-full bg-slate-950 px-8 py-3 font-bold text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5 active:scale-95"
            >
                Create Your First Course
            </button>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;
