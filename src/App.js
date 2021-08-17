import React from "react";
import { Header } from "./Components/Header/index";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ParticleBg } from "./Components/ParticleBg";
import { Form } from "./Components/Form";
import { Home } from "./Components/Home";
import "./App.css";

export const App = () => {
  return (
    // <div className="mainApp">
    <Router>
      <Route path="/" component={Header} />
      <ParticleBg />
      <Switch>
        <Route
          path={["/home", "/"]}
          exact
          children={<ParticleBg component={<Home />} />}
        />
        <Route path="/tool" children={<ParticleBg component={<Form />} />} />
      </Switch>
      {/* <About />
          <Reports  />
          <Contact  />
          <Footer  /> */}
    </Router>
    // </div>
  );
};

export default App;
