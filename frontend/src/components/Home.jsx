import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import heroImg from "../assets/hero.png";
import { api } from "../store/useAuth";
import { CourseCardSkeleton } from "./Skeleton";

function Home() {
  const [latestCourses, setLatestCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await api.get("/student-api/courses?limit=4");
        setLatestCourses(res.data.payload);
      } catch (err) {
        console.error("Failed to fetch latest courses", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                New Courses Available
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight mb-8">
                Master New Skills with <span className="text-blue-600 relative">
                  SunStk
                  <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0 7L20 3C40 -1 60 7 100 3" stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-12">
                Unlock your potential with our expert-led courses. Join thousands of students learning everything from development to design in a modern, interactive environment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 text-lg"
                >
                  Get Started for Free
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-5 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition-all active:scale-95 border border-gray-200 text-lg shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            </div>
            
            <div className="mt-20 lg:mt-0 lg:col-span-6 relative">
              <div className="relative group">
                <div className="absolute -inset-6 bg-blue-100 rounded-[3.5rem] -rotate-3 blur-2xl opacity-40 group-hover:rotate-0 transition-transform duration-700"></div>
                <img
                  src={heroImg}
                  alt="Hero"
                  className="relative w-full rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] object-cover aspect-[4/3] transform group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Latest Courses</h2>
              <p className="text-gray-500 font-medium">Handpicked courses to help you stay ahead of the curve.</p>
            </div>
            <Link to="/login" className="px-8 py-4 bg-white border border-gray-200 text-gray-900 font-black rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm text-sm">
              Explore All Courses
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => <CourseCardSkeleton key={i} />)
            ) : (
              latestCourses.map((course) => (
                <div 
                  key={course._id} 
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                     <img 
                       src={course.thumbnailUrl || "https://placehold.co/600x400?text=Course"} 
                       alt={course.title}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-blue-600 rounded-lg shadow-sm">
                           {course.category}
                        </span>
                     </div>
                  </div>
                  <div className="p-6 flex-grow">
                     <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {course.title}
                     </h3>
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-black">
                           {course.instructor?.firstName?.[0]}
                        </div>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">
                           {course.instructor?.firstName} {course.instructor?.lastName}
                        </span>
                     </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                     <div className="flex items-center gap-1 text-amber-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-black italic">{course.averageRating || "0.0"}</span>
                     </div>
                     <span className="text-blue-600 font-black text-xs uppercase tracking-widest">Learn More →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
