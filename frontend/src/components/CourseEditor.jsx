import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";

function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!courseId;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(null); // stores lecture index being uploaded

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      price: 0,
      lectures: [{ title: "", duration: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lectures",
  });

  useEffect(() => {
    if (isEditMode) {
      async function fetchCourse() {
        try {
          // Note: Using student-api for details is fine if it returns full details
          // but usually instructors need a specific endpoint to get their own course with video URLs
          const res = await axios.get(`http://localhost:3000/student-api/courses/${courseId}`, {
            withCredentials: true,
          });
          reset(res.data.payload.course);
        } catch (err) {
          toast.error("Failed to load course");
          navigate("/instructor-dashboard");
        } finally {
          setLoading(false);
        }
      }
      fetchCourse();
    }
  }, [courseId, isEditMode, reset, navigate]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEditMode) {
        // Implement PUT /instructor-api/courses/:courseId if needed
        toast.success("Course update logic coming soon!");
      } else {
        const res = await axios.post("http://localhost:3000/instructor-api/courses", data, {
          withCredentials: true,
        });
        toast.success("Course created successfully!");
        navigate("/instructor-dashboard");
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

    setUploadingVideo(index);
    const formData = new FormData();
    formData.append("video", file);

    try {
      await axios.post(
        `http://localhost:3000/instructor-api/courses/${courseId}/lectures/${lectureId}/video`,
        formData,
        { withCredentials: true }
      );
      toast.success("Video uploaded and transcoded!");
      // Optionally refresh data
    } catch (err) {
      toast.error("Video upload failed");
    } finally {
      setUploadingVideo(null);
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
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          {isEditMode ? "Edit Course" : "Create New Course"}
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Fill in the details below to {isEditMode ? "update your" : "publish a new"} course.
        </p>
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
                  <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {field.videoUrl ? "Video uploaded" : "No video uploaded yet"}
                      </span>
                    </div>
                    <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${uploadingVideo === index ? "bg-gray-100 text-gray-400" : "bg-white border border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 shadow-sm"}`}>
                      {uploadingVideo === index ? "Uploading..." : "Upload Video"}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => handleVideoUpload(index, field._id, e.target.files[0])}
                        disabled={uploadingVideo !== null}
                      />
                    </label>
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
          <button
            type="submit"
            disabled={saving}
            className="px-12 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
          >
            {saving ? "Saving..." : isEditMode ? "Update Course" : "Publish Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseEditor;
