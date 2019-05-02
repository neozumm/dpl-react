import React, { Component } from "react";
import "./App.css";
import { Header } from "./global/header";
import { Switch, Route } from "react-router-dom";
import AppList from "./main/appList";
import AppForm from "./main/appForm";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Switch>
                    <Route exact path="/" component={AppList} />
                    <Route path="/appform" component={AppForm} />
                </Switch>
            </div>
        );
    }
}


export default App;
