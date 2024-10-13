import { useSearchParams } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSlidebar from "../components/DashSlidebar";
import DashJobPosts from "../components/DashJobPosts";
import { useSelector } from "react-redux";

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
    </div>
  );
}
