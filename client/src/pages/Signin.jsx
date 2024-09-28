import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import sign from "../assets/sign.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../store/user/userSlice";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector(
    (state) => state.userSlice
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("All fields are required"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen pt-20 ">
      <div className="flex flex-col max-w-5xl md:flex-row md:items-center mx-auto p-3 px-5 gap-10 ">
        <div className="flex-1">
          <img src={sign} alt="" />
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex  flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label value="Your email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="example@gmail.com"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label value="Your password" />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="Password"
                required
                onChange={handleChange}
              />
            </div>

            <Button gradientDuoTone="purpleToBlue" type="submit">
              {loading ? (
                <>
                  <Spinner aria-label="Spinner button example" size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            {errorMessage && (
              <Alert color="failure" rounded>
                <span className="font-medium">{errorMessage}</span>
              </Alert>
            )}
          </form>
          <div className="flex items-center gap-2 mt-2">
            <Label className="flex">
              Don't Have an account?&nbsp;
              <Link
                to="/signup"
                className="text-cyan-600 hover:underline dark:text-cyan-500"
              >
                sign up
              </Link>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
