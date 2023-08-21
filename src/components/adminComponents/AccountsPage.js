import { useEffect, useState } from "react";
import "../../App.css";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import { getUser, createUser } from "../../services/userServices";
import React from "react";

function AccountsPage() {
  const [subpage, setSubpage] = useState(0);
  const [username, setUsername] = useState("");
  const [desc, setDesc] = useState("");
  const [password, setPassword] = useState("");

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  function renderSubpage() {
    switch (subpage) {
      case 0:
        return <UsersTable />;
        break;
      default:
        return <UsersTable />;
        break;
    }
  }

  function submitUser() {
    createUser(username, desc, 2, password).then(
      function (value) {
        forceUpdate();
      },
      function (error) {
        alert("Oops, something went wrong while registering a new supplier");
        console.log(error);
      }
    );
  }

  return (
    <div className="w-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between mb-4">
        <h1>Accounts</h1>
      </div>
      <div className="mb-4">
        <div className="d-flex w-100 justify-content-between flex-row mb-3">
          <h3>Create New Supplier Account</h3>
          <Button variant="primary" className="px-4" onClick={submitUser}>
            Create Account
          </Button>
        </div>
        <Form className="mb-3">
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name of the company or representative"
                onChange={(e) => setDesc(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Create a password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Row>
        </Form>
      </div>
      {renderSubpage()}
    </div>
  );
}

function UsersTable() {
  const [users, setUsers] = useState([]);

  function fetchData() {
    getUser().then(
      function (value) {
        if (value.data.status == 200) {
          setUsers(value.data.data);
        }
      },
      function (error) {
        alert("Oops. Something wnet wrong when retrieving users.");
        console.log(error);
      }
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  return users.length > 0 ? (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Access</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.access == 1 ? "Admin" : "Supplier"}</td>
            <td>{user.createdAt.split("T")[0]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <h4>No users yet...</h4>
  );
}

export default AccountsPage;
