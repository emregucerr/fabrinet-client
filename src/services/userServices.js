const axios = require("axios");

const baseUrl = "http://localhost:3001/api/user";

export async function login(username, password) {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}/login?username=${username}&password=${password}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function createUser(username, description, access, password) {
  return new Promise(function (resolve, reject) {
    axios
      .post(baseUrl, {
        username: username,
        description: description,
        access: access,
        password: password,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function getUser(id, access) {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}?id=${id}&access=${access}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function deleteUser(id) {
  return new Promise(function (resolve, reject) {
    axios
      .delete(baseUrl, {
        id: id,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
