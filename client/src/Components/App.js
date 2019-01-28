import React, {Component} from 'react';
import '../CSS/App.css';
import Login from './Login'
import Callback from './Callback'
import api from '../api/api';
import {Switch, Route, withRouter, Redirect} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={Login}/>
                <Route exact path='/callback' component={Callback}/>
            </Switch>
        );
    }
}

export default App;
