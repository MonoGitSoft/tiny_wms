import React, { Component } from 'react'
import axios from 'axios'
import Select, { components } from 'react-select'
import { Message, Form, Button } from "semantic-ui-react";
import { Fade } from 'react-bootstrap';


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
            select_pack: null,
            fromError: null,
            scannerInput: null,
            take_in_box_barcode: '',
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
                this.setState({ receiving_packages: res.data });
                const options = [];
                res.data.forEach(element => options.push({ value: element.id, label: element.webshop_name + ' ' + element.created_at }));
                this.setState({ webshops_options: options });
            })
    }

    resetForm = () => {
        this.setState(this.baseState)
        this.forceUpdate()
    }


    handleIncommingPackage = () => {
        console.log('-------------------------')

        const incoming_package_data = {
            receiving_package_id: this.state.select_pack,
            items: this.state.receiving_items,
            webshop_id: 0, //csunyaaa (updatenél ezeket nem kene küldeni)
            track_id: 0, //csunyaaa (updatenél ezeket nem kene küldeni)
            take_in_box_barcode: this.state.take_in_box_barcode,
            is_take_in_finished: true,
        }

        axios.post('http://127.0.0.1:8000/inventory/incoming_package/', incoming_package_data)
            .then(res => {
                this.setState({ take_an_successful: true })
            },
                err => {
                    this.setState({ take_an_successful: false })
                    this.setState({ fromError: [err.response.data] });
                }
            )
        console.log(incoming_package_data)
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
                    <Message
                        negative
                        header="Take-in was unsuccessful"
                        list={msg}
                    />
                    <button onClick={this.resetForm} className="btn btn-primary">New Take-in</button>
                </>
            );
        }
        else if (this.state.take_an_successful) {
            return (
                <>
                    <Message
                        positive
                        header="Take-in was successful"
                        list={msg}
                    />
                    <button onClick={() => window.location.reload(false)} className="btn btn-primary">New Take-in</button>
                </>
            );
        }
    }


    renderTable() {
        if (!this.state.receiving_items) {
            return (<></>)
        }



        return this.state.receiving_items.map((item, index) => {
            const { quantity, received_quantity } = item;
            const { id, name, barcode } = item.product_info;
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
        this.setState({ receiving_items: this.state.receiving_packages.find(e => e.id === event.value).items })
        console.log(this.state.receiving_packages)
        console.log(this.state.receiving_packages.find(e => e.id = event.value))
        this.setState({ select_pack: event.value })
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
                this.props.alert.show(
                    <div className="container" style={{ color: 'red' }}>
                        <p> This item is not part of the registered receiving package!!!  </p>
                        <p> Do not put it to the take in box!!!  </p>
                        <p> Put it back to the package and after finish the take-in process write a email to the webshop!!!</p>
                    </div>)
            }


            this.setState({ scannerInput: null })
            document.getElementById('scannerInput').value = ''
            this.forceUpdate();
        }
    }

    handleNewTakeInBox = () => {
        console.log('-------------------------')

        const incoming_package_data = {
            receiving_package_id: this.state.select_pack,
            items: this.state.receiving_items,
            webshop_id: 0, //csunyaaa (updatenél ezeket nem kene küldeni)
            track_id: 0, //csunyaaa (updatenél ezeket nem kene küldeni)
            take_in_box_barcode: this.state.take_in_box_barcode,
            is_take_in_finished: false,
        }
        console.log(incoming_package_data)
        axios.post('http://127.0.0.1:8000/inventory/incoming_package/', incoming_package_data)
            .then(res => {
                this.setState({ take_in_box_barcode: '' });
                this.setState({ fromError: null });
            },
                err => {
                    this.setState({ take_an_successful: false })
                    this.setState({ fromError: [err.response.data] });
                }
            )
        console.log(incoming_package_data)
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
                    <div className="container pt-10">
                        <div className="row">
                            <div className="col-sm">
                                <h2>Items Scanner input:</h2>
                                <input onKeyDown={this.handleScannerOnKey} type="text" id="scannerInput" className="form-control" name="scannerInput" value={this.state.scannerInput} onChange={this.handleChange} />
                            </div>
                            <div className="col-sm">
                                <h2>Take in box scanner input:</h2>
                                <input type="text" id="take_in_scannerInput" className="form-control" name="take_in_box_barcode" value={this.state.take_in_box_barcode} onChange={this.handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container pt-3">
                    <div className="row">
                        <div className="col-sm">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                this.props.alert.show(
                                    <div className="container">
                                        <p> Are you sure to take-in the items???  </p>
                                        <button type="button" className="btn btn-primary" onClick={this.handleIncommingPackage}>Yes, start taking-in the items</button>
                                    </div>)
                            }} >Take In</button>
                        </div>
                        <div className="col-sm">
                            <button type="button" className="btn btn-primary" onClick={this.handleNewTakeInBox}>New take in box</button>
                        </div>
                    </div>
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