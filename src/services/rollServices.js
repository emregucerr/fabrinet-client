const axios = require("axios");

const baseUrl = "http://localhost:3001/api/roll";

export async function createRoll(design, supplier, orderID, meter) {
  return new Promise(function (resolve, reject) {
    axios
      .post(baseUrl, {
        design: design,
        supplier: supplier,
        orderID: orderID,
        meter: meter,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function getRoll(id = 0, supplier = 0, shipment = 0, barcode = "") {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}?id=${id}&supplier=${supplier}&shipment=${shipment}&barcode=${barcode}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function getRollTable() {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}/table`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function searchRoll(text) {
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

export async function getRollForChecklist(shipment) {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}/inShipment?shipment=${shipment}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function updateRoll(
  supplier,
  design,
  meter,
  orderID,
  bag,
  shipment,
  id
) {
  return new Promise(function (resolve, reject) {
    axios
      .put(baseUrl, {
        supplier: supplier,
        design: design,
        meter: meter,
        orderID: orderID,
        bag: bag,
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

export async function deleteRoll(id) {
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
