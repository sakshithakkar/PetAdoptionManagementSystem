import { BrowserRouter, Routes, Route } from "react-router-dom";
import PetList from "./pages/Public/PetList";
import PetDetails from "./pages/Public/PetDetails";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MyApplications from "./pages/User/MyApplications";
import ManagePets from "./pages/Admin/ManagePets";
import Applications from "./pages/Admin/Applications";
import Navbar from "./components/Navbar";

function App() {
  return (
    // <BrowserRouter>
    <>

      <Navbar />
      <Routes>
        <Route path="/" element={<PetList />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/my-applications" element={<MyApplications />} />

        <Route path="/admin/pets" element={<ManagePets />} />
        <Route path="/admin/applications" element={<Applications />} />
      </Routes>
    </>
    // </BrowserRouter>
  );
}

export default App;
