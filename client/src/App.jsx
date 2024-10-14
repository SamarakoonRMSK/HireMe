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
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/create-vacancy" element={<CreatePost />} />
        <Route path="/vacancy/:postId" element={<VacancyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/message" element={<Message />} />
        <Route path="/drivers" element={<AllDrivers />} />
        <Route path="/hire/:driverId" element={<HireDriver />} />
      </Routes>
    </BrowserRouter>
  );
}
