import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await axios.get(`http://localhost:3000/student-api/courses/${courseId}`, {
          withCredentials: true,
        });
        setCourse(res.data.payload.course);
        setEnrollment(res.data.payload.enrollment);
      } catch (_err) {
        toast.error("Failed to fetch course details");
        navigate("/user-dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [courseId, navigate]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/student-api/courses/${courseId}/enroll`,
        {},
        { withCredentials: true }
      );
      toast.success("Enrolled successfully!");
      setEnrollment(res.data.payload);
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const startLearning = () => {
    navigate(`/learning/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">
                  {course.category}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                   <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                   </svg>
                   {course.averageRating} ({course.totalReviews} reviews) • {course.totalStudents || 0} students enrolled
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                {course.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {course.instructor?.firstName?.[0]}
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Created by</p>
                  <p className="text-lg font-bold">{course.instructor?.firstName} {course.instructor?.lastName}</p>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end w-full max-w-md">
              <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 text-gray-900 border border-gray-100 transform lg:translate-y-16">
                <div className="aspect-video bg-gray-100 rounded-3xl mb-6 flex items-center justify-center text-gray-300 overflow-hidden relative group">
                   <svg className="w-16 h-16 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-black tracking-tight">${course.price || "Free"}</span>
                </div>

                {enrollment ? (
                  <button
                    onClick={startLearning}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                  >
                    Go to Course
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200 flex items-center justify-center disabled:opacity-50"
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                )}
                
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">Includes</p>
                  <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                    </svg>
                    {course.lectures?.length} Video Lectures
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Full lifetime access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:pt-32">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Course Curriculum</h2>
          <div className="space-y-4">
            {course.lectures?.map((lecture, index) => (
              <div
                key={lecture._id}
                className="group flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{lecture.title}</h3>
                    <p className="text-xs text-gray-400 font-medium">Video • {Math.floor(lecture.duration / 60)}m {lecture.duration % 60}s</p>
                  </div>
                </div>
                {!enrollment && (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
