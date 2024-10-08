import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  Alert,
  Button,
  Checkbox,
  Datepicker,
  FileInput,
  Label,
  Textarea,
  TextInput,
} from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../store/user/userSlice";

export default function DashProfile() {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageReportUrl, setImageReportUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [reportUploadError, setReportUploadError] = useState(null);

  const [reportUploadProgress, setReportUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [reportFileUploading, setReportFileUploading] = useState(false);

  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);

  const dispatch = useDispatch();

  const imagePickerRef = useRef();
  const { currentUser, error, loading } = useSelector(
    (state) => state.userSlice
  );

  const handleCheckboxChange = (e) => {
    const vTypeArray = Array.isArray(formData.vType)
      ? formData.vType
      : currentUser.vType;

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("File must be less than 4MB");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
          setImageFile(null);
        });
      }
    );
  };

  const handleUploadReport = async () => {
    setReportFileUploading(true);
    setReportUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + reportFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, reportFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setReportUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setReportUploadError("File must be less than 4MB");
        setReportUploadProgress(null);
        setReportFile(null);
        setImageReportUrl(null);
        setReportFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageReportUrl(downloadURL);
          setFormData({ ...formData, policeReport: downloadURL });
          setReportFileUploading(false);
          setReportFile(null);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("There are no any changes");
      return;
    }
    setFormData({ ...formData, role: currentUser.role });
    if (imageFileUploading || reportFileUploading) {
      setUpdateUserError("Please wait for image upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile update sucessfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  console.log(formData);

  return (
    <div className="md:max-w-3xl max-w-sm mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-7">
        <input
          type="file"
          hidden
          ref={imagePickerRef}
          accept="image/*"
          onChange={handleImageChange}
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => imagePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0",
                  left: "0",
                },
                path: {
                  stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 object-cover border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }
            `}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          id="fullName"
          type="text"
          placeholder="full Name"
          defaultValue={currentUser.fullName}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        {currentUser &&
          currentUser.role === "driver" &&
          !currentUser.isVerify && (
            <>
              <img
                className="w-full h-[50vh] object-cover"
                src={imageReportUrl || currentUser.policeReport}
              />
              <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReportFile(e.target.files[0])}
                />
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  size="sm"
                  outline
                  onClick={handleUploadReport}
                >
                  {reportUploadProgress ? (
                    <div className="w-16 h-16">
                      <CircularProgressbar
                        value={reportUploadProgress}
                        text={`${reportUploadProgress || 0}%`}
                      />
                    </div>
                  ) : (
                    "Upload File"
                  )}
                </Button>
              </div>
              {reportUploadError && (
                <Alert color="failure">{reportUploadError}</Alert>
              )}
            </>
          )}
        {currentUser && currentUser.role === "driver" && (
          <>
            <TextInput
              id="address"
              type="text"
              placeholder="address"
              defaultValue={currentUser.address}
              onChange={handleChange}
            />
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
            <Label value="Select Vehicle type" />
            <div className="flex flex-col sm:items-center sm:justify-between sm:flex-row gap-2">
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="A1"
                  value="A1"
                  defaultChecked={currentUser.vType.includes("A1")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">A1</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="A"
                  value="A"
                  defaultChecked={currentUser.vType.includes("A")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">A</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="B1"
                  value="B1"
                  defaultChecked={currentUser.vType.includes("B1")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">B1</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="B"
                  value="B"
                  defaultChecked={currentUser.vType.includes("B")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">B</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="C1"
                  value="C1"
                  defaultChecked={currentUser.vType.includes("C1")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">C1</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="C"
                  value="C"
                  defaultChecked={currentUser.vType.includes("C")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">C</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="CE"
                  value="CE"
                  defaultChecked={currentUser.vType.includes("CE")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">CE</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="D1"
                  value="D1"
                  defaultChecked={currentUser.vType.includes("D1")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">D1</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="D"
                  value="D"
                  defaultChecked={currentUser.vType.includes("D")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">D</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="DE"
                  value="DE"
                  defaultChecked={currentUser.vType.includes("DE")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">DE</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="G1"
                  value="G1"
                  defaultChecked={currentUser.vType.includes("G1")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">G1</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="G"
                  value="G"
                  defaultChecked={currentUser.vType.includes("G")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">G</Label>
              </div>
              <div className="flex sm:justify-center items-center">
                <Checkbox
                  id="J"
                  value="J"
                  defaultChecked={currentUser.vType.includes("J")}
                  onChange={handleCheckboxChange}
                />
                <Label className="ml-2">J</Label>
              </div>
            </div>
            <div className="block">
              <Label value="Your Licence Number" />
            </div>
            <TextInput
              id="licenceNumber"
              type="text"
              placeholder="Licence Number"
              defaultValue={currentUser.licenceNumber}
              onChange={handleChange}
            />
            <div className=" block">
              <Label value="About" />
            </div>
            <Textarea
              id="about"
              className="mb-2"
              defaultValue={currentUser.about}
              onChange={handleChange}
            />
          </>
        )}
        <Button
          onChange={handleChange}
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading || reportFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>
      </form>
      {updateUserError && (
        <Alert color="failure" className="mt-7">
          {updateUserError}
        </Alert>
      )}
      {updateUserSuccess && (
        <Alert color="success" className="mt-7">
          {updateUserSuccess}
        </Alert>
      )}
    </div>
  );
}
