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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-50 border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 px-8 py-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">My Profile</h1>
            <p className="text-blue-100 font-medium">Manage your personal information and account settings.</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
             <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] bg-blue-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                   {formData.profileImageUrl ? (
                     <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-4xl font-black text-blue-600">
                        {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                     </span>
                   )}
                </div>
             </div>
             
             <div className="flex-grow space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address (Read Only)</label>
                  <input
                    type="email"
                    value={currentUser?.email}
                    disabled
                    className="w-full px-5 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-bold cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Profile Image URL</label>
                  <input
                    type="text"
                    name="profileImageUrl"
                    value={formData.profileImageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  />
                </div>
             </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
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
