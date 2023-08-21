import NavBar from "../commonComponents/NavBar";
import { useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import React from "react";
import CreateRollPage from "./CreateRollPage";
import CreateSackPage from "./CreateSackPage";
import CreateShipmentPage from "./CreateShipmentPage";

function SupplierDashboard({ supplierID }) {
  const [selectedPage, setSelectedPage] = useState(0);

  function renderPage() {
    switch (selectedPage) {
      case 0:
        return <CreateRollPage supplierID={supplierID} />;
        break;
      case 1:
        return <CreateSackPage supplierID={supplierID} />;
        break;
      case 2:
        return <CreateShipmentPage supplierID={supplierID} />;
        break;
      default:
        return <CreateRollPage supplierID={supplierID} />;
        break;
    }
  }

  function handlePageSelection(page) {
    setSelectedPage(page);
  }

  return (
    <div>
      <NavBar
        handlePageSelection={handlePageSelection}
        selectedPage={selectedPage}
        access={2}
      />
      <div className="p-5">{renderPage()}</div>
    </div>
  );
}

export default SupplierDashboard;
