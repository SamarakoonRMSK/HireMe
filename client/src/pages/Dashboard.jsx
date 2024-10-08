import { useSearchParams } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSlidebar from "../components/DashSlidebar";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div>
        <DashSlidebar />
      </div>
      {"profile" === searchParams.get("tab") && <DashProfile />}
    </div>
  );
}
