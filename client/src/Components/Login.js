import React, {Component} from 'react';
import '../CSS/Dashboard.css';

class Login extends Component {
    SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";
    CLIENT_ID = process.env.REACT_APP_CLIENT_ID || "xxx";
    spotify = () => {
        window.location = `https://accounts.spotify.com/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${this.SERVER_URL}/login&response_type=code&scope=user-follow-read%20user-read-private%20playlist-modify-private`
    };

    render() {
        return (
            <div className="Login">
                <span className="login-title">Spotify Recommendation App</span>
                <div className="login-div" onClick={this.spotify}>
                    <img className="spotify-img" alt="Spotify"
                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/500px-Spotify_logo_without_text.svg.png"/>

                    <span>Connect with Spotify</span>
                    {/*<span>Login to use app</span>*/}
                    {/*<button onClick={this.spotify}>Login</button>*/}
                </div>
            </div>
        );
    }
}

export default Login;
