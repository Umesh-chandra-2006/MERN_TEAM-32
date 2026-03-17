import { useState, useEffect, useCallback } from "react";
import { useAuth, api } from "../store/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { CourseCardSkeleton } from "./Skeleton";

function UserDashboard() {
  const currentUser = useAuth().currentUser;

  const [loading, setLoading] = useState(false);
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
  }, [currentUser, searchQuery, category, fetchCourses]);

  const gotoCourse = (courseObj) => {
    navigate(`/course/${courseObj._id}`, { state: { course: courseObj } });
  };

  const categories = ["all", "Development", "Design", "Business", "Marketing", "Music"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Available Courses</h1>
          <p className="text-gray-500 mt-1">Welcome back, {currentUser?.firstName}! Explore our latest offerings.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <CourseCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center p-12 bg-red-50 rounded-3xl border border-red-100 max-w-2xl mx-auto my-10">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button 
            onClick={() => fetchCourses(searchQuery, category)}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-100"
          >
            Retry
          </button>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => gotoCourse(course)}
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img 
                  src={course.thumbnailUrl || "https://placehold.co/600x400?text=Course"} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider text-blue-600 rounded-lg shadow-sm border border-blue-50">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-grow">
                <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <span className="text-xs font-black text-blue-600">
                      {course.instructor?.firstName?.[0] || "I"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-bold">
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed font-medium">
                  {course.description}
                </p>
              </div>

              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                 <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-xs font-black">{course.averageRating || "0.0"}</span>
                 </div>
                 <div className="flex items-center gap-1 group/btn">
                    <span className="text-blue-600 text-xs font-black uppercase tracking-wider">Explore</span>
                    <svg className="w-4 h-4 text-blue-600 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                 </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 max-w-xs mx-auto font-medium">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => {setSearchQuery(""); setCategory("all");}}
              className="mt-8 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;