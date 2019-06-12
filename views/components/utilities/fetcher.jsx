import React from "react";
import Alert from "react-s-alert";
// import 'react-s-alert/dist/s-alert-default.css';
import Alerts from "../elements/alerts.jsx";
import "whatwg-fetch";

const Fetcher = function(path, method = "GET", body, init = null) {
  if (!init) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    init = { method, headers, credentials: "include" };

    if (method == "POST" || method == "PUT") {
      init.body = JSON.stringify(body);
    }
  }

  return fetch(path, init)
    .then(function(response) {
      if (response.status == 404) {
        throw response;
      }
      return response.json();
    })
    .then(function(response) {
      if (response != null) {
        if (response.error) {
          Alert.error(response.error);
        }
        if (response.message) {
          Alert.info(response.message);
        }
      }
      return response;
    });
};
export default Fetcher;
