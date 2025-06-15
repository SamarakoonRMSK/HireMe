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
import Success from "./pages/Success";
import Jobs from "./pages/Jobs";
import Footer from "./components/Footer";
import GoogleMap from "./pages/GoogleMap";
import Driver from "./pages/Driver";
import { useSelector } from "react-redux";
import LocationUpdater from "./components/LocationUpdater";
import AboutUs from "./pages/AboutUs";
import PrivateRoute from "./components/PrivateRoute";
import CustomerRoute from "./components/CustomerRoute";
import DriverRoute from "./components/DriverRoute";

export default function App() {
  const { currentUser } = useSelector((state) => state.userSlice);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* all */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signin" element={<Signin />} />
        {/* both */}
        <Route element={<PrivateRoute/>}>
          <Route path="/map" element={<GoogleMap />}  />
          <Route path="/vacancy/:postId" element={<VacancyPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/message" element={<Message />} />
        </Route>
        {/* customer */}
        <Route element={<CustomerRoute/>}>
          <Route path="/create-vacancy" element={<CreatePost />} />
          <Route path="/drivers" element={<AllDrivers />} />
          <Route path="/driver/:driverId" element={<Driver/>} />
          <Route path="/hire/:driverId" element={<HireDriver />} />
          <Route path="/success/:hireId" element={<Success />} />
        </Route>
        {/* driver */}
        <Route element={<DriverRoute/>}>
          <Route path="/jobs" element={<Jobs />} />
        </Route>
        {/* admin */}
      </Routes>
      <Footer/>
      {currentUser && <LocationUpdater 
        driverId={currentUser._id} 
        name={currentUser.fullName}
        role={currentUser.role}  
        />}

    </BrowserRouter>
  );
}
