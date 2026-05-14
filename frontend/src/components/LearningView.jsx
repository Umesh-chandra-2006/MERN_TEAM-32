import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import VideoPlayer from "./VideoPlayer";
import { api } from "../store/useAuth";

function LearningView() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLearningData() {
      try {
        const res = await api.get(`/student-api/courses/${courseId}`);
        
        const courseData = res.data.payload.course;
        const enrollmentData = res.data.payload.enrollment;

        if (!enrollmentData) {
          toast.error("You are not enrolled in this course");
          navigate(`/course/${courseId}`);
          return;
        }

        setCourse(courseData);
        setEnrollment(enrollmentData);
        
        // Default to first lecture or last accessed (if we add that later)
        if (courseData.lectures && courseData.lectures.length > 0) {
          setCurrentLecture(courseData.lectures[0]);
        }
      } catch (_err) {
        toast.error("Failed to load learning data");
        navigate("/user-dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchLearningData();
  }, [courseId, navigate]);

  const handleLectureSelect = (lecture) => {
    setCurrentLecture(lecture);
  };

  const markAsCompleted = async (lectureId) => {
    try {
      const res = await api.patch(`/student-api/courses/${courseId}/lectures/${lectureId}/progress`, {});
      setEnrollment(res.data.payload);
      toast.success("Progress saved!");
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-slate-950"></div>
        <p className="font-medium text-slate-500">Preparing your classroom...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col overflow-hidden bg-slate-950 lg:flex-row">
      {/* Main Content Area (Video) */}
      <div className="relative flex grow flex-col bg-slate-950">
        <div className="aspect-video max-h-[70vh] w-full bg-black">
          {currentLecture?.videoUrl ? (
            <VideoPlayer 
              src={currentLecture.videoUrl} 
              options={{ 
                autoplay: true,
                onEnded: () => markAsCompleted(currentLecture._id) 
              }} 
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-slate-900 text-slate-500">
               <svg className="h-20 w-20 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
               </svg>
               <p className="font-bold">No video available for this lecture yet.</p>
            </div>
          )}
        </div>
        
        <div className="p-8 text-white lg:p-10">
          <h1 className="mb-2 text-2xl font-black tracking-tight">{currentLecture?.title}</h1>
          <p className="text-sm font-medium text-slate-400">{course?.title}</p>
          
          <div className="mt-8 border-t border-white/10 pt-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="grow">
                <h2 className="mb-2 text-lg font-bold tracking-tight">Rate this course</h2>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={async () => {
                        try {
                          await api.put(`/student-api/courses/${courseId}/reviews`, { rating: star, comment: "" });
                          toast.success("Thanks for your rating!");
                        } catch (err) {
                          toast.error("Failed to submit rating");
                        }
                      }}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <svg 
                        className={`w-8 h-8 ${star <= (course?.averageRating || 0) ? "text-amber-400 fill-current" : "text-gray-600"}`} 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                 <div className="text-center">
                    <p className="text-2xl font-black text-white">{course?.averageRating || "0.0"}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Avg Rating</p>
                 </div>
                 <div className="h-10 w-px bg-white/10"></div>
                 <div className="text-center">
                    <p className="text-2xl font-black text-white">{course?.totalStudents || "0"}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">Students</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8">
            <h2 className="mb-4 text-lg font-bold tracking-tight">About this lecture</h2>
            <p className="leading-relaxed text-slate-400">
               {course?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar (Course Content) */}
      <div className="flex w-full flex-col overflow-hidden border-l border-white/10 bg-slate-900 lg:w-96">
        <div className="border-b border-white/10 p-6">
          <h2 className="mb-4 text-xl font-black tracking-tight text-white">Course Content</h2>
          <div className="h-2 w-full rounded-full bg-white/10">
            <div 
              className="h-2 rounded-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${enrollment?.progressPercentage || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Progress</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">{enrollment?.progressPercentage || 0}% Complete</span>
          </div>
        </div>

        <div className="grow overflow-y-auto">
          {course?.lectures.map((lecture, index) => {
            const isCompleted = enrollment?.completedLectures.includes(lecture._id);
            const isActive = currentLecture?._id === lecture._id;
            
            return (
              <div
                key={lecture._id}
                onClick={() => handleLectureSelect(lecture)}
                className={`p-4 flex items-start gap-4 cursor-pointer transition-all border-b border-gray-800/50 ${
                  isActive ? "bg-white/5" : "hover:bg-white/5"
                }`}
              >
                <div className="mt-1">
                  {isCompleted ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`h-5 w-5 rounded-full border-2 ${isActive ? "border-blue-400" : "border-white/20"}`}></div>
                  )}
                </div>
                <div className="grow">
                   <p className={`mb-1 text-sm font-bold leading-tight ${isActive ? "text-blue-400" : "text-slate-300"}`}>
                      {index + 1}. {lecture.title}
                   </p>
                   <div className="flex items-center gap-2">
                      <svg className="h-3 w-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                      </svg>
                      <span className="text-[10px] font-medium text-slate-500">Video • {Math.floor(lecture.duration / 60)}m</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="border-t border-white/10 p-6">
           <button 
             onClick={() => navigate("/user-dashboard")}
             className="w-full rounded-xl bg-white/5 py-3 text-sm font-bold text-slate-300 transition-all active:scale-95 hover:bg-white/10"
           >
              Back to Dashboard
           </button>
        </div>
      </div>
    </div>
  );
}

export default LearningView;
