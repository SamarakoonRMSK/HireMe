import { Avatar, Dropdown, Navbar, Button } from "flowbite-react";
import logo from "../assets/logo.png";
import { Badge } from "flowbite-react";
import { HiCheck, HiClock } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../store/user/userSlice";

export default function Header() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();

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

  return (
    <Navbar fluid rounded>
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
                <Badge
                  icon={HiCheck}
                  style={{
                    position: "absolute",
                    bottom: 6,
                    right: 6,
                    transform: "translate(50%, 50%)", // to place the badge at the corner
                  }}
                />
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

            <Dropdown.Item>Earnings</Dropdown.Item>
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
        <Navbar.Link as={"div"}>About</Navbar.Link>
        <Navbar.Link as={"div"}>Services</Navbar.Link>

        <Navbar.Link as={"div"}>Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
