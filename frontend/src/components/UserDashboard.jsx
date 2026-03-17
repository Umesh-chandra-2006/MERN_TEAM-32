import { useState, useEffect } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

function UserDashboard() {
  const currentUser = useAuth().currentUser;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getCourses() {
      setLoading(true);
      try {
        let res = await axios.get("http://localhost:3000/student-api/courses", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setCourses(res.data.payload);
        } else {
          throw new Error("Unable to fetch courses");
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) {
      getCourses();
    }
  }, [currentUser]);

  const gotoCourse = (courseObj) => {
    navigate(`/course/${courseObj._id}`, { state: { course: courseObj } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading courses...</p>
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className="text-center p-12 bg-red-50 rounded-xl border border-red-100 max-w-2xl mx-auto my-10">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Available Courses</h1>
          <p className="text-gray-500 mt-1">Welcome back, {currentUser?.firstName}! Explore our latest offerings.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => gotoCourse(course)}
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-gray-100 relative">
                {/* Placeholder for course image */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-blue-600 rounded-md shadow-sm border border-blue-50">
                    {course.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-blue-600">
                      {course.instructor?.firstName?.[0] || "I"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium italic">
                    by {course.instructor?.firstName || "Unknown Instructor"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {course.description}
                </p>
              </div>
              
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                 <div className="flex items-center text-amber-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm font-bold">{course.averageRating || "4.5"}</span>
                    <span className="ml-1 text-[10px] text-gray-400 font-medium">({course.reviews?.length || 0})</span>
                 </div>
                 <button className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors flex items-center gap-1 group/btn">
                    View Course
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses available yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Check back later for new content or contact support if you believe this is an error.</p>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;