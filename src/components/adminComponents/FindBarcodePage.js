import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import React from "react";
import { getRoll, updateRoll } from "../../services/rollServices";
import { createShipment, getShipment } from "../../services/shipmentServices";
import { getBag, updateBag } from "../../services/bagServices";

function FindBarcode({ supplierID }) {
  const [rolls, setRolls] = useState([]);
  const [realRolls, setRealRolls] = useState([]);
  const [realBags, setRealBags] = useState([]);
  const [rollBarcode, setRollBarcode] = useState("");

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

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

  return (
    <div className="w-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between">
        <h3>Create Shipment</h3>
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
            Find Roll or Bag
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
            {roll.meter != undefined ? `${roll.meter} m` : `Bag ${roll.id}`}
          </h4>
          <Button
            className="bg-accent-red border-accent-red px-3 rounded-pill"
            onClick={() => handleDelete(roll)}
          >
            X
          </Button>
        </div>
        <h5>Barcode: {roll.barcode}</h5>
        <h5>Created At: {roll.createdAt.split("T")[0]}</h5>
        <h5>Design Group Name: {roll.groupName}</h5>
        <h5>Design No: {roll.designNo}</h5>
        <h5>Size No: {roll.size} cm</h5>
        <h5>Color No: {roll.color}</h5>
      </div>
    </div>
  ));

  return <>{rolls.length > 0 ? table : ""}</>;
}

export default FindBarcode;
