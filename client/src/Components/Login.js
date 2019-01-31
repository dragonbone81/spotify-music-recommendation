import React, {Component} from 'react';
import '../CSS/App.css';

class Login extends Component {
    SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";
    CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "client_id";
    spotify = () => {
        window.location = `https://accounts.spotify.com/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${this.SERVER_URL}/login&response_type=code&scope=user-follow-read%20user-read-private`
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
