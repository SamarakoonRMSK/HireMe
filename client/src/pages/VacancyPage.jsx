import { Button, Table, Alert } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function VacancyPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [applyError, setApplyError] = useState(null);
  const { currentUser } = useSelector((state) => state.userSlice);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          return;
        } else {
          setPost(data.posts[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [postId]);

  console.log(post);
  const handleApply = async () => {
    const userData = {
      image: currentUser.profilePicture,
      email: currentUser.email,
      username: currentUser.username,
      rating: 0,
    };
    try {
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setApplyError(data.message);
        return;
      }
      if (res.ok) {
        setPost(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 flex flex-col  max-w-4xl mx-auto min-h-screen">
      <div>
        <div className="flex flex-col items-center gap-1 my-5 text-gray-500 text-sm">
          <h1 className="text-5xl mt-3 p-3  font-medium max-w-4xl  lg:text-6xl">
            {post && post.title}
          </h1>
          <div>
            <p className="p-3 text-gray-600 dark:text-gray-400 max-w-4xl mx-auto text-justify w-full">
              {post && post.description}
            </p>
          </div>
          <div className="flex flex-row justify-between w-full p-3">
            <div>
              <h2 className="font-bold">{post && "Rs. " + post.price}</h2>
              <p>Price</p>
            </div>
            <div>
              <h2 className="font-bold">{post && post.from}</h2>
              <p>From</p>
            </div>
            <div>
              <h2 className="font-bold">{post && post.to}</h2>
              <p>To</p>
            </div>
            <div>
              <h2 className="font-bold">{post && post.vType}</h2>
              <p>Vehicle</p>
            </div>
            <div>
              <h2 className="font-bold">{post && post.duration + " Days"}</h2>
              <p>Duration</p>
            </div>
          </div>
          {currentUser && currentUser.role === "driver" && (
            <div className="w-full p-3">
              <Button
                gradientDuoTone="purpleToBlue"
                className="w-full"
                onClick={handleApply}
              >
                Apply for Job
              </Button>
              {applyError && (
                <div className="pt-3">
                  <Alert color="failure">{applyError}</Alert>
                </div>
              )}
            </div>
          )}
          <div className="w-full p-3">
            <Table hoverable className="shadow-md">
              <Table.Head>
                <Table.HeadCell>Profile</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Rating</Table.HeadCell>
                {currentUser && currentUser.role === "customer" && (
                  <Table.HeadCell>Select</Table.HeadCell>
                )}
              </Table.Head>
              {post &&
                post.applicants.length >= 1 &&
                post.applicants.map((user) => (
                  <Table.Body key={user.userId} className="divide-y">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        <img
                          src={user.image}
                          alt={user.username}
                          className="w-10 h-10 object-cover rounded-full bg-gray-500"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{user.rating}</Table.Cell>
                      {currentUser && currentUser.role === "customer" && (
                        <Table.Cell>
                          <span
                            // onClick={() => {

                            // }}
                            className="font-medium text-blue-500 hover:underline cursor-pointer"
                          >
                            Hire
                          </span>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  </Table.Body>
                ))}
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
