import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "STUDENT"
    }
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onRegister = async (newUser) => {
    setLoading(true);
    try {
      const apiPath = newUser.role === "STUDENT" ? "student-api" : "instructor-api";
      let response = await axios.post(
        `http://localhost:3000/${apiPath}/users`,
        newUser
      );

      if (response.status === 201) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
      console.error("Error during registration: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-15 p-4 w-96 mx-auto text-center">
      <h1 className="text-2xl mb-4 font-semibold">Registration Form</h1>
      <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
          {/* Role Selection */}
          <div className="flex justify-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="STUDENT"
                {...register("role")}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Student</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="INSTRUCTOR"
                {...register("role")}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Instructor</span>
            </label>
          </div>

          <div className="space-y-1 text-left">
            <input
              type="text"
              {...register("firstName", { required: "First name is required", minLength: { value: 3, message: "Min length 3" } })}
              placeholder="First Name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-1 text-left">
            <input
              type="text"
              {...register("lastName", { required: "Last name is required", minLength: { value: 3, message: "Min length 3" } })}
              placeholder="Last Name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
          </div>

          <div className="space-y-1 text-left">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-1 text-left">
            <input
              type="password"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min length 6" } })}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <div className="space-y-1 text-left">
            <input
              type="text"
              {...register("profileImageUrl")}
              placeholder="Profile Image URL"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
