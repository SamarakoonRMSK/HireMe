import {
  Alert,
  Button,
  Checkbox,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function HireDriver() {
  const { currentUser } = useSelector((state) => state.userSlice);
  const [formData, setFormData] = useState({});
  const [createError, setCreateError] = useState(null);
  const { driverId } = useParams();
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
      const res = await fetch(
        `/api/hire/create/${currentUser._id}/${driverId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log(data);
      console.log(data);

      if (!res.ok) {
        setCreateError(data.message);
        return;
      }
      if (res.ok) {
        setCreateError(null);
        navigate(`/`);
      }
    } catch (error) {
      setCreateError(error);
    }
  };

  console.log(formData);
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Hire Driver</h1>
      <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
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
          <option value="C1">C1</option>
          <option value="C">C</option>
          <option value="CE">CE</option>
          <option value="D1">D1</option>
          <option value="D">D</option>
          <option value="DE">DE</option>
          <option value="G1">G1</option>
          <option value="G">G</option>
          <option value="J">J</option>
        </Select>
        <TextInput
          type="number"
          placeholder="Amount Rs. "
          required
          id="price"
          className="flex-1"
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        <Button type="submit" gradientDuoTone="purpleToPink">
          Hire Driver
        </Button>
      </form>
      {createError && (
        <Alert className="mt-5" color="failure">
          {createError}
        </Alert>
      )}
    </div>
  );
}
