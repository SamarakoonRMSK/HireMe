import { Sidebar } from "flowbite-react";
import { useSelector } from "react-redux";
import {
  HiArrowSmRight,
  HiChartPie,
  HiUser,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiUsers,
} from "react-icons/hi";
import { MdFreeCancellation, MdOutlinePendingActions } from "react-icons/md";
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
            <>
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  icon={HiChartPie}
                  as="div"
                  active={"dash" === searchParams.get("tab")}
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=verify">
                <Sidebar.Item
                  icon={HiUsers}
                  as="div"
                  active={"verify" === searchParams.get("tab")}
                >
                  Verify Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=chires">
                <Sidebar.Item
                  icon={HiDocumentText}
                  as="div"
                  active={"chires" === searchParams.get("tab")}
                >
                  Completed Hires
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  icon={HiDocumentText}
                  as="div"
                  active={"posts" === searchParams.get("tab")}
                >
                  All Jobs
                </Sidebar.Item>
              </Link>
            </>
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
          </Link>  
          {currentUser && currentUser.role === "driver" && (
            <>
              <Link to="/dashboard?tab=pending">
                <Sidebar.Item
                  icon={MdOutlinePendingActions}
                  active={"pending" === searchParams.get("tab")}
                  as="div"
                >
                  Incoming Jobs
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=driverhire">
                <Sidebar.Item
                  icon={HiDocumentText}
                  active={"driverhire" === searchParams.get("tab")}
                  as="div"
                >
                  Your Jobs
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=completedhires">
                <Sidebar.Item
                  icon={HiDocumentText}
                  active={"completedhires" === searchParams.get("tab")}
                  as="div"
                >
                  Your Completed Jobs
                </Sidebar.Item>
              </Link>
            </>
          )}
          {currentUser && currentUser.role === "customer" && (
            <>
              <Link to="/dashboard?tab=jobs">
                <Sidebar.Item
                  icon={HiDocumentText}
                  active={"jobs" === searchParams.get("tab")}
                  as="div"
                >
                  Your Job Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=pending">
                <Sidebar.Item
                  icon={MdOutlinePendingActions  }
                  active={"pending" === searchParams.get("tab")}
                  as="div"
                >
                  Pending Hires
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=hires">
                <Sidebar.Item
                  icon={HiDocumentText}
                  active={"hires" === searchParams.get("tab")}
                  as="div"
                >
                  Your Hires
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=completed">
                <Sidebar.Item
                  icon={HiDocumentText}
                  active={"completed" === searchParams.get("tab")}
                  as="div"
                >
                  Completed Hires
                </Sidebar.Item>
              </Link>
            </>
          )}
          {currentUser && currentUser.role !== "admin" && (
            <Link to="/dashboard?tab=cancel">
            <Sidebar.Item
              icon={MdFreeCancellation }
              active={"cancel" === searchParams.get("tab")}
              as="div"
            >
              Cancelled Hires
            </Sidebar.Item>
          </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            as="div"
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
