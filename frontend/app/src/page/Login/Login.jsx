import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validationEmail } from "../../utills/helper";
import axiosInstance from "../../utills/axiosInstance";
import { useEffect } from "react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validationEmail(email)) {
      setError("Please enter valid email");
      return;
    }

    if (!password) {
      setError("Please enter password");
      return;
    }

    setError("");

    // Login API
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Handle success login response

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
        window.onload()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.accessToken
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className=" text-2xl mb-7">Login</h4>
            <input
              type="text"
              className="input-box"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></PasswordInput>

            {error && <p className="text-red-600 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not resgister yet ? {""}
              <Link to="/signup" className="text-md text-primary underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
