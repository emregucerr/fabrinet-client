import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col, Pagination } from "react-bootstrap";
import React from "react";
import { getRollTable, searchRoll } from "../../services/rollServices";

function RollsPage() {
  const [subpage, setSubpage] = useState(0);

  return (
    <div className="w-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between mb-4">
        <h1>Rolls</h1>
      </div>
      <RollsTable />
    </div>
  );
}

function RollsTable() {
  const [rolls, setRolls] = useState([]);
  const [pageFirst, setPageFirst] = useState(0);
  const [pageLast, setPageLast] = useState(10);
  const [unshippedFilter, setUnshippedFilter] = useState(false)
  const [unbaggedFilter, setUnbaggedFilter] = useState(false)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    fetchData();
  }, [unshippedFilter, unbaggedFilter, searchText]);

  function fetchData() {
    console.log(1)
    searchRoll(searchText).then(
      function (value) {
        if (value.data.status == 200) {
          var filtered = value.data.data
          if (unbaggedFilter) {
            filtered = filtered.filter(unbaggedF)
          }
          if (unshippedFilter) {
            filtered = filtered.filter(unshippedF)
          }
          setRolls(filtered);
        }
      },
      function (error) {
        alert("Sorry, something went wrong when fetching the rolls.");
        console.log(error);
      }
    );
  }

  function unshippedF (el) {
    return !(el.shipment > 0)
  }

  function unbaggedF (el) {
    return !(el.bag > 0)
  }

  function handleFilterUnbagged() {
    setUnbaggedFilter(!unbaggedFilter)
  }

  function handleFilterUnshipped() {
    setUnshippedFilter(!unshippedFilter)
  }

  function handlePageChange(value) {
    if ((value - 1) * 10 < rolls.length) {
      setPageFirst((value - 1) * 10);
      if (value * 10 < rolls.length) {
        setPageLast(value * 10);
      } else {
        setPageLast(rolls.length);
      }
    }
  }

  function handleSearch(e) {
    setSearchText(e.target.value)
  }

  const reversed = [...rolls].reverse().slice(pageFirst, pageLast);

  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <Form.Control placeholder="Search here" type="text" className="mb-3 w-25" onChange={handleSearch}/>
        <div className="p-3">
          <Button className="mx-1 bg-light text-black" onClick={handleFilterUnshipped}>{unshippedFilter ? "Show All" : "Show Only Unshipped"}</Button>
          <Button className="mx-1 bg-light text-black" onClick={handleFilterUnbagged}>{unbaggedFilter ? "Show All" : "Show Only Unbagged"}</Button>
        </div>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Barcode</th>
            <th>Supplier</th>
            <th>Order</th>
            <th>Design Group Name</th>
            <th>Design No</th>
            <th>Size</th>
            <th>Color</th>
            <th>Meter</th>
            <th>Bag</th>
            <th>Shipment</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {rolls.length > 0
            ? reversed.map((roll) => (
                <tr>
                  <td>{roll.id}</td>
                  <td>{roll.barcode}</td>
                  <td>{roll.supplierName}</td>
                  <td>{roll.orderDesc}</td>
                  <td>{roll.groupName}</td>
                  <td>{roll.designNo}</td>
                  <td>{roll.size}</td>
                  <td>{roll.color}</td>
                  <td>{roll.meter}</td>
                  <td>{roll.bag > 0 ? roll.bag : "Not Bagged"}</td>
                  <td>{roll.shipment > 0 ? roll.shipment : "Not Shipped"}</td>
                  <td>{roll.createdAt.split("T")[0]}</td>
                </tr>
              ))
            : ""}
        </tbody>
      </Table>
      <Paginator
        itemCount={(rolls.length + (10 - (rolls.length % 10))) / 10}
        handlePageChange={handlePageChange}
      />
    </div>
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

export default RollsPage;
