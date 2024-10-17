import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import CreatePost from "./pages/CreatePost";
import VacancyPage from "./pages/VacancyPage";
import Dashboard from "./pages/Dashboard";
import Message from "./pages/Message";
import AllDrivers from "./pages/AllDrivers";
import HireDriver from "./pages/HireDriver";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* all */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        {/* both */}
        <Route path="/vacancy/:postId" element={<VacancyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/message" element={<Message />} />
        {/* customer */}
        <Route path="/create-vacancy" element={<CreatePost />} />
        <Route path="/drivers" element={<AllDrivers />} />
        <Route path="/hire/:driverId" element={<HireDriver />} />
        {/* driver */}
        {/* admin */}
      </Routes>
    </BrowserRouter>
  );
}
