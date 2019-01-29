import React, {Component} from 'react';

class Callback extends Component {
    componentDidMount() {
        const urlSearchSpace = new URLSearchParams(window.location.href.split("?").pop());
        const token = urlSearchSpace.get("access_token");
        const refreshToken = urlSearchSpace.get("refresh_token");
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
        this.props.history.push("/dashboard");
    }

    render() {
        return (
            null
        );
    }
}

export default Callback;
