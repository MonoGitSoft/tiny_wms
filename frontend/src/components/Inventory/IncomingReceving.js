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
            receiving_package: null,
            receiving_items: null,
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


    async handleSreach() {

        axios.get(`http://127.0.0.1:8000/inventory/receiving_package/${this.state.track_id}`)
            .then(res => {
                console.log(res.data)
                const receiving_pkg = res.data;
                this.setState({ receiving_package: receiving_pkg });
                this.setState({ fromError: null });
                return axios.post(`http://127.0.0.1:8000/items_details/`, receiving_pkg);
            },
                err => {
                    this.setState({ receiving_items: null });
                    this.setState({ fromError: err.response.data });
                    return;
                })
            .then((res) => {
                if (res) {
                    const res_data = res.data;
                    console.log(res_data)
                    res_data.forEach(element => {
                        element.quantity = this.state.receiving_package.items.find(item => item.product_id == element.id).quantity;
                        element.received_quantity = 0
                    }) //this.state.receiving_package.items.find( item => item.id == element.id)

                    console.log("asdasdasdasdasd")
                    console.log(res_data)


                    console.log(res.data)
                    this.setState({ receiving_items: res_data });
                }
            },
                err => {
                    this.setState({ fromError: err.response.data });
                    return;
                })
    }

    handleList = () => {
        console.log(this.state.receiving_package)
        axios.post(`http://127.0.0.1:8000/items_details/`, this.state.receiving_package)
            .then(res => {
                const rec_items = res.data;
                this.setState({ receiving_items: rec_items })
                this.setState({ fromError: null })
            },
                err => {
                    this.setState({ fromError: err.response.data })
                })
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
                    <button onClick={this.resetForm} className="btn btn-primary">Try new search</button>
                </>);
        }
        else {
            return (<></>);
        }
    }


    renderTable() {
        if (!this.state.receiving_items) {
            return (<></>)
        }

        return this.state.receiving_items.map((item, index) => {
            const { id, name, barcode, quantity, received_quantity } = item;
            return (
                <tr key={id}>
                    <td>{name}</td>
                    <td>{barcode}</td>
                    <td>{quantity}</td>
                    <td>{received_quantity}</td>
                </tr>
            )
        })
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
                <button type="button" className="btn btn-primary" onClick={this.handleSreach}>Search</button>
                {infoMsg}
                <div className="container pt-3">
                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Barcode</th>
                                <th scope="col">Sent quantity</th>
                                <th scope="col">Received quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}

/*
table table-dark table-striped
class RecevingItemsTable extends Component {
    constructor(props) {
        super(props);
    }
 
    render() {
        return
        (<>
            <table className="table table-dark table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                </thead>
                </table>
        </>);
    }
}
 
*/

export default IncomingReceving;