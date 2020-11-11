import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import * as serviceWorker from "./serviceWorkerRegistration";

function App() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [state, setState] = useState({
    newVersionAvailable: false,
    waitingWorker: {},
  });

  const onServiceWorkerUpdate = (registration) => {
    console.log("update");
    setState({
      newVersionAvailable: true,
      waitingWorker: registration && registration.waiting,
    });
  };
  const updateServiceWorker = () => {
    const { waitingWorker } = state;
    waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
    this.setState({ newVersionAvailable: false });
    window.location.reload();
  };
  const refreshAction = () => (
    <Button
      className="snackbar-button"
      size="small"
      onClick={updateServiceWorker}
    >
      {"refresh"}
    </Button>
  );

  useEffect(() => {
    const { newVersionAvailable } = this.state;
    if (newVersionAvailable) {
      enqueueSnackbar("A new version was released", {
        persist: true,
        variant: "success",
        action: refreshAction(),
      });
    }
  }, [state]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      serviceWorker.register({ onUpdate: onServiceWorkerUpdate });
    }
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
