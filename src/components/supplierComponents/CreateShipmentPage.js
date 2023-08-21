import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import React from "react";
import { QRCode } from "react-qrcode-logo";
import { getRoll, updateRoll } from "../../services/rollServices";
import { createShipment, getShipment } from "../../services/shipmentServices";
import { getBag, updateBag } from "../../services/bagServices";
import { useRef } from "react";
import ShipmentsPage from "../commonComponents/ShipmentsPage";

function CreateShipmentPage({ supplierID }) {
  const [selectedPage, setSelectedPage] = useState(0);

  function handlePageChange(index) {
    setSelectedPage(index);
  }

  function renderPage() {
    switch (selectedPage) {
      case 0:
        return (
          <RollForm
            supplierID={ supplierID }
            handlePageChange={handlePageChange}
          />
        );
        break;
      case 1:
        return <div className="w-100 d-flex flex-column"><div className="bg-white text-dark border-white text-align-start py-3" onClick={() => handlePageChange(0)}>&lt; Back to Creating Shipement</div><ShipmentsPage supplierId={supplierID} /></div>;
        break;
      default:
        return (
          <RollForm
            supplierID={ supplierID }
            handlePageChange={handlePageChange}
          />
        );
        break;
    }
  }

  return renderPage();
}

function RollForm({ supplierID, handlePageChange }) {
  const [rolls, setRolls] = useState([]);
  const [realRolls, setRealRolls] = useState([]);
  const [realBags, setRealBags] = useState([]);
  const [rollBarcode, setRollBarcode] = useState("");

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [shipmentNum, setShipmentNum] = useState("");

  function fetchData() {
    getShipment(0, 0).then(
      function (value) {
        if (value.data.status == 200) {
          setShipmentNum(`#${value.data.data.length + 1}`);
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

  function appendRoll(roll) {
    setRolls(rolls.concat(roll));
    setRollBarcode("");
  }

  function deleteRoll(toRemove) {
    const arr = rolls;
    const index = arr.indexOf(toRemove);
    if (index > -1) {
      arr.splice(index, 1);
      setRolls(arr);
      forceUpdate();
    }
  }

  function findRoll(barcode) {
    getRoll(0, 0, 0, barcode).then(
      function (value) {
        if (value.data.status == 200) {
          if (value.data.data.length > 0) {
            appendRoll(value.data.data[0]);
            setRealRolls(realRolls.concat(value.data.data[0]));
          } else {
            getBag(0, 0, barcode).then(
              function (value) {
                if (value.data.status == 200) {
                  if (value.data.data.length > 0) {
                    appendRoll(value.data.data[0]);
                    setRealBags(realBags.concat(value.data.data[0]));
                  } else {
                    alert("Sorry, this barcode does not exist.");
                  }
                }
              },
              function (error) {
                console.log(error);
                alert(
                  "Oops. Something went wrong while trying to find the barcode"
                );
              }
            );
          }
        }
      },
      function (error) {
        console.log(error);
        alert("Oops. Something went wrong while trying to find the roll");
      }
    );
  }

  function saveBag(supplierID) {
    createShipment(supplierID).then(
      function (value) {
        const insertId = value.data.data.insertId;
        for (let i = 0; i < realRolls.length; i++) {
          updateRoll(
            realRolls[i].supplier,
            realRolls[i].design,
            realRolls[i].meter,
            realRolls[i].orderID,
            realRolls[i].bag,
            insertId,
            realRolls[i].id
          ).then(
            function (value) {
              if (i + 1 == realRolls.length) {
                setRolls([]);
                setRealRolls([])
                alert("Shipment created successfully!");
              }
            },
            function (error) {
              alert("Something happened. We are on it.");
              console.log(error);
            }
          );
        }
        for (let i = 0; i < realBags.length; i++) {
          updateBag(
            insertId,
            realBags[i].id
          ).then(
            function (value) {
              if (i + 1 == realBags.length) {
                setRolls([]);
                setRealBags([])
                alert("Shipment created successfully!");
              }
            },
            function (error) {
              alert("Something happened. We are on it.");
              console.log(error);
            }
          );
        }
      },
      function (error) {
        console.log(error);
        alert("Woho, something bad happened.");
      }
    );
  }

  return (
    <div className="w-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between">
        <h3>Create Shipment {shipmentNum}</h3>
        <Button onClick={() => handlePageChange(1)}>Shipments List</Button>
      </div>
      <Form>
        <Row>
          <Form.Group>
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              className="py-3"
              type="text"
              placeholder="Scan the barcode of the roll or bag you want put in this shipment"
              onChange={(e) => setRollBarcode(e.target.value)}
              value={rollBarcode}
            />
          </Form.Group>
        </Row>
        <Row>
          <Button
            className="py-3 mt-3 w-100"
            onClick={() => findRoll(rollBarcode)}
          >
            Add Roll or Bag To The Shipment
          </Button>
          <Button
            className="py-3 mt-3 w-100 bg-accent-green border-accent-green"
            onClick={() => saveBag(supplierID)}
          >
            Create Shipment
          </Button>
        </Row>
      </Form>
      <RollTable rolls={rolls} handleDelete={deleteRoll} />
    </div>
  );
}

function RollTable({ rolls, handleDelete }) {
  const reversed = [...rolls].reverse();
  const table = reversed.map((roll) => (
    <div className="w-100 d-flex flex-column mt-3">
      <div className="w-100 d-flex flex-column bg-light p-4 rounded">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <h4>
            {roll.meter != undefined ? `${roll.meter}m` : `Bag ${roll.id}`}
          </h4>
          <Button
            className="bg-accent-red border-accent-red px-3 rounded-pill"
            onClick={() => handleDelete(roll)}
          >
            X
          </Button>
        </div>
        <h5>Barcode: {roll.barcode}</h5>
      </div>
    </div>
  ));

  return <>{rolls.length > 0 ? table : ""}</>;
}

export default CreateShipmentPage;
