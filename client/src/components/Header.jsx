import { Avatar, Dropdown, Navbar, Button } from "flowbite-react";
import logo from "../assets/logo.png";
import { Badge } from "flowbite-react";
import { HiCheck, HiClock } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.userSlice);
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <img src={logo} className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          HireMe
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div style={{ position: "relative" }} className="mr-2">
                <Avatar
                  alt="User settings"
                  img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
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

            <Dropdown.Item>profile</Dropdown.Item>
            <Link to="/create-vacancy">
              <Dropdown.Item>Create vacancy</Dropdown.Item>
            </Link>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
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
        <Navbar.Link href="#" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="#">About</Navbar.Link>
        <Navbar.Link href="#">Services</Navbar.Link>
        <Navbar.Link href="#">Pricing</Navbar.Link>
        <Navbar.Link href="#">Contact</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
