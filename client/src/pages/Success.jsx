import { Button, Label } from "flowbite-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const { hireId } = useParams();
  const [feedback, setFeedback] = useState("");
  const [rate, setRate] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/hire/update-status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hireId,
        feedback,
        rate,
      }),
    });

    const result = await response.json();
    if (result.error) {
      console.error("Error submitting feedback:", result.error);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen mx-auto flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full flex gap-5 flex-col p-3 sm:p-20"
      >
        <h2 className="text-lg font-bold">Leave Feedback & Rating</h2>

        <div>
          <Label
            htmlFor="rate"
            className="block text-sm font-medium text-gray-700"
          >
            Rating (out of 5):
          </Label>
          <input
            type="number"
            id="rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            min="0"
            max="5"
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700"
          >
            Feedback:
          </Label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="3"
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"
            required
          ></textarea>
        </div>

        <Button type="submit" className="w-full ">
          Submit Feedback
        </Button>
      </form>
    </div>
  );
}
