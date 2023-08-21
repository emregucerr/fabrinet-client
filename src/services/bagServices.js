const axios = require("axios");

const baseUrl = "http://localhost:3001/api/bag";

export async function createBag(supplierID) {
  return new Promise(function (resolve, reject) {
    axios
      .post(baseUrl, { supplierID: supplierID })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function updateBag(shipment, id) {
  return new Promise(function (resolve, reject) {
    axios
      .put(baseUrl, {
        shipment: shipment,
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

export async function deleteBag(id) {
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

export async function getBag(id, supplier, barcode, shipment) {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}?id=${id}&supplier=${supplier}&barcode=${barcode}&shipment=${shipment}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function searchBag(text) {
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
