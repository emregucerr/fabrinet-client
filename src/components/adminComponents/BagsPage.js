import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col, Pagination } from "react-bootstrap";
import React from "react";
import { searchBag } from "../../services/bagServices";

function BagsPage() {
  const [subpage, setSubpage] = useState(0);

  return (
    <div className="w-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between mb-4">
        <h1>Bags</h1>
      </div>
      <BagsTable />
    </div>
  );
}

function BagsTable() {
  const [bags, setbags] = useState([]);
  const [pageFirst, setPageFirst] = useState(0);
  const [pageLast, setPageLast] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [unshippedFilter, setUnshippedFilter] = useState(false);

  useEffect(() => {
    fetchData("");
  }, [searchText, unshippedFilter]);

  function fetchData() {
    searchBag(searchText).then(
      function (value) {
        if (value.data.status == 200) {
          var filtered = value.data.data

          if (unshippedFilter) {
            filtered = filtered.filter(unshippedF)
          }

          setbags(filtered);
        }
      },
      function (error) {
        alert("Sorry, something went wrong when fetching the bags.");
        console.log(error);
      }
    );
  }

  function unshippedF (el) {
    return !(el.shipment > 0)
  }

  function handlePageChange(value) {
    if ((value - 1) * 10 < bags.length) {
      setPageFirst((value - 1) * 10);
      if (value * 10 < bags.length) {
        setPageLast(value * 10);
      } else {
        setPageLast(bags.length);
      }
    }
  }

  function handleSearch(e) {
    let text = e.target.value
    setSearchText(setSearchText)
  }

  const reversed = [...bags].reverse().slice(pageFirst, pageLast);

  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <Form.Control placeholder="Search here" type="text" className="mb-3 w-25" onChange={handleSearch}/>
        <Button onClick={() => setUnshippedFilter(!unshippedFilter)} className="bg-light text-black m-3">{unshippedFilter ? "Show All" : "Show Only Unshipped"}</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Barcode</th>
            <th>Supplier</th>

            <th>Shipment</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {bags.length > 0
            ? reversed.map((bag) => (
                <tr>
                  <td>{bag.id}</td>
                  <td>{bag.barcode}</td>
                  <td>{bag.supplierName}</td>
                  <td>{bag.shipment > 0 ? bag.shipment : "Not Shipped"}</td>
                  <td>{bag.createdAt.split("T")[0]}</td>
                </tr>
              ))
            : ""}
        </tbody>
      </Table>
      <Paginator
        itemCount={(bags.length + (10 - (bags.length % 10))) / 10}
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

export default BagsPage;
