import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import Register from "./Register";
import Login from "./Login";
import UserPortal from "./UserPortal/UserPortal";
import EmployeePortal from "./EmployeePortal/EmployeePortal";

function App() {
  return (
    <Router>
      <div
        style={{ backgroundColor: "oklch(0.98 0.005 106.423)" }}
        className="min-h-screen"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userportal" element={<UserPortal />} />
          <Route path="/employeeportal" element={<EmployeePortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
