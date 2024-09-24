import { useState } from "react";
import {
  Alert,
  Button,
  Textarea,
  TextInput,
  Checkbox,
  Label,
  Select,
} from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { currentUser } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setFormData({ ...formData, return: true });
    } else {
      setFormData({ ...formData, return: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/create/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate("/");
      }
    } catch (error) {
      setPublishError(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Create Job Vacancy
      </h1>
      <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          id="title"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Textarea
          id="description"
          placeholder="Job Description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <div className="flex flex-col md:flex-row gap-2">
          <TextInput
            type="text"
            placeholder="From"
            required
            id="from"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="To"
            required
            id="to"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          />
        </div>
        <div className="flex  items-center">
          <Checkbox id="return" onChange={handleCheckboxChange} />
          <Label className="ml-2">Return to start place</Label>
        </div>
        <TextInput
          type="number"
          placeholder="Number of days"
          required
          id="duration"
          className="flex-1"
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
        />
        <Select
          id="countries"
          required
          onChange={(e) => setFormData({ ...formData, vType: e.target.value })}
        >
          <option value="">Select your vehical type</option>
          <option value="A1">A1</option>
          <option value="A">A</option>
          <option value="B1">B1</option>
          <option value="B">B</option>
          <option value="C1">C</option>
          <option value="C">C</option>
          <option value="CE">CE</option>
          <option value="D1">D1</option>
          <option value="D">D</option>
          <option value="DE">DE</option>
          <option value="G1">G1</option>
          <option value="G">G</option>
          <option value="J">J</option>
        </Select>

        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
      {publishError && (
        <Alert className="mt-5" color="failure">
          publishError
        </Alert>
      )}
    </div>
  );
}
