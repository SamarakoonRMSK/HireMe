import { useEffect, useState } from "react";
import MessageContainer from "../components/MessageContainer";
import { useSelector } from "react-redux";
import { useSocketContext } from "../context/SocketContext";
import { Link, useSearchParams } from "react-router-dom";

export default function Message() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.userSlice);
  const { socket } = useSocketContext();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(`/api/message/getusers/${currentUser._id}`);
        const data = await res.json();
        if (!res.ok) {
          return;
        } else {
          setUsers(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [currentUser]);

  useEffect(() => {
    if (socket) {
      socket.on("newUser", (user) => {
        setUsers((prevMessages) => [...prevMessages, user]);
      });

      return () => {
        socket.off("newUser");
      };
    }
  }, [socket]);

  return (
    <div className="flex max-h-screen overflow-hidden">
      <div className="w-1/4 bg-white border-r border-gray-300">
        <header className="p-4 h-[8vh] border-b border-gray-300 flex justify-between items-center bg-indigo-400 text-black">
          <h1 className="text-2xl font-semibold">Chat Web</h1>
        </header>

        <div className="overflow-y-auto h-[90vh] p-3 mb-9 pb-20 bg-gray-100">
          {users &&
            users.length >= 1 &&
            users.map((user) => (
              <Link key={user._id} to={`/message?id=${user._id}`}>
                <div
                  className={`flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md ${
                    searchParams.get("id") === user._id ? "bg-gray-300" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <img
                      src={user.profilePicture}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{user.fullName}</h2>
                    <p className="text-gray-600">Hoorayy!!</p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      <div className="w-full gap-5">
        <MessageContainer />
      </div>
    </div>
  );
}
