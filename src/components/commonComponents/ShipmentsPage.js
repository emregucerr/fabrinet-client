import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import {
  getShipment,
  getShipmentChecklist,
} from "../../services/shipmentServices";
import ReactExport from "react-export-excel";
import { getRollForChecklist } from "../../services/rollServices";
import { CSVLink } from "react-csv";
import { getBag } from "../../services/bagServices";

function ShipmentsPage({ supplierId }) {
  const [subpage, setSubpage] = useState(0);

  function renderSubpage() {
    switch (subpage) {
      case 0:
        return <ShipmentsTable supplierId={supplierId} />;
        break;
      default:
        return <ShipmentsTable supplierId={supplierId} />;
        break;
    }
  }

  return (
    <div className="w-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between mb-4">
        <h1>Shipments</h1>
      </div>
      {renderSubpage()}
    </div>
  );
}

function ShipmentsTable({ supplierId }) {
  const [shipments, setShipments] = useState([]);
  const [pageFirst, setPageFirst] = useState(0);
  const [pageLast, setPageLast] = useState(10);

  function fetchData() {
    getShipment(0, supplierId).then(
      function (value) {
        if (value.data.status == 200) {
          setShipments(value.data.data);
        }
      },
      function (error) {
        alert("Oops. Something went wrong when retrieving shipments.");
        console.log(error);
      }
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handlePageChange(value) {
    if ((value - 1) * 10 < shipments.length) {
      setPageFirst((value - 1) * 10);
      if (value * 10 < shipments.length) {
        setPageLast(value * 10);
      } else {
        setPageLast(shipments.length);
      }
    }
  }

  const reversed = [...shipments].reverse().slice(pageFirst, pageLast);

  return shipments.length > 0 ? (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Supplier</th>
            <th>Created At</th>
            <th>Roll Checklist</th>
          </tr>
        </thead>
        <tbody>
          {reversed.map((shipment) => (
            <tr>
              <td>{shipment.id}</td>
              <td>{shipment.supplierName}</td>
              <td>{shipment.createdAt.split("T")[0]}</td>
              <td className="d-flex justify-content-center">
                <DownloadExcel shipmentId={shipment.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Paginator
        itemCount={(shipments.length + (10 - (shipments.length % 10))) / 10}
        handlePageChange={handlePageChange}
      />
    </div>
  ) : (
    <h4>No shipments yet...</h4>
  );
}

function DownloadExcel({ shipmentId }) {
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  const [bagged, setBagged] = useState([]);
  const [rolls, setRolls] = useState([]);
  const [bagCount, setBagCount] = useState(0);
  const [baggedRollCount, setBaggedRollCount] = useState(0);
  const [unbaggedRollCount, setUnbaggedRollCount] = useState(0);

  const [baggedMeters, setBaggedMeters] = useState(0);
  const [unbaggedMeters, setUnbaggedMeters] = useState(0);

  function fetchData() {
    getShipmentChecklist(shipmentId).then(
      function (value) {
        var unfilteredBagRolls = value.data.data;
        setBaggedRollCount(value.data.data.length);
        var groups = [];

        var meterCounter = 0;
        for (var i = 0; i < value.data.data.length; i++) {
          meterCounter += unfilteredBagRolls[i].meter;
        }
        setBaggedMeters(meterCounter);

        while (unfilteredBagRolls.length > 0) {
          const selected = unfilteredBagRolls[0];
          var group = {
            bagBarcode: selected.bagBarcode,
            bagID: selected.bagID,
            color: selected.color,
            groupName: selected.groupName,
            size: selected.size,
            designNo: selected.designNo,
            orderNo: selected.orderID,
            orderDesc: selected.orderDesc,
            rollCount: 1,
            totalMeter: selected.meter,
            roll1: selected.meter,
            roll2: 0,
            roll3: 0,
            roll4: 0,
            roll5: 0,
          };
          unfilteredBagRolls.shift();
          var counter = 1;
          var temp = unfilteredBagRolls;
          for (var i = 0; i < temp.length; i++) {
            const r = temp[i];
            if (
              r.color == selected.color &&
              r.bagBarcode == selected.bagBarcode &&
              r.size == selected.size &&
              r.designNo == selected.designNo
            ) {
              counter++;
              group.rollCount = counter;
              group.totalMeter += r.meter;
              switch (counter) {
                case 2:
                  group.roll2 = r.meter;
                  break;

                case 3:
                  group.roll3 = r.meter;
                  break;

                case 4:
                  group.roll4 = r.meter;
                  break;

                case 5:
                  group.roll5 = r.meter;
                  break;

                default:
                  break;
              }
              unfilteredBagRolls.splice(i, 1);
            }
          }

          groups.push(group);

          if (unfilteredBagRolls.length == 0) {
            setBagged(groups);
          }
        }
      },
      function (error) {
        alert("Nope, something is wrong!");
        console.log(error);
      }
    );

    getRollForChecklist(shipmentId).then(
      function (value) {
        setRolls(value.data.data);
        setUnbaggedRollCount(value.data.data.length);

        var meterCounter = 0;
        for (var i = 0; i < value.data.data.length; i++) {
          meterCounter += value.data.data[i].meter;
        }
        setUnbaggedMeters(meterCounter);
      },
      function (error) {
        alert("Nope, something is wrong!");
        console.log(error);
      }
    );

    getBag(0, 0, "", shipmentId).then(
      function (value) {
        setBagCount(value.data.data.length);
      },
      function (error) {
        alert("Nope, something is wrong!");
        console.log(error);
      }
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ExcelFile
      element={<Button>Download Data</Button>}
      filename={`Shipment-${shipmentId}`}
    >
      <ExcelSheet data={bagged} name={`Bags in Shipment-${shipmentId}`}>
        <ExcelColumn label="Bag ID" value="bagID" />
        <ExcelColumn label="Bag Barcode" value="bagBarcode" />
        <ExcelColumn label="Group Name" value="groupName" />
        <ExcelColumn label="Design No" value="designNo" />
        <ExcelColumn label="Size" value="size" />
        <ExcelColumn label="Color" value="color" />
        <ExcelColumn label="# of Rolls" value="rollCount" />
        <ExcelColumn label="Roll 1" value="roll1" />
        <ExcelColumn label="Roll 2" value="roll2" />
        <ExcelColumn label="Roll 3" value="roll3" />
        <ExcelColumn label="Roll 4" value="roll4" />
        <ExcelColumn label="Roll 5" value="roll5" />
        <ExcelColumn label="Total Meter" value="totalMeter" />
        <ExcelColumn label="Order" value="orderDesc" />
      </ExcelSheet>
      <ExcelSheet data={rolls} name={`Rolls in Shipment-${shipmentId}`}>
        <ExcelColumn label="Roll Barcode" value="rollBarcode" />
        <ExcelColumn label="Group Name" value="groupName" />
        <ExcelColumn label="Design No" value="designNo" />
        <ExcelColumn label="Color" value="color" />
        <ExcelColumn label="Size" value="size" />
        <ExcelColumn label="Meter" value="meter" />
        <ExcelColumn label="Order" value="orderDesc" />
      </ExcelSheet>
      <ExcelSheet
        data={[
          {
            bagCount: bagCount,
            rollCount: unbaggedRollCount + baggedRollCount,
            totalMeters: unbaggedMeters + baggedMeters,
          },
        ]}
        name={`Statistics for Shipment-${shipmentId}`}
      >
        <ExcelColumn label="Bag Count" value="bagCount" />
        <ExcelColumn label="Roll Count" value="rollCount" />
        <ExcelColumn label="Total Meters" value="totalMeters" />
      </ExcelSheet>
    </ExcelFile>
  );
}

function Paginator({ itemCount, handlePageChange }) {
  const [active, setActive] = useState(1);

  function comprehendItems() {
    var arr = [];
    for (var i = 1; i <= itemCount; i++) {
      arr.push(i);
    }
    return arr;
  }

  function handleClick(value) {
    setActive(value);
    handlePageChange(value);
  }

  return (
    <div>
      {comprehendItems().map((item) => (
        <PaginatorItem
          active={item == active}
          value={item}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
}

function PaginatorItem({ active, value, handleClick }) {
  return (
    <Button
      className={active ? "" : "bg-light text-black mx-1"}
      onClick={() => handleClick(value)}
    >
      {value}
    </Button>
  );
}

export default ShipmentsPage;
