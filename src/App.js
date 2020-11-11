import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import * as serviceWorker from "./serviceWorkerRegistration";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const [counter, setCounter] = React.useState(6000);
  const [req, setReq] = React.useState({});

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
      serviceWorker.register({ onUpdate: onServiceWorkerUpdate }).then((req) => {
        console.log(req);
        setReq(req)
      });
    }
  }, []);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter % 60 === 0) {
      console.log("trigger from counter", req);
      // serviceWorker.register();
      req && req.update()
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
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/about">
            <h1> about</h1>
          </Route>

          <Route path="/">
            <h1> home</h1>
          </Route>
        </Switch>
      </div>
      <header className="App-header">
        <div>Countdown: {counter}</div>
      </header>
    </Router>
  );
}

export default App;
