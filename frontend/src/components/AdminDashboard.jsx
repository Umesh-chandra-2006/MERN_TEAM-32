import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { api } from "../store/useAuth";
import { toast } from "react-hot-toast";

function AdminDashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      setMembersLoading(true);
      try {
        const [statsResponse, membersResponse] = await Promise.all([
          api.get("/admin-api/stats"),
          api.get("/admin-api/users"),
        ]);

        setStats(statsResponse.data.payload);
        setMembers(membersResponse.data.payload || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load admin statistics");
      } finally {
        setLoading(false);
        setMembersLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const students = members.filter((member) => member.role === "STUDENT");
  const instructors = members.filter((member) => member.role === "INSTRUCTOR");

  const statCards = [
    { label: "Total Students", value: stats?.totalUsers ?? 0 },
    { label: "Total Instructors", value: stats?.totalInstructors ?? 0 },
    { label: "Total Courses", value: stats?.totalCourses ?? 0 },
    { label: "Students Enrolled", value: stats?.totalStudentsEnrolled ?? 0 },
    { label: "Platform Rating", value: stats?.averagePlatformRating ?? 0 },
  ];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-8">
          <div className="h-4 w-44 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-10 w-80 animate-pulse rounded-2xl bg-slate-200" />
          <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[3rem] border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="mx-auto h-10 w-32 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-500">Admin dashboard</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">System overview</h1>
        <p className="mt-3 text-slate-600">Monitor the platform and keep the learning environment running smoothly.</p>
      </div>

      <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950">Welcome, {currentUser?.firstName}!</h2>
            <p className="text-slate-500">Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="mb-1 text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-3xl font-black text-slate-950">{stat.label === "Platform Rating" ? `${stat.value}` : stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Student accounts</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">Users</h3>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
                {students.length}
              </div>
            </div>

            {membersLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-200/70" />
                ))}
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student._id} className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white px-4 py-4 shadow-sm">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-950">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="truncate text-xs font-medium text-slate-500">{student.email}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-blue-700">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      Student
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                No student accounts found.
              </div>
            )}
          </section>

          <section className="rounded-[2.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Instructor accounts</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">Instructors</h3>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
                {instructors.length}
              </div>
            </div>

            {membersLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-200/70" />
                ))}
              </div>
            ) : instructors.length > 0 ? (
              <div className="space-y-3">
                {instructors.map((instructor) => (
                  <div key={instructor._id} className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white px-4 py-4 shadow-sm">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-950">
                        {instructor.firstName} {instructor.lastName}
                      </p>
                      <p className="truncate text-xs font-medium text-slate-500">{instructor.email}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Instructor
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
                No instructor accounts found.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
    