import React from "react";
import ReactDOM, { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import AppRouter from "./router.jsx";

render(
  <AppContainer>
    <AppRouter />
  </AppContainer>,
  document.getElementById("app"),
);

if (module.hot) {
  module.hot.accept("./router.jsx", () => {
    const NextApp = require("./router.jsx").default;
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById("app"),
    );
  });
}
