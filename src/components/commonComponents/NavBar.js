import logo from "../../assets/fabrinet.png";
import "../../App.css";

function Navbar({ handlePageSelection, selectedPage, access }) {
  function getButtonClasses(buttonID) {
    if (buttonID == selectedPage) {
      return "mx-4 px-4 mb-2";
    } else {
      return "mx-4 px-4 mb-2 text-muted";
    }
  }

  function AdminTabs() {
    return (
      <div className="w-100 h-100 d-flex flex-row align-items-end justify-content-start p-4 border-bottom">
        <img src={logo} className="App-logo" alt="logo" />
        <div
          className={getButtonClasses(0)}
          onClick={() => handlePageSelection(0)}
        >
          <h4>Orders</h4>
        </div>
        <div
          className={getButtonClasses(1)}
          onClick={() => handlePageSelection(1)}
        >
          <h4>Shipments </h4>
        </div>
        <div
          className={getButtonClasses(2)}
          onClick={() => handlePageSelection(2)}
        >
          <h4>Rolls</h4>
        </div>
        <div
          className={getButtonClasses(3)}
          onClick={() => handlePageSelection(3)}
        >
          <h4>Bags</h4>
        </div>
        <div
          className={getButtonClasses(4)}
          onClick={() => handlePageSelection(4)}
        >
          <h4>Accounts</h4>
        </div>
      </div>
    );
  }

  function SupplierTabs() {
    return (
      <div className="w-100 h-100 d-flex flex-row align-items-end justify-content-start p-4 border-bottom">
        <img src={logo} className="App-logo" alt="logo" />
        <div
          className={getButtonClasses(0)}
          onClick={() => handlePageSelection(0)}
        >
          <h4>Create Roll</h4>
        </div>
        <div
          className={getButtonClasses(1)}
          onClick={() => handlePageSelection(1)}
        >
          <h4>Create Bag</h4>
        </div>
        <div
          className={getButtonClasses(2)}
          onClick={() => handlePageSelection(2)}
        >
          <h4>Create Shipment</h4>
        </div>
      </div>
    );
  }

  return (
    access == 1 ? <AdminTabs/> : <SupplierTabs/>
  );
}

export default Navbar;
