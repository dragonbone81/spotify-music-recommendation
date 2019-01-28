import React, {Component} from 'react';
import '../CSS/App.css';
import api from '../api/api';

class Login extends Component {
    spotify = () => {
        // function doStuffOnUnload() {
        //     alert("Child Windows Closed!");
        // }
        // const popup = window.open(
        //     `https://accounts.spotify.com/authorize?client_id=${'53426d0fc31e498aabbdc9cd01e1a122'}&redirect_uri=http://localhost:3001&response_type=code`,
        //     'Login with Spotify',
        //     'width=800,height=600'
        // );
        // popup.addEventListener("unload", doStuffOnUnload, false);
        // window.open('http://localhost:3000/callback')
        window.location = `https://accounts.spotify.com/authorize?client_id=${'e2cdf918537c45a687015a05f70949a8'}&redirect_uri=http://localhost:3001&response_type=code&scope=user-follow-read`
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
