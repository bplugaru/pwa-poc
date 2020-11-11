import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import * as serviceWorker from "./serviceWorkerRegistration";

function App() {
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    newVersionAvailable: false,
    waitingWorker: {},
  });

  const onServiceWorkerUpdate = (registration) => {
    console.log("update", registration);
    setState({
      newVersionAvailable: true,
      waitingWorker: registration && registration.waiting,
    });
  };
  const updateServiceWorker = () => {
    const { waitingWorker } = state;
    console.log(waitingWorker)
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
    const { newVersionAvailable } = state;
    console.log('newVersionAvailable', newVersionAvailable)
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
      console.log('production')
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
          Learn React?
        </a>
      </header>
    </div>
  );
}

export default App;
