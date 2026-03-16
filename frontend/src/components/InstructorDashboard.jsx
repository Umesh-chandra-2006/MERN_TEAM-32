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
        // Assuming there is an endpoint to get courses by instructor
        // For now using the existing structure or similar
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

  if (loading) {
    return <div className="text-center p-10 font-semibold text-xl">Loading your courses...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Instructor Dashboard</h1>
      <div className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-200">
        <p className="text-lg">Welcome back, <span className="font-bold text-blue-700">{currentUser?.firstName} {currentUser?.lastName}</span>!</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Courses</h2>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                {/* Placeholder for course image */}
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-4 flex-0 grow">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-2">{course.category}</p>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {course.description}
                </p>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                 <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                 <button className="text-blue-600 text-sm font-semibold hover:text-blue-800">Edit Course</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">You haven't created any courses yet.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Create First Course
            </button>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;
