import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { Message, Form, Button } from "semantic-ui-react";

class IncomingReceving extends Component {
    constructor() {
        super();
        this.state = {
            webshops: '',
            webshops_options: '',
            track_id: '',
            receiving_package: '',
            receiving_items: '',
            fromError: null,
        }; //'name', 'barcode', 'item_number', 'quantity', 'webshop_id', 'description', 'notification_num'
        this.baseState = this.state;

        this.handleSreach = this.handleSreach.bind(this);
    }

    handleChange = event => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
        console.log(this.state)
    }

     
    componentDidMount() {
        axios.get(`http://127.0.0.1:8000/webshops/`)
            .then(res => {
                const res_webshops = res.data;
                this.setState({ webshops: res_webshops });
                const options = [];
                res_webshops.forEach(element => options.push({ value: element.name, label: element.name }));
                this.setState({ webshops_options: options });
            })
    }

    resetForm = () => {
        this.setState(this.baseState)

        axios.get(`http://127.0.0.1:8000/webshops/`)
            .then(res => {
                const res_webshops = res.data;
                this.setState({ webshops: res_webshops });
                const options = [];
                res_webshops.forEach(element => options.push({ value: element.name, label: element.name }));
                this.setState({ webshops_options: options });
            })
    }

    async handleSreach () {
        try {
            const pkg = await axios.get(`http://127.0.0.1:8000/inventory/receiving_package/${this.state.track_id}`);
            this.setState({fromError : null})
            const items = await axios.get(`http://127.0.0.1:8000/inventory/receiving_items/${pkg.data.id}`)
            console.log(items.data)
        } catch(err) {
            this.setState({fromError : err.response.data})
            console.log("----------------------------------")
            console.log(err)
        }

        

        //const items = await axios.get(`http://127.0.0.1:8000/inventory/receiving_items/${pkg.data.results.id}`)
        
    }

    InfoMessage = () => {
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
                            header="Add item was successful"
                        />
                    ) : (
                            <Message
                                negative
                                header="Add item was unsuccessful"
                                list={msg}
                            />
                        )}
                    <button onClick={this.resetForm} className="btn btn-primary">Add Receiving Package</button>
                </>);
        }
        else {
            return (<></>);
        }
    }


    render() {
        const infoMsg = this.InfoMessage();
        return (
            <div className="container">
                <h1>Incoming Receving Package</h1>
                <div className="form-group">
                    <label>Track ID:</label>
                    <input type="text" className="form-control" name="track_id" value={this.state.track_id} aria-describedby="trakIDHelper" placeholder="Track ID:" onChange={this.handleChange} />
                    <small id="trakIDHelper" className="form-text text-muted">Track ID, csomagszám (Ezzel lehet nyomon követni a csomagokat a gls vagy bármelyik futárszolgálatnál) </small>
                    <label>Select WebShop (optional):</label>
                    <Select options={this.state.webshops_options} onChange={this.onChangeSelect} />
                </div>
                <button type="button" className="btn btn-primary" onClick={this.handleSreach} >Search</button>
                {infoMsg}
            </div>
        )
    }
}

export default IncomingReceving;