import React, { Component } from 'react'
import axios from 'axios';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';
import { Message, Form, Button } from "semantic-ui-react";

class AddWebshop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            url: '',
            email: '',
            fromError: null,
        };

        this.baseState = this.state;
    }

    resetForm = () => {
        this.setState(this.baseState)
    }

    handleChange = event => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
        console.log(this.state)
    }

    handleSubmit = event => {
        event.preventDefault();

        axios.post(`http://127.0.0.1:8000/webshops/`, this.state)
            .then(res => {
                this.setState(res.data);
                this.setState({ fromError: false });
            },
                err => {
                    this.setState({ fromError: err.response.data });
                })
            .catch(error => {
                console.log(error)
            })
    }

    InfoMessage = () => {
        console.log('asdasd')
        if (this.state.fromError != null) {
            var msg = [];
            for (const [key, value] of Object.entries(this.state.fromError)) {
                msg.push(`${key}: ${value}`);
            }

            console.log(msg);
            return (
                <>
                    {!this.state.fromError ? (
                        <Message
                            positive
                            header="Registration was successful"
                        />
                    ) : (
                            <Message
                                negative
                                header="Registration was unsuccessful"
                                list={msg}
                            />
                        )}
                        <button onClick={this.resetForm} className="btn btn-primary">New webshop</button>
                </>);
        }
        else {
            return (<></>);
        }
    }

    render() {
        const infomsg = this.InfoMessage();
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <label>WebShop Name:</label>
                    <div className="form-group">
                        <input type="text" className="form-control" value={this.state.name} name="name" aria-describedby="nameHelper" placeholder="Official name of the webshop" onChange={this.handleChange} />
                        <small id="nameHelper" className="form-text text-muted">Name of the webshop (example: Amazon)</small>
                    </div>
                    <label />URL:<label />
                    <div className="form-group">
                        <input type="url" className="form-control" value={this.state.url} name="url" placeholder="URL" onChange={this.handleChange} />
                        <small id="urleHelper" className="form-text text-muted">https://getbootstrap.com</small>
                    </div>
                    <label />Email:<label />
                    <div className="form-group">
                        <input type="email" className="form-control" name="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} />
                        <small className="form-text text-muted">example@gmail.com</small>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                {infomsg}
            </div>
        )
    }
}
//onSubmit={this.handleSubmit}
export default AddWebshop;