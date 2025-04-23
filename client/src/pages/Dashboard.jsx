import { useSearchParams } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSlidebar from "../components/DashSlidebar";
import DashJobPosts from "../components/DashJobPosts";
import { useSelector } from "react-redux";
import DashCustomerHires from "../components/DashCustomerHires";
import DashCompletedHires from "../components/DashCompletedHires";
import DashVerify from "../components/DashVerify";
import DashDriverHires from "../components/DashDriverHires";
import DashCompletedDriverHires from "../components/DashCompletedDriverHires";
import DashCompletedHiresWithFeedback from "../components/DashCompletedHiresWithFeedback";
import DashboardComp from "../components/DashboardComp";
import DashPosts from "../components/DashPosts";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser } = useSelector((state) => state.userSlice);
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div>
        <DashSlidebar />
      </div>
      {"profile" === searchParams.get("tab") && <DashProfile />}
      {"jobs" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "customer" && <DashJobPosts />}
      {"hires" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "customer" && <DashCustomerHires />}
      {"verify" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "admin" && <DashVerify />}
      {"dash" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "admin" && <DashboardComp />}
      {"posts" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "admin" && <DashPosts />}
      {"chires" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "admin" && <DashCompletedHiresWithFeedback />}
      {"completed" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "customer" && <DashCompletedHires />}
      {"driverhire" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "driver" && <DashDriverHires />}
      {"completedhires" === searchParams.get("tab") &&
        currentUser &&
        currentUser.role === "driver" && <DashCompletedDriverHires />}
    </div>
  );
}
