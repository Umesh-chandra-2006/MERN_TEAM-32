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
} from "../styles/common";

function Register() {
  const {
    register,
    handleSubmit,
    //setError,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onRegister = async (newUser) => {
    setLoading(true);
    try {
      console.log("New user data: ", newUser);
      let response = await axios.post(
        "http://localhost:3000/common-api/register",
        newUser,
        { withCredentials: true },
      );
      console.log("Response object is: ", response);

      let res = await response.data;

      if (response.status === 201) {
        //User created successfully, navigate to users page
        navigate("/login");
      } else {
        setError("Failed to add user. Please check the input and try again.");
        console.log(response);
      }
    } catch (error) {
      setError("Failed to add user. Please try again.");
      console.error("Error during registration: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Adding user...</div>;
  }
  if (error !== null) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="mt-15 p-4  w-96 mx-auto text-center">
      <h1 className="text-2xl mb-2">User Registration Form </h1>
      <div className=" p-4">
        <form onSubmit={handleSubmit(onRegister)}>
          <div className="mb-3 ">
            <label className="mr-3">Role:</label>
            <input
              type="radio"
              value="author"
              {...register("role", { required: true })}
              className="mr-1"
            />
            Author
            <input
              type="radio"
              value="user"
              {...register("role", { required: true })}
              className="mx-1"
            />
            User
            {errors.role?.type === "required" && (
              <p className="text-red-500">Role is required</p>
            )}
          </div>
          <div className="mb-3 ">
            <input
              type="text"
              {...register("firstName", {
                required: true,
                minLength: 4,
                maxLength: 6,
              })}
              placeholder="firstName"
              className="bg-gray-300 p-2"
            />
            {errors.firstName?.type === "required" && (
              <p className="text-red-500">First Name required</p>
            )}
            {errors.firstName?.type === "minLength" && (
              <p className="text-red-500">Min Length is 4</p>
            )}
            {errors.firstName?.type === "maxLength" && (
              <p className="text-red-500">Max Length is 6</p>
            )}
          </div>
          <div className="mb-3">
            <input
              type="text"
              {...register("lastName", {
                required: true,
                minLength: 4,
                maxLength: 6,
              })}
              placeholder="lastName"
              className="bg-gray-300 p-2"
            />
            {errors.lastName?.type === "required" && (
              <p className="text-red-500">Last Name required</p>
            )}
            {errors.lastName?.type === "minLength" && (
              <p className="text-red-500">Min Length is 4</p>
            )}
            {errors.lastName?.type === "maxLength" && (
              <p className="text-red-500">Max Length is 6</p>
            )}
          </div>
          <div className="mb-3">
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className="bg-gray-300 p-2"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500">Email required</p>
            )}
          </div>
          <div className="mb-3">
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="password"
              className="bg-gray-300 p-2"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500">password required</p>
            )}
          </div>
          <div className="mb-3">
            <input
              type="text"
              {...register("profileImageUrl")}
              placeholder="Profile Image URL"
              className="bg-gray-300 p-2 "
            />
          </div>
          <button
            type="submit"
            className="border-2 p-2 rounded-md bg-blue-500 text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

/*
const createUser = async (newUser) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (response.status === 201)
        //User created successfully, navigate to users page
        navigate("/users");
      else
        setError("Failed to add user. Please check the input and try again.");
    } catch (error) {
      console.log(response);
      setError("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Adding user...</div>;
  }
  if (error !== null) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

*/
