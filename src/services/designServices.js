const axios = require("axios");

const baseUrl = "http://localhost:3001/api/design";

export async function createDesign(
  color,
  groupName,
  size,
  meter,
  designNo,
  orderID
) {
  return new Promise(function (resolve, reject) {
    axios
      .post(baseUrl, {
        color: color,
        groupName: groupName,
        size: size,
        meter: meter,
        designNo: designNo,
        orderID: orderID,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function getDesign(id, orderID) {
  return new Promise(function (resolve, reject) {
    axios
      .get(`${baseUrl}?id=${id}&orderID=${orderID}`)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}

export async function getDesignColumn(column) {
    return new Promise(function (resolve, reject) {
      axios
        .get(`${baseUrl}/column?column=${column}`)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });
  }
