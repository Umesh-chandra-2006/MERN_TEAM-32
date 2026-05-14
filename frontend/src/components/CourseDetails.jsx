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
    <div className="min-h-screen text-slate-900">
      <div className="bg-[linear-gradient(180deg,#0f172a,#111827_60%,#0f172a)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white">
                  {course.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-slate-300">
                   <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                   </svg>
                   {course.averageRating} ({course.totalReviews} reviews) • {course.totalStudents || 0} students enrolled
                </span>
              </div>
              <h1 className="mb-6 text-4xl font-black leading-tight md:text-5xl">
                {course.title}
              </h1>
              <p className="mb-8 max-w-2xl text-xl leading-relaxed text-slate-300">
                {course.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white ring-1 ring-white/10">
                  {course.instructor?.firstName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Created by</p>
                  <p className="text-lg font-bold">{course.instructor?.firstName} {course.instructor?.lastName}</p>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end w-full max-w-md">
              <div className="rounded-[2.5rem] border border-white/70 bg-white/95 p-8 text-slate-900 shadow-[0_32px_90px_-36px_rgba(15,23,42,0.55)] backdrop-blur transform lg:translate-y-16">
                <div className="group relative mb-6 flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-slate-300">
                   <svg className="w-16 h-16 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-transparent"></div>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-black tracking-tight text-slate-950">${course.price || "Free"}</span>
                </div>

                {enrollment ? (
                  <button
                    onClick={startLearning}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-4 text-lg font-black text-white shadow-xl shadow-slate-950/15 transition-transform active:scale-95 hover:-translate-y-0.5"
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
                    className="flex w-full items-center justify-center rounded-2xl bg-slate-950 py-4 text-lg font-black text-white shadow-xl shadow-slate-950/15 transition-transform active:scale-95 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {enrolling ? "Enrolling..." : "Enroll Now"}
                  </button>
                )}
                
                <div className="mt-6 space-y-3">
                  <p className="text-center text-sm font-bold uppercase tracking-[0.24em] text-slate-400">Includes</p>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                    </svg>
                    {course.lectures?.length} Video Lectures
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:pt-32">
        <div className="max-w-3xl">
          <h2 className="mb-8 text-3xl font-black tracking-tight text-slate-950">Course Curriculum</h2>
          <div className="space-y-4">
            {course.lectures?.map((lecture, index) => (
              <div
                key={lecture._id}
                className="group flex cursor-default items-center justify-between rounded-2xl border border-slate-200 bg-white/75 p-5 shadow-sm transition-all hover:border-blue-100 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-400 transition-colors group-hover:border-blue-100 group-hover:text-blue-700">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950">{lecture.title}</h3>
                    <p className="text-xs font-medium text-slate-400">Video • {Math.floor(lecture.duration / 60)}m {lecture.duration % 60}s</p>
                  </div>
                </div>
                {!enrollment && (
                  <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
