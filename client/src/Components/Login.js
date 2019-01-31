import React, {Component} from 'react';
import '../CSS/App.css';
import api from '../api/api';

class Login extends Component {
    SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";
    spotify = () => {
        window.location = `https://accounts.spotify.com/authorize?client_id=${'e2cdf918537c45a687015a05f70949a8'}&redirect_uri=${this.SERVER_URL}/login&response_type=code&scope=user-follow-read%20user-read-private`
    };

    render() {
        return (
            <div className="App">
                <button onClick={this.spotify}>Login</button>
            </div>
        );
    }
}

export default Login;
