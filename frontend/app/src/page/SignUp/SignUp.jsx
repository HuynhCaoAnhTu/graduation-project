import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validationEmail } from "../../utills/helper";
import axiosInstance from "../../utills/axiosInstance";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!validationEmail(email)) {
      setError("Please enter valid email");
      return;
    }

    if (!password) {
      setError("Please enter password");
      return;
    }

    if (password != confirmPass) {
      setError("Password is wrong");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle success login response

      if (response.data) {
        navigate("/login");
      }
      if (response.data && response.data.error) {
        setError(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
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
            <h4 className=" text-2xl mb-7">Sigh Up</h4>
            <input
              type="text"
              className="input-box"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

            <PasswordInput
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder={"Confirm Password"}
            ></PasswordInput>

            {error && <p className="text-red-600 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already have account ? {""}
              <Link to="/login" className="text-md text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
