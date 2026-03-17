import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";
import VideoPlayer from "./VideoPlayer";
import { useAuth } from "../store/useAuth";

function LearningView() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuth((state) => state.currentUser);

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLearningData() {
      try {
        const res = await axios.get(`http://localhost:3000/student-api/courses/${courseId}`, {
          withCredentials: true,
        });
        
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
      } catch (err) {
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
      const res = await axios.patch(
        `http://localhost:3000/student-api/courses/${courseId}/lectures/${lectureId}/progress`,
        {},
        { withCredentials: true }
      );
      setEnrollment(res.data.payload);
      toast.success("Progress saved!");
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Preparing your classroom...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-gray-900">
      {/* Main Content Area (Video) */}
      <div className="flex-grow bg-black relative flex flex-col">
        <div className="aspect-video w-full max-h-[70vh]">
          {currentLecture?.videoUrl ? (
            <VideoPlayer 
              src={currentLecture.videoUrl} 
              options={{ 
                autoplay: true,
                onEnded: () => markAsCompleted(currentLecture._id) 
              }} 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4 bg-gray-800">
               <svg className="w-20 h-20 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
               </svg>
               <p className="font-bold">No video available for this lecture yet.</p>
            </div>
          )}
        </div>
        
        <div className="p-8 text-white">
          <h1 className="text-2xl font-black mb-2 tracking-tight">{currentLecture?.title}</h1>
          <p className="text-gray-400 text-sm font-medium">{course?.title}</p>
          
          <div className="mt-8 pt-8 border-t border-gray-800">
            <h2 className="text-lg font-bold mb-4">About this lecture</h2>
            <p className="text-gray-400 leading-relaxed">
               {course?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar (Course Content) */}
      <div className="w-full lg:w-96 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-black text-white tracking-tight mb-4">Course Content</h2>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${enrollment?.progressPercentage || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress</span>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{enrollment?.progressPercentage || 0}% Complete</span>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {course?.lectures.map((lecture, index) => {
            const isCompleted = enrollment?.completedLectures.includes(lecture._id);
            const isActive = currentLecture?._id === lecture._id;
            
            return (
              <div
                key={lecture._id}
                onClick={() => handleLectureSelect(lecture)}
                className={`p-4 flex items-start gap-4 cursor-pointer transition-all border-b border-gray-800/50 ${
                  isActive ? "bg-gray-800" : "hover:bg-gray-800/40"
                }`}
              >
                <div className="mt-1">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 ${isActive ? "border-blue-500" : "border-gray-700"}`}></div>
                  )}
                </div>
                <div className="flex-grow">
                   <p className={`text-sm font-bold leading-tight mb-1 ${isActive ? "text-blue-500" : "text-gray-300"}`}>
                      {index + 1}. {lecture.title}
                   </p>
                   <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                      </svg>
                      <span className="text-[10px] text-gray-500 font-medium">Video • {Math.floor(lecture.duration / 60)}m</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-6 bg-gray-900 border-t border-gray-800">
           <button 
             onClick={() => navigate("/user-dashboard")}
             className="w-full py-3 bg-gray-800 text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-700 transition-all active:scale-95"
           >
              Back to Dashboard
           </button>
        </div>
      </div>
    </div>
  );
}

export default LearningView;
