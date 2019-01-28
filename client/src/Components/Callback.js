import React, {Component} from 'react';

class Callback extends Component {
    componentDidMount() {
        const token = new URLSearchParams(window.location.href.split("?").pop()).get("access_token");
        localStorage.setItem("access_token", token);
        this.props.history.push("/dashboard");
    }

    render() {
        return (
            null
        );
    }
}

export default Callback;
