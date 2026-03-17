import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  formCard,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  formTitle,
  errorClass,
  divider
} from "../styles/common";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onRegister = async (newUser) => {
    let url = "";
    const { role, ...user } = newUser;

    if (role === "Student") {
      url = "http://localhost:3000/student-api/register";
    } else if (role === "Instructor") {
      url = "http://localhost:3000/instructor-api/register";
    }

    setLoading(true);
    try {
      let response = await axios.post(url, user, {
        withCredentials: true,
      });

      let res = response.data;

      if (res.status === 201) {
        navigate("/login");
      } else {
        setError("Failed to add user. Please try again.");
      }
    } catch (err) {
      setError("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Adding user...</div>;
  }

  return (
    <div className="mt-16 px-4">

      <form onSubmit={handleSubmit(onRegister)} className={formCard}>

        <h1 className={formTitle}>Create Account</h1>
        <div className={divider}></div>

        {/* Error */}
        {error && <div className={`${errorClass} mb-4`}>{error}</div>}

        {/* Role */}
        <div className={formGroup}>
          <label className={labelClass}>Role</label>
          <div className="flex gap-6 mt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                value="Instructor"
                {...register("role", { required: true })}
              />
              Instructor
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                value="Student"
                {...register("role", { required: true })}
              />
              Student
            </label>
          </div>
          {errors.role && <p className="text-red-500 text-xs mt-1">Role is required</p>}
        </div>

        {/* First Name */}
        <div className={formGroup}>
          <label className={labelClass}>First Name</label>
          <input
            {...register("firstName", { required: true, minLength: 4, maxLength: 10 })}
            className={inputClass}
            placeholder="Enter first name"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">Invalid first name</p>}
        </div>

        {/* Last Name */}
        <div className={formGroup}>
          <label className={labelClass}>Last Name</label>
          <input
            {...register("lastName", { required: true, minLength: 4, maxLength: 10 })}
            className={inputClass}
            placeholder="Enter last name"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">Invalid last name</p>}
        </div>

        {/* Email */}
        <div className={formGroup}>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className={inputClass}
            placeholder="Enter email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">Email required</p>}
        </div>

        {/* Password */}
        <div className={formGroup}>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className={inputClass}
            placeholder="Enter password"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">Password required</p>}
        </div>

        {/* Profile Image */}
        <div className={formGroup}>
          <label className={labelClass}>Profile Image URL</label>
          <input
            {...register("profileImageUrl")}
            className={inputClass}
            placeholder="Optional"
          />
        </div>

        {/* Submit */}
        <button type="submit" className={submitBtn}>
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;