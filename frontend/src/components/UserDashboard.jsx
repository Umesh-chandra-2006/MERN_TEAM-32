import { useState, useEffect, useCallback } from "react";
import { useAuth, api } from "../store/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { CourseCardSkeleton } from "./Skeleton";

function UserDashboard() {
  const currentUser = useAuth((state) => state.currentUser);
  const authLoading = useAuth((state) => state.loading);
  const authReady = useAuth((state) => state.authReady);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  const navigate = useNavigate();

  const fetchCourses = useCallback(async (q = "", cat = "all") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (cat && cat !== "all") params.append("category", cat);

      let res = await api.get(`/student-api/courses?${params.toString()}`);
      setCourses(res.data.payload);
      setError(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const delayDebounceFn = setTimeout(() => {
        fetchCourses(searchQuery, category);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
    if (authReady && !currentUser) {
      setLoading(false);
    }
  }, [currentUser, searchQuery, category, fetchCourses, authReady]);

  const gotoCourse = (courseObj) => {
    navigate(`/course/${courseObj._id}`, { state: { course: courseObj } });
  };

  const categories = ["all", "Development", "Design", "Business", "Marketing", "Music"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500">Student dashboard</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Available courses</h1>
            <p className="mt-3 text-slate-600">Welcome back, {currentUser?.firstName}! Explore current offerings and continue learning.</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative flex-grow lg:w-72">
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          </div>
        </div>
      </div>

      {(loading || authLoading || !authReady) ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="mx-auto my-10 max-w-2xl rounded-[2.5rem] border border-rose-100 bg-rose-50 p-12 text-center">
          <p className="mb-4 font-medium text-rose-600">{error}</p>
          <button 
            onClick={() => fetchCourses(searchQuery, category)}
            className="rounded-full bg-rose-600 px-8 py-3 font-bold text-white shadow-lg shadow-rose-100 transition-all active:scale-95 hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => gotoCourse(course)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.45)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_-36px_rgba(15,23,42,0.45)]"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img 
                  src={course.thumbnailUrl || "https://placehold.co/600x400?text=Course"} 
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute left-3 top-3">
                  <span className="rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-blue-700 shadow-sm backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="flex-grow p-5">
                <h3 className="mb-2 text-lg font-black leading-tight text-slate-950 transition-colors group-hover:text-blue-700 line-clamp-2">
                  {course.title}
                </h3>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                    <span className="text-xs font-black text-blue-700">
                      {course.instructor?.firstName?.[0] || "I"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </span>
                </div>
                <p className="mb-4 line-clamp-2 text-sm font-medium leading-relaxed text-slate-500">
                  {course.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-5 py-4">
                 <div className="flex items-center rounded-full bg-amber-50 px-2 py-1 text-amber-500">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-xs font-black">{course.averageRating || "0.0"}</span>
                 </div>
                 <div className="flex items-center gap-1 group/btn">
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">Explore</span>
                    <svg className="w-4 h-4 text-blue-700 transform transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-4xl rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/70 py-24 text-center backdrop-blur">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl shadow-slate-950/5">
              <svg className="h-12 w-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-2xl font-black text-slate-950">No courses found</h3>
            <p className="mx-auto max-w-xs font-medium text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => {setSearchQuery(""); setCategory("all");}}
              className="mt-8 rounded-full border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              Clear all filters
            </button>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;