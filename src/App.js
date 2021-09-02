import React from "react";
import { Header } from "./Components/Header/index";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { ParticleBg } from "./Components/ParticleBg";
import { Form } from "./Components/Form";
import { Home } from "./Components/Home";
import "./App.css";
import ParticlesBg from "particles-bg";

const wrapRouter = (Component) => {
  const WrappedComponent = () => (
    <Router basename="/">
      <Component />
    </Router>
  );
  return WrappedComponent;
};

export const App = () => {
  return (
    <div className="mainApp">
      <Header />
      {/* <ParticlesBg type="circle" bg={true} /> */}
      <div className="switch">
        <Switch>
          <Route path={["/home", "/"]} exact component={Home} />
          <Route path="/tool" exact component={Form} />
        </Switch>
      </div>
    </div>
  );
};

export default wrapRouter(App);
