import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import React from "react";
import { QRCode } from "react-qrcode-logo";
import { getRoll, updateRoll } from "../../services/rollServices";
import { createBag } from "../../services/bagServices";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function CreateSackPage({ supplierID }) {
  return <RollForm supplierID={{ supplierID }} />;
}

function RollForm({ supplierID }) {
  const [rolls, setRolls] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [bagID, setBagID] = useState(0);
  const [rollBarcode, setRollBarcode] = useState("");

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  function appendRoll(roll) {
    if (rolls.length > 4) {
      alert("You cannot add more than 5 rolls in a bag")
    } else {
      setRolls(rolls.concat(roll));
      setRollBarcode("");
    }
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
          } else {
            alert("Sorry, this roll does not exist.");
          }
        }
      },
      function (error) {
        console.log(error);
        alert("Oops. Something went wrong while trying to find the roll");
      }
    );
  }

  useEffect(() => {
    if (barcode != "") {
      handlePrint();
      setBarcode("");
    }
  }, [barcode]);

  function saveBag(supplierID) {
    createBag(supplierID).then(
      function (value) {
        setBarcode(value.data.barcode);
        const insertId = value.data.data.insertId;
        for (let i = 0; i < rolls.length; i++) {
          updateRoll(
            rolls[i].supplier,
            rolls[i].design,
            rolls[i].meter,
            rolls[i].orderID,
            insertId,
            rolls[i].shipment,
            rolls[i].id
          ).then(
            function (value) {
              if (i + 1 == rolls.length) {
                setRolls([]);
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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="w-100 d-flex flex-column">
      <h3>Create Bag</h3>
      <Form>
        <Row>
          <Form.Group>
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              className="py-3"
              type="text"
              placeholder="Scan the barcode of the roll you want put in this bag"
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
            Add Roll To The Bag
          </Button>
          <Button
            className="py-3 mt-3 w-100 bg-accent-green border-accent-green"
            onClick={() => saveBag(supplierID.supplierID)}
          >
            Save Bag & Print Barcode
          </Button>
        </Row>
      </Form>
      <RollTable rolls={rolls} handleDelete={deleteRoll} />
      {barcode != "" ? (
        <BarcodeSticker barcode={barcode} ref={componentRef} />
      ) : (
        ""
      )}
    </div>
  );
}

const BarcodeSticker = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="d-flex flex-column w-100 justify-content-center align-items-center mt-4"
    >
      <QRCode value={props.barcode} />
      <p class="font-monospace">{props.barcode}</p>
    </div>
  );
});

function RollTable({ rolls, handleDelete }) {
  const reversed = [...rolls].reverse();
  const table = reversed.map((roll) => (
    <div className="w-100 d-flex flex-column mt-3">
      <div className="w-100 d-flex flex-column bg-light p-4 rounded">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <h4>{roll.meter}m</h4>
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

export default CreateSackPage;
