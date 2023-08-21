import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import instructions from "../../assets/cleaning.png";
import React from "react";
import { createOrder, getOrder } from "../../services/orderServices";
import { getDesign } from "../../services/designServices";
import Select from "react-select";
import { QRCode } from "react-qrcode-logo";
import { createRoll } from "../../services/rollServices";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function CreateRollPage({ supplierID }) {
  return <RollForm supplierID={ supplierID } />;
}

function RollForm({ supplierID }) {
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(0);
  const [selectedDesign, setSelectedDesgin] = useState(0);
  const [meter, setMeter] = useState("");
  const [barcode, setBarcode] = useState("");
  const [rollID, setRollID] = useState("");
  const [tagColor, setTagColor] = useState("");
  const [tagGroupName, setTagGroupName] = useState("");
  const [tagSize, setTagSize] = useState("");
  const [tagDesignNo, setTagDesignNo] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getDesignsByOrder(selectedOrder);
  }, [selectedOrder]);

  useEffect(() => {
    if (barcode != "") {
      handlePrint();
      setMeter("");
      setBarcode("");
    }
  }, [barcode]);

  function fetchData() {
    getOrder(0, supplierID).then(
      function (value) {
        if (value.data.status == 200) {
          setOrders(value.data.data);
        }
      },
      function (error) {
        console.log(error);
        alert("Whopsies. Something gone wrong.");
      }
    );
  }

  function saveRoll(orderID, supplierID, desgin, meter) {
    createRoll(desgin, supplierID, orderID, parseFloat(meter)).then(
      function (value) {
        setRollID(value.data.data.insertId)
        setBarcode(value.data.barcode);
      },
      function (error) {
        console.log(error);
        alert("Woho, something bad happened.");
      }
    );
  }

  function getDesignsByOrder(orderID) {
    getDesign(0, orderID).then(function (value) {
      if (value.data.status == 200) {
        setDesigns(value.data.data);
      }
    });
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="w-100 d-flex flex-column">
      <h3>Create Roll</h3>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Order</Form.Label>
            <Select
              options={orders.map((x) => ({
                value: x.id,
                label: x.description,
              }))}
              onChange={(e) => setSelectedOrder(e.value)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Design</Form.Label>
            <Select
              options={designs.map((x) => ({
                value: x,
                label: `${x.groupName}-${x.designNo}-${x.size}cm-${x.color}`,
              }))}
              onChange={(e) => {
                setSelectedDesgin(e.value.id);
                setTagColor(e.value.color);
                setTagGroupName(e.value.groupName);
                setTagSize(e.value.size);
                setTagDesignNo(e.value.designNo);
              }}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group>
            <Form.Label>Meter</Form.Label>
            <Form.Control
              value={meter}
              className="py-3"
              type="text"
              placeholder="Total meter in this roll"
              onChange={(e) =>
                e.target.value != ""
                  ? setMeter(e.target.value.replace(",", "."))
                  : setMeter("")
              }
            />
          </Form.Group>
        </Row>
        <Row>
          <Button
            className="py-3 mt-3 w-100"
            onClick={() =>
              saveRoll(
                selectedOrder,
                supplierID,
                selectedDesign,
                meter
              )
            }
          >
            Save Roll & Print Barcode
          </Button>
        </Row>
      </Form>
      {barcode != "" ? (
        <BarcodeSticker
          barcode={barcode}
          ref={componentRef}
          meter={meter}
          color={tagColor}
          groupName={tagGroupName}
          size={tagSize}
          designNo={tagDesignNo}
          rollID={rollID}
        />
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
      <h1>{props.meter} m</h1>
      <div className="d-flex justify-content-center align-items-center">
        <div className="d-flex justify-content-start align-items-start flex-column text-start">
          <h4>{props.designNo}</h4>
          <h4>{props.size} cm</h4>
        </div>
        <div className="d-flex justify-content-end align-items-end flex-column text-end">
          <h4>{props.groupName}</h4>
          <h4>{props.color}</h4>
        </div>
      </div>
      <QRCode value={props.barcode} size={100} />
      <p class="font-monospace m-0 p-0">{props.barcode}</p>
      <p className="m-0 p-0"><small>ID: {props.rollID}</small></p>
      <img src={instructions} style={{ width: "100px" }} />
    </div>
  );
});

export default CreateRollPage;
