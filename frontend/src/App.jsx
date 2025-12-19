import { Routes, Route } from "react-router-dom";
import PetList from "./pages/Public/PetList";
import PetDetails from "./pages/Public/PetDetails";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import MyApplications from "./pages/User/MyApplications";
import ManagePets from "./pages/Admin/ManagePets";
import Applications from "./pages/Admin/Applications";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PetList />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User-only routes */}
        <Route
          path="/my-applications"
          element={<ProtectedRoute element={MyApplications} role="USER" />}
        />

        {/* Admin-only routes */}
        <Route
          path="/admin/pets"
          element={<ProtectedRoute element={ManagePets} role="ADMIN" />}
        />
        <Route
          path="/admin/applications"
          element={<ProtectedRoute element={Applications} role="ADMIN" />}
        />
      </Routes>
    </>
  );
}

export default App;
