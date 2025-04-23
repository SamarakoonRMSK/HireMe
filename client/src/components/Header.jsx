import { Avatar, Dropdown, Navbar, Button, Popover } from "flowbite-react";
import logo from "../assets/logo.png";
import { Badge } from "flowbite-react";
import { HiCheck, HiClock } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../store/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchLatestNotifications = async () => {
      try {
        const response = await fetch("/api/v1/notification/latest");

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        setNotifications(data.data || []); 
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]); 
      }
    };

    fetchLatestNotifications();
  }, []);

  const content = (
    <div className="w-96 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Notification
        </h3>
      </div>
      {notifications.length >= 1 ? (
        notifications.map((notifi) => (
          <div key={notifi._id} className="px-3 py-2 flex justify-between">
            {" "}
            {/* Add `key`! */}
            <p>{notifi.customerId} {notifi.description}</p>
            <p>{notifi.price}</p>
          </div>
        ))
      ) : (
        <div className="px-3 py-2">No notifications yet.</div>
      )}
    </div>
  );

  return (
    <Navbar fluid className="z-10 sticky top-0 bg-slate-100">
      <Link to="/">
        <Navbar.Brand as={"div"}>
          <img
            src={logo}
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            HireMe
          </span>
        </Navbar.Brand>
      </Link>
      <div className="flex md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div style={{ position: "relative" }} className="mr-2">
                <Avatar
                  alt="User settings"
                  img={currentUser.profilePicture}
                  rounded
                />
                {((currentUser && currentUser.role === "admin") ||
                  currentUser.isVerify) && (
                  <Badge
                    icon={HiCheck}
                    style={{
                      position: "absolute",
                      bottom: 6,
                      right: 6,
                      transform: "translate(50%, 50%)", // to place the badge at the corner
                    }}
                  />
                )}
              </div>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block truncate text-sm font-medium">
                {currentUser.email}
              </span>
            </Dropdown.Header>

            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>profile</Dropdown.Item>
            </Link>
            {currentUser.role === "customer" && (
              <Link to="/create-vacancy">
                <Dropdown.Item>Create vacancy</Dropdown.Item>
              </Link>
            )}

            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <div className="flex flex-row gap-2">
            <Link to="/signup">
              <Button gradientDuoTone="purpleToBlue">Sign up</Button>
            </Link>
            <Link to="/signin">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign in
              </Button>
            </Link>
          </div>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link to="/">
          <Navbar.Link as={"div"} active={location.pathname == "/"}>
            Home
          </Navbar.Link>
        </Link>
        {currentUser && currentUser.role === "customer" && (
          <Link to="/drivers">
            <Navbar.Link as={"div"} active={location.pathname == "/drivers"}>
              Hire Driver
            </Navbar.Link>
          </Link>
        )}
        {currentUser && currentUser.role === "driver" && (
          <Link to="/jobs">
            <Navbar.Link as={"div"} active={location.pathname == "/jobs"}>
              Jobs
            </Navbar.Link>
          </Link>
        )}
        {currentUser && currentUser.role!=="admin" && (
          <Link to="/message">
            <Navbar.Link as={"div"} active={location.pathname == "/message"}>
              Message
            </Navbar.Link>
          </Link>
        )}
        <Navbar.Link as={"div"}>About</Navbar.Link>
        {currentUser && currentUser.role === "driver" && (
          <Popover content={content} placement="bottom">
          <div className="flex cursor-pointer">
          Notification
          </div>
        </Popover>
 
        )}

        <Navbar.Link as={"div"}>Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
