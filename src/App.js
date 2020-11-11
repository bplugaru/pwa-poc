import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import * as serviceWorker from "./serviceWorkerRegistration";

function App() {
  const [counter, setCounter] = React.useState(6000);

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
    console.log(waitingWorker);
    waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
    setState({ newVersionAvailable: false });
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
    console.log("newVersionAvailable", newVersionAvailable);
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
      console.log("production", serviceWorker);
      serviceWorker.register({ onUpdate: onServiceWorkerUpdate });
    }
  }, []);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter % 60) {
      console.log("trigger");
      serviceWorker.register();
    }
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <div>Countdown: {counter}</div>
      </header>
    </div>
  );
}

export default App;
