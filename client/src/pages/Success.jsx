import { Card, Button, Label, Textarea, Alert } from "flowbite-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiStar } from 'react-icons/hi';

export default function Success() {
  const { hireId } = useParams();
  const [feedback, setFeedback] = useState("");
  const [rate, setRate] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        setError(result.error);
      } else {
        setError(null);
        navigate("/");
      }
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
    }
  };

  const handleStarClick = (rating) => {
    setRate(rating);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Leave Feedback & Rating
        </h2>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <HiStar
                  key={star}
                  className={`text-2xl sm:text-3xl cursor-pointer transition-colors duration-200 ${
                    star <= rate ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
            {rate > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {rate} {rate === 1 ? 'star' : 'stars'}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              placeholder="Share your experience with this driver..."
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>

          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            size="lg"
            className="w-full hover:scale-105 transition-transform duration-200"
          >
            Submit Feedback
          </Button>
        </form>
      </Card>
    </div>
  );
}