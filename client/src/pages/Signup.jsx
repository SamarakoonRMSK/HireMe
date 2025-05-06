import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Select,
  Datepicker,
  FileInput,
  Textarea,
  Checkbox,
} from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleCheckboxChange = (e) => {
    const vTypeArray = Array.isArray(formData.vType) ? formData.vType : [];

    if (e.target.checked) {
      setFormData({
        ...formData,
        vType: [...vTypeArray, e.target.value],
      });
    } else {
      setFormData({
        ...formData,
        vType: vTypeArray.filter((item) => item !== e.target.value),
      });
    }
  };
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Plese select the image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, policeReport: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      imageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.fullName
    ) {
      return setErrorMessage("Please fill out all fields");
    }
    if (formData.role === "driver") {
      if (
        !formData.address ||
        !formData.licenceNumber ||
        !formData.policeReport ||
        !formData.vType ||
        !formData.about ||
        !formData.dob
      ) {
        return setErrorMessage("Please fill out all fields");
      }
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return setErrorMessage(data.message);
        }
        setLoading(false);
        if (res.ok) {
          navigate("/signin");
        }
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        setErrorMessage(null);
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return setErrorMessage(data.message);
        }
        setLoading(false);
        if (res.ok) {
          navigate("/signin");
        }
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen pt-10 ">
      <div className="flex flex-col max-w-4xl md:flex-row md:items-center mx-auto p-3 px-5 gap-5 ">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex  flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label value="Your full name" />
              </div>
              <TextInput
                id="fullName"
                type="text"
                placeholder="Saman Kumarasiri"
                required
                onChange={handleChange}
              />
            </div>
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
                <Label value="Your username" />
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
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
            <div>
              <div className="mb-2 block">
                <Label htmlFor="countries" value="Why do you came here" />
              </div>
              <Select id="role" required onChange={handleChange}>
                <option value="customer">Hire Driver</option>
                <option value="driver">Work</option>
              </Select>
            </div>
            {formData.role === "driver" && (
              <div className="flex  flex-col gap-4">
                <div className="mb-2 block">
                  <Label value="Driver police report" />
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Button
                    type="button"
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    outline
                    onClick={handleUploadImage}
                  >
                    {imageUploadProgress ? (
                      <div className="w-16 h-16">
                        <CircularProgressbar
                          value={imageUploadProgress}
                          text={`${imageUploadProgress || 0}%`}
                        />
                      </div>
                    ) : (
                      "Upload File"
                    )}
                  </Button>
                </div>
                {imageUploadError && (
                  <Alert color="failure">{imageUploadError}</Alert>
                )}

                <div>
                  <div className="mb-2 block">
                    <Label value="Hour rate" />
                  </div>
                  <TextInput
                    id="perHour"
                    type="number"
                    placeholder="Per Hour"
                    required
                    onChange={handleChange}
                    addon="Rs."
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Your address" />
                  </div>
                  <TextInput
                    id="address"
                    type="text"
                    placeholder="address"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Date of birth" />
                  </div>
                  <Datepicker
                    onSelectedDateChanged={(date) => {
                      const dob =
                        date.getFullYear() +
                        "-" +
                        date.getMonth() +
                        "-" +
                        date.getDate();

                      setFormData({ ...formData, dob });
                    }}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Select Vehicle type" />
                  </div>
                  <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row gap-2">
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="Bike"
                        value="Bike"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">Bike</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="Rickshaw"
                        value="Rickshaw"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">Rickshaw</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="Car"
                        value="Car"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">Car</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="Van"
                        value="Van"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">Van</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="Bus"
                        value="Bus"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">Bus</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="Truck"
                        value="Truck"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">Truck</Label>
                    </div>
                    {/* <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="CE"
                        value="CE"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">CE</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="D1"
                        value="D1"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">D1</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="D"
                        value="D"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">D</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="DE"
                        value="DE"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">DE</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="G1"
                        value="G1"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">G1</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="G"
                        value="G"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">G</Label>
                    </div>
                    <div className="flex sm:justify-center items-center">
                      <Checkbox
                        id="J"
                        value="J"
                        onChange={handleCheckboxChange}
                      />
                      <Label className="ml-2">J</Label>
                    </div> */}
                  </div>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Your Licence Number" />
                  </div>
                  <TextInput
                    id="licenceNumber"
                    type="text"
                    placeholder="Licence Number"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="About" />
                  </div>
                  <Textarea
                    id="about"
                    className="mb-2"
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Label className="flex">
              Do you have an account?&nbsp;
              <Link
                to="/signin"
                className="text-cyan-600 hover:underline dark:text-cyan-500"
              >
                sign in
              </Link>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
