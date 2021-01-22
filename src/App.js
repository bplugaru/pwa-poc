import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import * as serviceWorker from "./serviceWorkerRegistration";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const [counter, setCounter] = React.useState(6000);

  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    newVersionAvailable: false,
    waitingWorker: {},
    worker: null,
  });

  const onSaveWorkerRef = (registration) => {
    setState((prevState) => ({
      ...prevState,
      worker: registration,
    }));
  };

  const onServiceWorkerUpdate = (registration) => {
    setState((prevState) => ({
      ...prevState,
      newVersionAvailable: true,
      waitingWorker: registration && registration.waiting,
    }));
  };
  const updateServiceWorker = () => {
    const { waitingWorker } = state;
    waitingWorker && waitingWorker.postMessage({ type: "SKIP_WAITING" });
    setState({ newVersionAvailable: false });
    window.location.reload(true);
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
      serviceWorker.register({
        onUpdate: onServiceWorkerUpdate,
        ref: onSaveWorkerRef,
      });
    }
  }, [serviceWorker]);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter % 10 === 0) {
      if (state.worker && state.worker.update) {
        state.worker.update();
      }
    }
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/user">User management</Link>
            </li>
            <li>
              <Link to="/about">About us</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/about">
            <h1> about us</h1>
          </Route>
          <Route path="/user">
            <h1> user management</h1>
          </Route>
          <Route path="/">
            <h1> home sweet home v6</h1>
          </Route>
        </Switch>
      </div>
      <header className="App-header">
        <div>DFS: {counter}</div>
      </header>
    </Router>
  );
}

export default App;
