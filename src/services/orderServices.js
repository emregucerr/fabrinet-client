const axios = require("axios");

const baseUrl = "http://localhost:3001/api/order";

export async function createOrder(description, supplier) {
  return new Promise(function (resolve, reject) {
    axios
      .post(baseUrl, {
        description: description,
        supplier: supplier,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function updateOrder(description, supplier, status, id) {
  return new Promise(function (resolve, reject) {
    axios
      .put(baseUrl, {
        description: description,
        supplier: supplier,
        status: status,
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

export async function completeOrder(id, status) {
  return new Promise(function (resolve, reject) {
    axios
      .put(`${baseUrl}/complete`, {
        status: status,
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

export async function getOrder(id, supplier) {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}?id=${id}&supplier=${supplier}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function searchOrder(text) {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}/search?text=${text}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function deleteOrder(id) {
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
