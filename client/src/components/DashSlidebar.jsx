import { Sidebar } from "flowbite-react";
import { useSelector } from "react-redux";
import {
  HiArrowSmRight,
  HiChartPie,
  HiUser,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
} from "react-icons/hi";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../store/user/userSlice";

export default function DashSlidebar() {
  const { currentUser } = useSelector((state) => state.userSlice);
  const [searchParams, setSearchParams] = useSearchParams();
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
    <Sidebar className="w-full sm:w-60" aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {currentUser && currentUser.role === "admin" && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                icon={HiChartPie}
                as="div"
                active={"dash" === searchParams.get("tab")}
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              icon={HiUser}
              active={"profile" === searchParams.get("tab")}
              label={currentUser.role === "admin" ? "Admin" : "User"}
              as="div"
            >
              Profile
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiArrowSmRight}
              as="div"
              className="cursor-pointer"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
