import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { api } from "../store/useAuth";
import axios from "axios";
import { toast } from "react-hot-toast";

function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!courseId;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState({ index: null, progress: 0, status: "" });
  const [pollingLectures, setPollingLectures] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      thumbnailUrl: "",
      price: 0,
      status: "DRAFT",
      lectures: [{ title: "", duration: 0, processingStatus: "pending" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lectures",
  });

  const courseStatus = watch("status");

  useEffect(() => {
    if (isEditMode) {
      async function fetchCourse() {
        try {
          const res = await api.get(`/instructor-api/courses/${courseId}`);
          reset(res.data.payload);
          
          // Identify lectures that are currently processing
          const processingIds = res.data.payload.lectures
            .filter(l => l.processingStatus === "processing")
            .map(l => l._id);
          if (processingIds.length > 0) {
            setPollingLectures(processingIds);
          }
        } catch (_err) {
          toast.error("Failed to load course");
          navigate("/instructor-dashboard");
        } finally {
          setLoading(false);
        }
      }
      fetchCourse();
    }
  }, [courseId, isEditMode, reset, navigate]);

  // Polling logic for video processing
  useEffect(() => {
    if (pollingLectures.length === 0) return;

    const intervalId = setInterval(async () => {
      const updatedPolling = [...pollingLectures];
      let hasChanges = false;

      for (const lectureId of pollingLectures) {
        try {
          const res = await api.get(`/instructor-api/courses/${courseId}/lectures/${lectureId}/status`);
          const { processingStatus, videoUrl } = res.data.payload;

          if (processingStatus !== "processing") {
            // Update form state surgically
            const currentLectures = getValues("lectures");
            const lectureIndex = currentLectures.findIndex(l => l._id === lectureId);
            if (lectureIndex !== -1) {
              setValue(`lectures.${lectureIndex}.processingStatus`, processingStatus);
              setValue(`lectures.${lectureIndex}.videoUrl`, videoUrl);
            }

            // Remove from polling
            const indexToRemove = updatedPolling.indexOf(lectureId);
            if (indexToRemove !== -1) {
              updatedPolling.splice(indexToRemove, 1);
              hasChanges = true;
            }

            if (processingStatus === "completed") {
              toast.success("Video processing complete!");
            } else if (processingStatus === "failed") {
              toast.error("Video processing failed.");
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }

      if (hasChanges) {
        setPollingLectures(updatedPolling);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [pollingLectures, courseId, setValue, getValues]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await api.post("/instructor-api/courses", data);
      toast.success(isEditMode ? "Course updated!" : "Course created!");
      
      // If it's a new course, stay in edit mode to upload videos
      if (!isEditMode) {
        navigate(`/edit-course/${res.data.payload._id}`);
      } else {
        // If published, go back to dashboard
        if (data.status === "PUBLISHED") {
          navigate("/instructor-dashboard");
        } else {
          // Identify newly added processing lectures after save
          const processingIds = res.data.payload.lectures
            .filter(l => l.processingStatus === "processing")
            .map(l => l._id);
          setPollingLectures(prev => [...new Set([...prev, ...processingIds])]);
          
          reset(res.data.payload);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  const handleVideoUpload = async (index, lectureId, file) => {
    if (!lectureId) {
      toast.error("Please save the course first before uploading videos");
      return;
    }
    if (!file) return;

    setUploadingStatus({ index, progress: 0, status: "Getting upload URL..." });

    try {
      // 1. Get Presigned URL
      const urlRes = await api.get(
        `/instructor-api/courses/${courseId}/lectures/${lectureId}/upload-url`
      );
      const { uploadUrl, s3Key } = urlRes.data.payload;

      // 2. Upload directly to S3
      setUploadingStatus({ index, progress: 0, status: "Uploading to S3..." });
      await axios.put(uploadUrl, file, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadingStatus(prev => ({ 
            ...prev, 
            progress: percentCompleted,
            status: percentCompleted === 100 ? "Finalizing upload..." : "Uploading to S3..."
          }));
        }
      });

      // 3. Trigger Backend Processing (returns 202 - processing in background)
      setUploadingStatus({ index, progress: 100, status: "Starting background processing..." });
      await api.post(
        `/instructor-api/courses/${courseId}/lectures/${lectureId}/process-video`,
        { s3Key }
      );

      // Start polling for this lecture
      setPollingLectures(prev => [...new Set([...prev, lectureId])]);
      
      // Update local form state to processing
      setValue(`lectures.${index}.processingStatus`, "processing");

      // Clear the uploading status
      setUploadingStatus({ index: null, progress: 0, status: "" });
      
      toast.success("Upload successful! Video is being processed.");
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Video upload failed");
      setUploadingStatus({ index: null, progress: 0, status: "" });
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading course editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            {isEditMode ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Fill in the details below to {isEditMode ? "update your" : "publish a new"} course.
          </p>
        </div>
        {isEditMode && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-2xl border border-gray-200">
            <span className={`w-2 h-2 rounded-full ${courseStatus === "PUBLISHED" ? "bg-green-500" : "bg-yellow-500"}`}></span>
            <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">{courseStatus}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Basic Info Section */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100 space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm">1</span>
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Course Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                placeholder="e.g. Advanced Web Development"
              />
              {errors.title && <p className="text-xs text-red-500 font-bold ml-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
              <input
                {...register("category", { required: "Category is required" })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                placeholder="e.g. Programming"
              />
              {errors.category && <p className="text-xs text-red-500 font-bold ml-1">{errors.category.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows="4"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium resize-none"
                placeholder="What will students learn in this course?"
              />
              {errors.description && <p className="text-xs text-red-500 font-bold ml-1">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Price ($)</label>
              <input
                type="number"
                {...register("price", { required: "Price is required", min: 0 })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm">2</span>
              Course Curriculum
            </h2>
            <button
              type="button"
              onClick={() => append({ title: "", duration: 0 })}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Lecture
            </button>
          </div>

          {!isEditMode && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Uploading Videos</h4>
                <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                  You can upload high-quality videos for each lecture <strong>after</strong> you save this course for the first time. 
                  Our system will automatically transcode them for smooth streaming once uploaded.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  <div className="md:col-span-7 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Lecture {index + 1} Title</label>
                    <input
                      {...register(`lectures.${index}.title`, { required: "Required" })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm"
                      placeholder="e.g. Introduction to the course"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Duration (sec)</label>
                    <input
                      type="number"
                      {...register(`lectures.${index}.duration`)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="w-full py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {isEditMode && field._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700 font-bold">
                            {watch(`lectures.${index}.processingStatus`) === "completed" ? "Video Ready" : 
                             watch(`lectures.${index}.processingStatus`) === "processing" ? "Transcoding..." :
                             watch(`lectures.${index}.processingStatus`) === "failed" ? "Processing Failed" :
                             "No video uploaded"}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {watch(`lectures.${index}.processingStatus`) === "completed" ? "HLS stream active" : 
                             watch(`lectures.${index}.processingStatus`) === "processing" ? "Converting to adaptive stream" :
                             watch(`lectures.${index}.processingStatus`) === "failed" ? "Try uploading again" :
                             "Upload a raw .mp4 file"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Badge */}
                        {watch(`lectures.${index}.processingStatus`) && watch(`lectures.${index}.processingStatus`) !== "pending" && (
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            watch(`lectures.${index}.processingStatus`) === "completed" ? "bg-green-100 text-green-600" :
                            watch(`lectures.${index}.processingStatus`) === "processing" ? "bg-blue-100 text-blue-600 animate-pulse" :
                            "bg-red-100 text-red-600"
                          }`}>
                            {watch(`lectures.${index}.processingStatus`)}
                          </span>
                        )}

                        <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          uploadingStatus.index === index || watch(`lectures.${index}.processingStatus`) === "processing" 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 shadow-sm"
                        }`}>
                          {watch(`lectures.${index}.processingStatus`) === "completed" ? "Replace Video" : "Upload Video"}
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleVideoUpload(index, field._id, e.target.files[0])}
                            disabled={uploadingStatus.index !== null || watch(`lectures.${index}.processingStatus`) === "processing"}
                          />
                        </label>
                      </div>
                    </div>

                    
                    {uploadingStatus.index === index && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500">
                          <span>{uploadingStatus.status}</span>
                          <span>{uploadingStatus.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${uploadingStatus.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-end gap-6 pt-8">
          <button
            type="button"
            onClick={() => navigate("/instructor-dashboard")}
            className="px-8 py-4 font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          
          {courseStatus === "PUBLISHED" ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setValue("status", "DRAFT");
                handleSubmit(onSubmit)();
              }}
              className="px-8 py-4 border-2 border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
            >
              Unpublish & Set to Draft
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setValue("status", "DRAFT");
                handleSubmit(onSubmit)();
              }}
              className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-gray-900 transition-all active:scale-95 disabled:opacity-50"
            >
              Save as Draft
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => {
              setValue("status", "PUBLISHED");
              handleSubmit(onSubmit)();
            }}
            className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
          >
            {saving 
              ? "Saving..." 
              : courseStatus === "PUBLISHED" 
                ? "Update Changes" 
                : isEditMode 
                  ? "Update & Publish" 
                  : "Publish Course"
            }
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseEditor;
