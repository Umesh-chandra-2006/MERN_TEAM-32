import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api, useAuth } from "../store/useAuth";
import { CourseCardSkeleton } from "./Skeleton";

function Home() {
  const currentUser = useAuth((state) => state.currentUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const [latestCourses, setLatestCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const courseCategories = [...new Set(latestCourses.map((course) => course.category).filter(Boolean))].slice(0, 6);
  const spotlightCourse = latestCourses[0];
  const dashboardPath = currentUser?.role === "ADMIN"
    ? "/admin-dashboard"
    : currentUser?.role === "INSTRUCTOR"
      ? "/instructor-dashboard"
      : "/user-dashboard";

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await api.get("/student-api/courses?limit=4");
        setLatestCourses(res.data.payload);
      } catch (err) {
        console.error("Failed to fetch latest courses", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  return (
    <div className="relative overflow-hidden">
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-slate-600 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {isAuthenticated ? `Welcome back, ${currentUser?.firstName || "there"}` : "Fresh courses, cleaner experience"}
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              {isAuthenticated
                ? "Continue learning with a platform that stays out of the way."
                : "Learn with a platform that feels built, not templated."}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {isAuthenticated
                ? "Your dashboards, courses, and lecture progress are all in one place. Pick up where you left off, or jump into a new course."
                : "SunStk brings students, instructors, and admins into one focused learning space with course browsing, video streaming, progress tracking, and clean role-based dashboards."}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5"
                  >
                    Go to dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-950"
                  >
                    Update profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5"
                  >
                    Start learning free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-950"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {isAuthenticated
                ? [
                    ["Your dashboard", "Jump straight into your role-based workspace"],
                    ["Your progress", "Pick up from the last lecture you completed"],
                    ["Your profile", "Keep your account details current"],
                  ]
                : [
                    ["Role-based", "Student, instructor, and admin views"],
                    ["Streaming", "HLS video support for lectures"],
                    ["Progress", "Track course completion cleanly"],
                  ]
              .map(([title, text]) => (
                <div key={title} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                  <p className="text-sm font-bold text-slate-950">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500">What you can do here</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">A learning space with structure</h2>
              <p className="mt-3 text-slate-600">
                Browse courses, open lecture videos, and stay on track without jumping through extra screens.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
              {loading ? "Loading current catalog..." : `${latestCourses.length} newest courses loaded`}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Find a path",
                text: "Explore courses by category and open the ones that match your goal.",
              },
              {
                title: "Watch deeply",
                text: "Lecture playback is built for HLS streaming, progress, and continuity.",
              },
              {
                title: "Keep moving",
                text: "Role-based dashboards keep the next action obvious for each user.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-950/15">
                  {item.title.charAt(0)}
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#0f172a,#111827)] p-6 text-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.55)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Spotlight</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight">{spotlightCourse ? spotlightCourse.title : "Featured course"}</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                {spotlightCourse
                  ? `Learn from ${spotlightCourse.instructor?.firstName || "your instructor"} ${spotlightCourse.instructor?.lastName || ""} and get a course built for practical progress.`
                  : "Once instructors publish courses, the strongest recent course will appear here automatically."}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Format</p>
                  <p className="mt-2 text-lg font-black text-white">Lecture-based</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Access</p>
                  <p className="mt-2 text-lg font-black text-white">Role-aware</p>
                </div>
              </div>

              {spotlightCourse && (
                <button
                  onClick={() => navigate(`/course/${spotlightCourse._id}`)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                >
                  Open spotlight course
                </button>
              )}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">Browse by focus</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Popular categories</h3>
                </div>
                <div className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                  Live
                </div>
              </div>

              {courseCategories.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {courseCategories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Categories will appear here once courses are published.
                </div>
              )}

              <div className="mt-8 rounded-[1.75rem] bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-950">Why it feels fuller</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The page now uses course data in multiple places, adds context blocks, and gives the eye more places to land.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500">Featured content</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Latest courses</h2>
            <p className="mt-3 text-slate-600">Handpicked courses and instructors to keep the catalog fresh and useful.</p>
          </div>
          <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-950">
            Explore all courses
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              [...Array(4)].map((_, i) => <CourseCardSkeleton key={i} />)
            ) : latestCourses.length > 0 ? (
              latestCourses.map((course) => (
                <div 
                  key={course._id} 
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/85 shadow-[0_18px_60px_-44px_rgba(15,23,42,0.45)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_80px_-36px_rgba(15,23,42,0.45)]"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                     <img 
                       src={course.thumbnailUrl || "https://placehold.co/600x400?text=Course"} 
                       alt={course.title}
                       className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 shadow-sm backdrop-blur-md">
                           {course.category}
                        </span>
                     </div>
                  </div>
                  <div className="flex-grow p-6">
                     <h3 className="mb-3 text-lg font-black leading-tight text-slate-950 transition-colors group-hover:text-blue-700 line-clamp-2">
                        {course.title}
                     </h3>
                     <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-xs font-black text-blue-700">
                           {course.instructor?.firstName?.[0]}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                           {course.instructor?.firstName} {course.instructor?.lastName}
                        </span>
                     </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
                     <div className="flex items-center gap-1 text-amber-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-black italic">{course.averageRating || "0.0"}</span>
                     </div>
                     <span className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">Learn more →</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-[2.5rem] border border-slate-200 bg-white/80 p-10 text-center shadow-sm backdrop-blur sm:p-16">
                <h3 className="text-2xl font-black tracking-tight text-slate-950">No courses available yet</h3>
                <p className="mx-auto mt-3 max-w-xl text-slate-500">Once instructors publish courses, they will appear here automatically.</p>
              </div>
            )}
          </div>
      </section>
    </div>
  );
}

export default Home;
