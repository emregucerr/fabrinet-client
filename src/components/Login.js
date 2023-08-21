import logo from "../assets/fabrinet.png";
import "../App.css";
import "../custom.scss";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { login } from "../services/userServices";
import { useState } from "react";

function Login({ handleLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLoginClick() {
    login(username, password).then(
      function (value) {
        if (value.data.data.length == 1) {
          localStorage.setItem('loginData', value.data.data[0]);
          handleLoginSuccess(value.data.data[0]);
        } else {
          alert("Wrong username or password")
        }
      },
      function (error) {
        alert("Oops something wrong happened! We are on it.");
      }
    );
  }

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <Form className="w-25 mt-4">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>
            <h5>Username</h5>
          </Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            className="p-3"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Form className="w-25">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>
            <h5>Password</h5>
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            className="p-3"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className="w-100 p-3" onClick={handleLoginClick}>
          Login
        </Button>
      </Form>
      <h6 className="text-muted bottom-0 position-absolute fw-light">
        Ⓒ 2022 Fabriteks Tekstil San. Tic. A.S.
      </h6>
    </div>
  );
}

export default Login;
