import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { toast } from "react-hot-toast";

function Profile() {
  const { currentUser, updateProfile, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    profileImageUrl: currentUser?.profileImageUrl || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        <div className="relative overflow-hidden bg-[linear-gradient(160deg,#0f172a,#1d4ed8)] px-8 py-12 text-white">
          <div className="relative z-10">
            <h1 className="mb-2 text-3xl font-black">My Profile</h1>
            <p className="font-medium text-blue-100">Manage your personal information and account settings.</p>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 p-8 md:p-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
             <div className="relative group">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white bg-slate-50 shadow-xl shadow-slate-950/10">
                   {formData.profileImageUrl ? (
                     <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-4xl font-black text-blue-700">
                        {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                     </span>
                   )}
                </div>
             </div>
             
             <div className="flex-grow space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-[0.22em] text-slate-400">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="ml-1 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Email Address (Read Only)</label>
                  <input
                    type="email"
                    value={currentUser?.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-5 py-4 font-bold text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-black uppercase tracking-[0.22em] text-slate-400">Profile Image URL</label>
                  <input
                    type="text"
                    name="profileImageUrl"
                    value={formData.profileImageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-900 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
             </div>
          </div>
          
          <div className="flex justify-end border-t border-slate-100 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-slate-950 px-10 py-4 font-black text-white shadow-xl shadow-slate-950/15 transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
