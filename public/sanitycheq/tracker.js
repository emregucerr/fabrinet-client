const base_url = "https://node-server-dot-fume-test.ey.r.appspot.com";

async function loginWithProjectKey(projectKey) {
  return new Promise(function (resolve, reject) {
    axios
      .post(`${base_url}/api/auth/loginWithProjectKey`, {
        projectKey: projectKey,
      })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export async function createSession(
  token,
  userID,
  windowWidth,
  windowHeight,
  projectId,
  cookies,
  localStorage
) {
  let config = {
    headers: {
      Authorization: token,
    },
  };
  return new Promise(function (resolve, reject) {
    axios
      .post(
        `${base_url}/api/sessions`,
        {
          user: userID,
          windowWidth: windowWidth,
          windowHeight: windowHeight,
          project: projectId,
          cookies: cookies,
          localStorage: localStorage,
        },
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

export async function createEvent(
  token,
  sessionID,
  eventType,
  detail,
  eventOrder,
  location
) {
  let config = {
    headers: {
      Authorization: token,
    },
  };
  return new Promise(function (resolve, reject) {
    axios
      .post(
        `${base_url}/api/events`,
        {
          session: sessionID,
          eventType: eventType,
          detail: detail,
          eventOrder: eventOrder,
          location: location,
        },
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

export async function updateCaseStatus(token, caseID, newStatus) {
  let config = {
    headers: {
      Authorization: token,
    },
  };
  return new Promise(function (resolve, reject) {
    axios
      .put(
        `${base_url}/api/cases?id=${caseID}`,
        {
          status: newStatus,
        },
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

export async function createError(token, caseID, errorType, detail) {
  let config = {
    headers: {
      Authorization: token,
    },
  };
  return new Promise(function (resolve, reject) {
    axios
      .post(
        `${base_url}/api/errors`,
        {
          case: caseID,
          errorType: errorType,
          detail: detail,
        },
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

export async function createConsoleLog(token, caseID, logType, message, order) {
  let config = {
    headers: {
      Authorization: token,
    },
  };
  return new Promise(function (resolve, reject) {
    axios
      .post(
        `${base_url}/api/consoleLogs`,
        {
          case: caseID,
          type: logType,
          message: message,
          order: order
        },
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

function getXPathForElement(element) {
  const idx = (sib, name) =>
    sib
      ? idx(sib.previousElementSibling, name || sib.localName) +
        (sib.localName == name)
      : 1;
  const segs = (elm) =>
    !elm || elm.nodeType !== 1
      ? [""]
      : elm.id && document.getElementById(elm.id) === elm
      ? [`id("${elm.id}")`]
      : [
          ...segs(elm.parentNode),
          `${elm.localName.toLowerCase()}[${idx(elm)}]`,
        ];
  return segs(element).join("/");
}

function getElementByXPath(path) {
  return new XPathEvaluator().evaluate(
    path,
    document.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

var authToken = null;
var userID = null;
var sessionID = null;

// Check if the tracker_ignore query parameter is present
const urlParams = new URLSearchParams(window.location.search);
const ignoreTracker = urlParams.has("tracker_ignore");

if (!ignoreTracker) {
  document.addEventListener("DOMContentLoaded", function () {
    // Query the script element by its class or id
    var scriptTag = document.querySelector(".fume-tracker-script");

    // Check if the script tag is found
    if (!scriptTag) {
      console.error("Tracker script tag not found.");
      return;
    }

    // Retrieve the info from the data attribute
    const projectId = scriptTag.getAttribute("projectKey");

    loginWithProjectKey(projectId).then(
      function (value) {
        authToken = value.data.token;
        userID = value.data.user._id;

        createSession(
          authToken,
          userID,
          window.innerWidth,
          window.innerHeight,
          projectId,
          document.cookie,
          localStorage
        ).then(
          function (value) {
            sessionID = value.data._id;
          },
          function (error) {
            console.log(error);
            alert("Somehting went wrong while registering the session");
          }
        );
      },
      function (error) {
        console.log(error);
        alert("Somehting went wrong while logging in to the analytcis module");
      }
    );

    const eventTypes = [
      "afterprint",
      "beforeprint",
      "blur",
      "click",
      "dbclick",
      "dragstart",
      "drop",
      "error",
      "focus",
      "focusin",
      "focusout",
      "fullscreenerror",
      "input",
      "mouseenter",
      "mouseleave",
      "play",
      "ratechange",
      "resize",
      "reset",
      "scroll",
      "select",
      "submit",
      "wheel",
    ];

    var orderCounter = 0;

    for (var i = 0; i < eventTypes.length; i++) {
      let type = eventTypes[i];

      document.body.addEventListener(type, function (e) {
        let detail = {
          id: e.target.id,
          value: e.target.value,
          tag_name: e.target.tagName,
          inner_HTML: e.target.innerHTML,
          placeholder: e.target.placeholder,
          classes: e.target.classList.value,
          xPath: getXPathForElement(e.target),
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          pathname: window.location.pathname,
        };

        if (type == "scroll") {
          detail.scrollY = window.scrollY;
        }

        if (type == "wheel") {
          detail.deltaY = e.deltaY;
        }

        createEvent(
          authToken,
          sessionID,
          type,
          detail,
          orderCounter,
          window.location.href
        ).then(
          function (value) {
            orderCounter++;
          },
          function (error) {
            console.log(error);
          }
        );
      });
    }
  });
} else {
  var case_id = urlParams.get("case_id");
  var logCount = 0;

  (function () {
    var logs = [];

    // Store original methods
    var oldLog = console.log;
    var oldWarn = console.warn;
    var oldError = console.error;
    var oldInfo = console.info;

    function captureLog(type, ...args) {

      var formattedMessage = `${args.join(" ")}`;

      // Query the script element by its class or id
      var scriptTag = document.querySelector(".fume-tracker-script");

      // Check if the script tag is found
      if (!scriptTag) {
        console.error("Tracker script tag not found.");
        return;
      }

      // Retrieve the info from the data attribute
      var projectId = scriptTag.getAttribute("projectKey");

      loginWithProjectKey(projectId).then(
        function (value) {
          const authToken = value.data.token;
          const userID = value.data.user._id;

          createConsoleLog(authToken, case_id, type, formattedMessage, logCount).then(
            function (value) {
              //updateCaseStatus(authToken, case_id, "Failed");
            },
            function (error) {
              console.log(error);
            }
          );
        },
        function (error) {
          alert(
            "Something went wrong while logging into to the analytics module"
          );
        }
      );

      logCount += 1;
      logs.push(formattedMessage);
    }

    console.log = function (...args) {
      captureLog("LOG", ...args);
      oldLog.apply(console, args);
    };

    console.warn = function (...args) {
      captureLog("WARN", ...args);
      oldWarn.apply(console, args);
    };

    console.error = function (...args) {
      captureLog("ERROR", ...args);
      oldError.apply(console, args);
    };

    console.info = function (...args) {
      captureLog("INFO", ...args);
      oldInfo.apply(console, args);
    };

    console.getLogs = function () {
      return logs.join("\n");
    };

    console.clearLogs = function () {
      logs = [];
    };
  })();

  window.onerror = function (message, source, lineno, colno, error) {
    console.error(
      "An error occurred:",
      message,
      "at line",
      lineno,
      "in",
      source
    );

    // Query the script element by its class or id
    var scriptTag = document.querySelector(".fume-tracker-script");

    // Check if the script tag is found
    if (!scriptTag) {
      console.error("Tracker script tag not found.");
      return;
    }

    // Retrieve the info from the data attribute
    var projectId = scriptTag.getAttribute("projectKey");

    loginWithProjectKey(projectId).then(
      function (value) {
        const authToken = value.data.token;
        const userID = value.data.user._id;

        const detail = {
          Message: message,
          Source: source,
          "Line No": lineno,
          "Column No": colno,
        };

        createError(authToken, case_id, "regular", detail).then(
          function (value) {
            updateCaseStatus(authToken, case_id, "Failed");
          },
          function (error) {
            console.log(error);
          }
        );
      },
      function (error) {
        alert(
          "Something went wrong while logging into to the analytics module"
        );
      }
    );

    return false;
  };
  window.addEventListener("unhandledrejection", function (event) {
    console.error("An unhandled promise rejection occurred:", event.reason);
    // Query the script element by its class or id
    var scriptTag = document.querySelector(".fume-tracker-script");

    // Check if the script tag is found
    if (!scriptTag) {
      console.error("Tracker script tag not found.");
      return;
    }

    // Retrieve the info from the data attribute
    var projectId = scriptTag.getAttribute("projectKey");

    loginWithProjectKey(projectId).then(
      function (value) {
        const authToken = value.data.token;
        const userID = value.data.user._id;

        const detail = {
          Reason: event.reason,
        };

        createError(authToken, case_id, "unhandledrejection", detail).then(
          function (value) {
            updateCaseStatus(authToken, case_id, "Failed");
          },
          function (error) {
            console.log(error);
          }
        );
      },
      function (error) {
        alert(
          "Something went wrong while logging into to the analytics module"
        );
      }
    );
  });
}
