import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";
import { useSelector } from "react-redux";

export default function Message() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const receiverId = searchParams.get("id");
  const { socket } = useSocketContext();
  const lastMessageRef = useRef();

  const { currentUser } = useSelector((state) => state.userSlice);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`/api/message/${receiverId}`);
        const data = await res.json();

        if (data.error) {
          console.log(data.error);
        } else {
          setMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (receiverId !== null) {
      getMessages();
    }
  }, [receiverId]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (message.senderId === receiverId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const sendMessage = async () => {
    try {
      const res = await fetch(
        `/api/message/send/${currentUser._id}/${receiverId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: newMessage }),
        }
      );

      const data = await res.json();
      setNewMessage("");
      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <header className="bg-gray-300 p-4 text-gray-700 h-[8vh]">
        <h1 className="text-2xl font-semibold">Message Box</h1>
      </header>
      <div className="overflow-y-auto p-4 pb-36 h-[84vh] ">
        {messages &&
          messages.length > 0 &&
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 cursor-pointer  ${
                currentUser._id === message.senderId ? "justify-end" : ""
              }`}
            >
              <div
                ref={lastMessageRef}
                className={`flex max-w-96  rounded-lg p-3 gap-3 ${
                  currentUser._id === message.senderId
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-100 text-gray-700"
                }`}
              >
                <p>{message.message}</p>
              </div>
            </div>
          ))}
      </div>
      <div className="flex items-center h-[8vh] p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
        />
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </>
  );
}
