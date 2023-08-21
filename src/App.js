import logo from "./assets/fabrinet.png";
import "./App.css";
import "./custom.scss";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import AdminDashboard from "./components/adminComponents/AdminDashboard";
import NavBar from "./components/commonComponents/NavBar";
import SupplierDashboard from "./components/supplierComponents/SupplierDashboard";
import eventListenerModule from "./eventListenerModule";

function App() {
  const [screen, setScreen] = useState(0);
  const [supplierID, setSupplierID] = useState(0);

  useEffect(() => {
    document.title = 'Fabrinet';
  });

  function renderScreen() {
    switch (screen) {
      case 0:
        return <Login handleLoginSuccess={handleLoginSuccess} />;
        break;
      case 1:
        return <AdminDashboard />;
        break;
      case 2:
        return <SupplierDashboard supplierID={supplierID}/>;
        break;
      default:
        return <Login handleLoginSuccess={handleLoginSuccess} />;
        break;
    }
  }

  function handleLoginSuccess(user) {
    setSupplierID(user.id);
    setScreen(user.access);
  }

  return <>{renderScreen()}</>;
}

export default App;
