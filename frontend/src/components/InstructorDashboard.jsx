import { useState, useEffect } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

function InstructorDashboard() {
  const currentUser = useAuth((state) => state.currentUser);

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getMyCourses() {
      setLoading(true);
      try {
        let res = await axios.get(
          "http://localhost:3000/instructor-api/courses",
          {
            withCredentials: true,
          },
        );
        
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
    }
  }, [currentUser]);

  const handleCreateCourse = () => {
    navigate("/create-course");
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Instructor Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your courses and track student progress.</p>
        </div>
        <button 
          onClick={handleCreateCourse}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Course
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl mb-12 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.firstName}!</h2>
        <p className="text-blue-100 opacity-90 max-w-2xl">
          You have <span className="font-bold text-white">{courses.length}</span> active courses. Keep up the great work inspiring students!
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Your Published Courses</h3>
      </div>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-gray-50 relative group-hover:brightness-95 transition-all">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                    course.status === "PUBLISHED" 
                      ? "bg-green-500 text-white border-green-600" 
                      : "bg-yellow-400 text-yellow-900 border-yellow-500"
                  }`}>
                    {course.status || "DRAFT"}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {course.category}
                  </span>
                  <span className="flex items-center text-amber-500 text-xs font-bold">
                    ★ {course.averageRating || "0.0"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                 <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {course.totalStudents || 0} Students
                 </div>
                 <button 
                   onClick={() => handleEditCourse(course._id)}
                   className="text-gray-900 hover:text-blue-600 p-2 hover:bg-white rounded-lg transition-all active:scale-95"
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
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses created yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start sharing your knowledge with the world by creating your first course today.</p>
            <button 
              onClick={handleCreateCourse}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
            >
                Create Your First Course
            </button>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;
