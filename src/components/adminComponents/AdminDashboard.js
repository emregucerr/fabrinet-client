import NavBar from "../commonComponents/NavBar";
import { useState } from "react";
import "../../App.css";
import React from "react";
import OrdersPage from "./OrdersPage";
import ShipmentsPage from "../commonComponents/ShipmentsPage";
import AccountsPage from "./AccountsPage";
import FindBarcode from "./FindBarcodePage";
import RollsPage from "./RollsPage";
import BagsPage from "./BagsPage";

function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState(0);

  function renderPage() {
    switch (selectedPage) {
      case 0:
        return <OrdersPage />;
        break;
      case 1:
        return <ShipmentsPage supplierId={0}/>;
        break;
      case 2:
        return <RollsPage/>;
        break;
      case 3:
        return <BagsPage/>;
        break;
      case 4:
        return <AccountsPage />;
        break;
      default:
        return <OrdersPage />;
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
        access={1}
      />
      <div className="p-5">
        {renderPage()}
      </div>
    </div>
  );
}

export default AdminDashboard;
