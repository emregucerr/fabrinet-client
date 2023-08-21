import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col, Pagination } from "react-bootstrap";
import React from "react";
import {
  createOrder,
  getOrder,
  deleteOrder,
  completeOrder,
  searchOrder,
} from "../../services/orderServices";
import {
  createDesign,
  getDesign,
  getDesignColumn,
} from "../../services/designServices";
import { getUser } from "../../services/userServices";
import ReactExport from "react-export-excel";
import Creatable from "react-select/creatable";
//https://github.com/moroshko/react-autosuggest#installation

function OrdersPage() {
  const [subpage, setSubpage] = useState(0);

  function renderSubpage() {
    switch (subpage) {
      case 0:
        return <OrdersTable />;
        break;
      case 1:
        return (
          <CreateOrder
            initialDesigns={[]}
            initialDesc=""
            initialSupplier={0}
            isCreateMode={true}
            handlePageChange={setSubpage}
          />
        );
        break;
      default:
        return <OrdersPage />;
        break;
    }
  }

  function renderActionButton() {
    switch (subpage) {
      case 0:
        return (
          <Button className="px-4" onClick={() => setSubpage(1)}>
            Create Order
          </Button>
        );
        break;
      case 1:
        return (
          <div className="d-flex flex-row">
            <Button
              className="px-4 bg-accent-red border-accent-red mx-3"
              onClick={() => setSubpage(0)}
            >
              Cancel
            </Button>
          </div>
        );
        break;
      default:
        return (
          <Button className="px-4" onClick={() => setSubpage(1)}>
            Create Order
          </Button>
        );
        break;
    }
  }

  return (
    <div className="w-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between mb-4">
        <h1>{subpage == 1 ? "Create Order" : "Orders"}</h1>
        {renderActionButton()}
      </div>
      {renderSubpage()}
    </div>
  );
}

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [pageFirst, setPageFirst] = useState(0);
  const [pageLast, setPageLast] = useState(10);
  const [searchText, setSearchText] = useState("")
  const [incompleteFilter, setIncompleteFilter] = useState(false)

  useEffect(() => {
    fetchData();
  }, [searchText, incompleteFilter]);

  function fetchData() {
    searchOrder(searchText).then(
      function (value) {
        if (value.data.status == 200) {
          var filtered = value.data.data;
          if (incompleteFilter) {
            filtered = filtered.filter(incompleteF)
          }

          setOrders(filtered);
        }
      },
      function (error) {
        alert("Sorry, something went wrong when fetching the orders.");
        console.log(error);
      }
    );
  }

  function incompleteF (el) {
    return el.isComplete == 0;
  }

  function handleComplete(orderID, status) {
    completeOrder(orderID, status == 1 ? 0 : 1).then(
      function (value) {
        if (value.data.status == 200) {
          fetchData();
        }
      },
      function (error) {
        alert("Sorry, something went wrong when fetching the orders.");
        console.log(error);
      }
    );
  }

  function handlePageChange(value) {
    if ((value - 1) * 10 < orders.length) {
      setPageFirst((value - 1) * 10);
      if (value * 10 < orders.length) {
        setPageLast(value * 10);
      } else {
        setPageLast(orders.length);
      }
    }
  }

  function handleSearch(e) {
    let text = e.target.value
    setSearchText(text)
  }

  const reversed = [...orders].reverse().slice(pageFirst, pageLast);

  return (
    <div>
      <div className="d-flex flex-row justify-content-between">
        <Form.Control placeholder="Search here" type="text" className="mb-3 w-25" onChange={handleSearch}/>
        <Button className="m-3 bg-light text-black" onClick={() => setIncompleteFilter(!incompleteFilter)}>{incompleteFilter ? "Show All" : "Show Only Incomplete"}</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Change Status</th>
            <th>Checklist</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0
            ? reversed.map((order) => (
                <tr>
                  <td>{order.id}</td>
                  <td>{order.description}</td>
                  <td>{order.supplierName}</td>
                  <td>{order.isComplete == 1 ? "Completed" : "In progress"}</td>
                  <td>{order.createdAt.split("T")[0]}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <Button
                        onClick={() =>
                          handleComplete(order.id, order.isComplete)
                        }
                      >
                        {order.isComplete == 1 ? "Take Back" : "Complete Order"}
                      </Button>
                    </div>
                  </td>
                  <td className="d-flex justify-content-center">
                    <DownloadExcel
                      orderID={order.id}
                      orderDesc={order.description}
                    />
                  </td>
                </tr>
              ))
            : ""}
        </tbody>
      </Table>
      <Paginator
        itemCount={(orders.length + (10 - (orders.length % 10))) / 10}
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

