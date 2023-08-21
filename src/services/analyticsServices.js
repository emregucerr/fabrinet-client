const axios = require("axios");

const baseUrl = "http://localhost:5001/api";

export async function login(username, password) {
  return new Promise(function (resolve, reject) {
    axios
      .post(`${baseUrl}/auth/login`, { username: username, password: password })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function createSession(token, userID) {
  let config = {
    headers: {
      Authorization: token,
    },
  };
  return new Promise(function (resolve, reject) {
    axios
      .post(
        `${baseUrl}/auth/sessions`,
        { user: userID},
        config
      )
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
