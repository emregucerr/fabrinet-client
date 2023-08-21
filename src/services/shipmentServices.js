const axios = require("axios");

const baseUrl = "http://localhost:3001/api/shipment";

export async function createShipment(supplier) {
  return new Promise(function (resolve, reject) {
    axios
      .post(baseUrl, {
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

export async function updateShipment(supplier, status, id) {
  return new Promise(function (resolve, reject) {
    axios
      .put(baseUrl, {
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

export async function deleteShipment(id) {
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

export async function getShipment(id, supplier) {
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

export async function getShipmentChecklist(id) {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}/checklistBags?id=${id}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}
