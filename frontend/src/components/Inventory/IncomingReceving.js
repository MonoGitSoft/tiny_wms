import React, { Component } from 'react'
import axios from 'axios'
import Select, { components } from 'react-select'
import { Message, Form, Button } from "semantic-ui-react";


class IncomingReceving extends Component {
    constructor(props) {
        super(props);
        this.state = {
            webshops: '',
            webshops_options: '',
            track_id: '',
            receiving_package: null,
            receiving_packages: null,
            receiving_items: null,
            select_pack:null,
            fromError: null,
            scannerInput: null,
        }; //'name', 'barcode', 'item_number', 'quantity', 'webshop_id', 'description', 'notification_num'
        this.baseState = this.state;
        this.handleSreach = this.handleSreach.bind(this);

    }

    handleChange = event => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }


    componentDidMount() {
        axios.get(`http://127.0.0.1:8000/inventory/receiving_package/all/`)
            .then(res => {
                this.setState({ receiving_packages: res.data});
                const options = [];
                res.data.forEach(element => options.push({ value: element.id, label: element.webshop_name + ' ' + element.created_at }));
                this.setState({ webshops_options: options });
            })
    }

    resetForm = () => {
        this.setState(this.baseState)
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
            const { quantity, received_quantity } = item;
            const {id, name, barcode} = item.product_info;
            return (
                <tr key={id}>
                    <td>{name}</td>
                    <td>{barcode}</td>
                    <td>{quantity}</td>
                    <td>    <input type="number" min="0" className="form-control" name="quantity" value={this.state.receiving_items[index].received_quantity} onChange={(e) => {
                        console.log(e.target.value)
                        if (e.target.value === '') {
                            console.log("szompjal fasz")
                            this.state.receiving_items[index].received_quantity = 0;
                        }
                        else {
                            this.state.receiving_items[index].received_quantity = parseInt(e.target.value); this.forceUpdate();
                        }
                    }} /> </td>
                </tr>
            )
        })
    }

    handleSelectWebshopPack = (event) => {
        console.log(this.state.webshops_options)
        this.setState({receiving_items: this.state.receiving_packages.find(e => e.id === event.value).items })
        console.log(this.state.receiving_packages)
        console.log(this.state.receiving_packages.find(e => e.id = event.value))
    }

    handleScannerInput = (event) => {
        event.preventDefault();
        console.log(event.target.name)
        console.log(event.target.value)
        this.setState({ scannerInput: event.value })
    }

    handleScannerOnKey = (event) => {
        console.log(event)
        if (event.keyCode === 9) {
            event.preventDefault();
            console.log(this.state.receiving_items.received_quantity)

            console.log(this.state.receiving_items.find(item => item.product_info.barcode === this.state.scannerInput))

            const find_item = this.state.receiving_items.find(item => item.product_info.barcode === this.state.scannerInput);

            if (find_item) {
                find_item.received_quantity = find_item.received_quantity + 1;
                console.log("heureke")
            }
            else {
                console.log("Unknown item")
            }


            this.setState({ scannerInput: null })
            document.getElementById('scannerInput').value = ''
            this.forceUpdate();
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
                    <Select options={this.state.webshops_options} onChange={this.handleSelectWebshopPack} />
                </div>
                <button type="button" className="btn btn-primary" onClick={this.handleSreach}>Search</button>
                <div className="container pt-3">
                    <h1>Incoming Receving Package</h1>
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
                    <form>
                        <h2>Scanner input:</h2>
                        <input onKeyDown={this.handleScannerOnKey} type="text" id="scannerInput" className="form-control" name="scannerInput" value={this.state.scannerInput} onChange={this.handleChange} />
                    </form>
                </div>
                <div className="container pt-3">
                    <button type="button" className="btn btn-primary" onClick={() => {
                        this.props.alert.show(
                            <div className="container">
                                <p> Are you sure to take-in the items???  </p>
                                <button type="button" className="btn btn-primary" onClick={this.handleSreach}>Yes, start taking-in the items</button>
                            </div>)
                    }} >Take In</button>
                </div>
                {infoMsg}
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