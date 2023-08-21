import { createSession, login } from "./services/analyticsServices";

// eventListenerModule.js
const eventListenerModule = {
  authToken: null,
  userID: null,
  sessionID: null,
  // Function to add event listeners
  addEventListener: function () {
    var authToken;
    var userID
    //login to analytics api
    login("emre", "1234").then(
      function (value) {
        console.log(value.data.token)
        authToken = value.data.token;
        userID = value.data.user._id;
      },
      function (error) {
        console.log(error);
      }
    );

    // Add your event listeners here
    // Example:
    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeyDown);
    // Add more event listeners as needed
  },

  // Event handler functions
  handleClick: function (event) {
    // Handle click events here
    alert("clicked");
  },

  handleKeyDown: function (event) {
    alert("pressed down");
  },
};

export default eventListenerModule;
