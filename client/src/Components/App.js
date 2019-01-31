import React, {Component} from 'react';
import '../CSS/App.css';
import Login from './Login'
import Callback from './Callback'
import Dashboard from './Dashboard'
import {getAccessToken} from '../api/api';
import {Switch, Route} from 'react-router-dom';

//TODO select which artists are related
class App extends Component {
    state = {
        refreshTimer: null,
        gettingNewAccessToken: getAccessToken(),
    };

    componentDidMount() {
        this.setState({
            refreshTimer: setInterval(getAccessToken, 1000 * 60 * 55)
        });
    }

    render() {
        return (
            <Switch>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/callback' component={Callback}/>
                <Route exact path='/dashboard' render={
                    (props) => <Dashboard {...props} gettingNewAccessToken={this.state.gettingNewAccessToken}/>}
                />
            </Switch>
        );
    }
}

export default App;