function CreateOrder({
  initialDesigns,
  initialDesc,
  initialSupplier,
  isCreateMode,
  handlePageChange,
}) {
  const [desc, setDesc] = useState(initialDesc);
  const [supplier, setSupplier] = useState(initialSupplier);
  const [designs, setDesigns] = useState(initialDesigns);
  const [groupNo, setGroupNo] = useState("");
  const [designNo, setDesignNo] = useState("");
  const [colorNo, setColorNo] = useState("");
  const [size, setSize] = useState(0);
  const [meter, setMeter] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [groupNoList, setGroupNoList] = useState([]);
  const [designNoList, setDesignNoList] = useState([]);
  const [colorNoList, setColorNoList] = useState([]);
  const [sizeList, setSizeList] = useState([]);

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    getUser(0, 2).then(
      function (value) {
        if (value.data.status == 200) {
          setSupplierList(value.data.data);
        }
      },
      function (error) {
        alert("Oops something went wrong when downloading the suppliers.");
        console.log(error);
      }
    );

    getDesignColumn("groupName").then(
      function (value) {
        if (value.data.status == 200) {
          var arr = value.data.data.map((x) => ({
            value: x.groupName,
            label: x.groupName,
          }));
          setGroupNoList(arr);
        }
      },
      function (error) {
        alert("Whoops. No idea what happened.");
        console.log(error);
      }
    );

    getDesignColumn("designNo").then(
      function (value) {
        if (value.data.status == 200) {
          var arr = value.data.data.map((x) => ({
            value: x.designNo,
            label: x.designNo,
          }));
          setDesignNoList(arr);
        }
      },
      function (error) {
        alert("Whoops. No idea what happened.");
        console.log(error);
      }
    );

    getDesignColumn("color").then(
      function (value) {
        if (value.data.status == 200) {
          var arr = value.data.data.map((x) => ({
            value: x.color,
            label: x.color,
          }));
          setColorNoList(arr);
        }
      },
      function (error) {
        alert("Whoops. No idea what happened.");
        console.log(error);
      }
    );

    getDesignColumn("size").then(
      function (value) {
        if (value.data.status == 200) {
          var arr = value.data.data.map((x) => ({
            value: x.size,
            label: x.size,
          }));
          setSizeList(arr);
        }
      },
      function (error) {
        alert("Whoops. No idea what happened.");
        console.log(error);
      }
    );
  }

  function appendDesign() {
    const savedMeter = meter;
    setDesigns(
      designs.concat({
        groupNo: groupNo,
        designNo: designNo,
        colorNo: colorNo,
        size: size,
        meter: parseFloat(savedMeter),
      })
    );
    setMeter("");
  }

  function deleteDesign(toRemove) {
    const arr = designs;
    const index = arr.indexOf(toRemove);
    if (index > -1) {
      arr.splice(index, 1);
      setDesigns(arr);
      forceUpdate();
    }
  }

  function submitOrder(desc, supplier, designs) {
    createOrder(desc, supplier).then(
      function (value) {
        for (let i = 0; i < designs.length; i++) {
          createDesign(
            designs[i].colorNo,
            designs[i].groupNo,
            designs[i].size,
            designs[i].meter,
            designs[i].designNo,
            value.data.data.insertId
          ).then(
            function (value) {
              console.log(value);
            },
            function (error) {
              alert("Oops. Something went wrong while adding the designs.");
              console.log(error);
            }
          );
          if (i == designs.length - 1) {
            handlePageChange(0);
          }
        }
      },
      function (error) {
        alert("Oops. Something went wrong");
        console.log(error);
      }
    );
  }

  return (
    <div className="w-100 d-flex flex-column">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>
            <h4>Order Description</h4>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          />
          <Form.Text className="text-muted">
            This is just a short explanation to identify the order in the
            future.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            <h4>Supplier</h4>
          </Form.Label>
          <Form.Select onChange={(e) => setSupplier(e.target.value)}>
            <option value={0}>Select Supplier</option>
            {supplierList.map((supplier) => (
              <option value={supplier.id}>{supplier.description}</option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            Select the supplier you wish to send this order.
          </Form.Text>
        </Form.Group>
      </Form>
      <h3>Add Design</h3>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Design Group Name</Form.Label>
            <Creatable
              options={groupNoList}
              onChange={(e) => setGroupNo(e.value)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Design No</Form.Label>
            <Creatable
              options={designNoList}
              onChange={(e) => setDesignNo(e.value)}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Color No</Form.Label>
            <Creatable
              options={colorNoList}
              onChange={(e) => setColorNo(e.value)}
            />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Size(cm)</Form.Label>
            <Creatable options={sizeList} onChange={(e) => setSize(e.value)} />
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Meter</Form.Label>
            <Form.Control
              onChange={(e) =>
                e.target.value != ""
                  ? setMeter(e.target.value.replace(",", "."))
                  : setMeter("")
              }
              value={meter}
              placeholder="Enter the meter value"
            />
          </Form.Group>
        </Row>
        <div className="d-flex flex-row">
          <Button className="py-3 w-100 mx-2" onClick={appendDesign}>
            Add Design
          </Button>
          <Button
            className="w-100 py-3 mx-2 bg-accent-green border-accent-green"
            onClick={() => submitOrder(desc, supplier, designs)}
          >
            Complete Order
          </Button>
        </div>
      </Form>
      <DesignTable designs={designs} handleDelete={deleteDesign} />
    </div>
  );
}

function DesignTable({ designs, handleDelete }) {
  const reversed = [...designs].reverse();
  const table = reversed.map((design) => (
    <div className="w-100 d-flex flex-column mt-3">
      <div className="w-100 d-flex flex-column bg-light p-4 rounded">
        <div className="d-flex flex-row justify-content-between align-items-center">
          <h4>
            {design.meter}m {design.groupNo}
          </h4>
          <Button
            className="bg-accent-red border-accent-red px-3 rounded-pill"
            onClick={() => handleDelete(design)}
          >
            X
          </Button>
        </div>
        <h5>
          {design.designNo} - {design.colorNo} - {design.size}cm
        </h5>
      </div>
    </div>
  ));

  return <>{designs.length > 0 ? table : ""}</>;
}

function DownloadExcel({ orderID, orderDesc }) {
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  const [designs, setDesigns] = useState([]);

  function fetchData() {
    getDesign(0, orderID).then(
      function (value) {
        setDesigns(value.data.data);
        console.log(value.data);
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
    <ExcelFile element={<Button>Download Data</Button>} filename={orderDesc}>
      <ExcelSheet data={designs} name={"Order items"}>
        <ExcelColumn label="Id" value="id" />
        <ExcelColumn label="Group Name" value="groupName" />
        <ExcelColumn label="Design No" value="designNo" />
        <ExcelColumn label="Size" value="size" />
        <ExcelColumn label="Color" value="color" />
        <ExcelColumn label="Meter" value="meter" />
        <ExcelColumn label="Order ID" value="orderID" />
      </ExcelSheet>
    </ExcelFile>
  );
}

export default OrdersPage;
