import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { Message, Form, Button } from "semantic-ui-react";

class AddItem extends Component {
    constructor() {
        super();
        this.state = {
            webshops: '',
            webshops_options: [],
            name: '',
            barcode: '',
            item_number: '',
            webshop_id: '',
            description: '',
            notification_num: '',
            fromError: null,
        }; //'name', 'barcode', 'item_number', 'quantity', 'webshop_id', 'description', 'notification_num'
        this.baseState = this.state;
    }

    handleSubmit = event => {
        event.preventDefault();
        
        const add_item_data = {
            name: this.state.name,
            barcode: this.state.barcode,
            item_number: this.state.item_number,
            webshop_id: this.state.webshop_id,
            description: this.state.description,
            notification_num: this.state.notification_num,
        }

        axios.post(`http://127.0.0.1:8000/items/`, add_item_data)
            .then(res => {
                this.setState( res.data );
                this.setState({ fromError: false });
            },
                err => {
                    this.setState({ fromError: err.response.data });
                })
            .catch(error => {
                console.log(error)
            })
    }

    handleChange = event => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
        console.log(this.state)
    }

    onChangeSelect = e => {
        console.log(this.state.webshops.find(element => element.name == e.value));
        const id = parseInt(this.state.webshops.find(element => element.name == e.value).id); //webshop_id az egy foreignkey es a django rinyal ezt kell parcolni
        this.setState({ webshop_id: id })
        console.log(id)
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
                    <button onClick={this.resetForm} className="btn btn-primary">Add new item</button>
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
                <h1>Add Item</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Select WebShop Name:</label>
                        <Select options={this.state.webshops_options} onChange={this.onChangeSelect} />
                    </div>

                    <div className="form-group">
                        <label />Item Name:<label />
                        <input type="text" className="form-control" name="name" value={this.state.name} placeholder="Item Name" onChange={this.handleChange} />
                        <label />Barcode:<label />
                        <input type="text" className="form-control" name="barcode" value={this.state.barcode} placeholder="Barcode" onChange={this.handleChange} />
                        <label />Item Number (Cikkszám):<label />
                        <input type="text" className="form-control" name="item_number" value={this.state.item_number} placeholder="Cikkszám" onChange={this.handleChange} />
                        <label />Description:<label />
                        <input type="text" className="form-control" name="description" value={this.state.description} placeholder="Description" onChange={this.handleChange} />
                        <label />Notification number::<label />
                        <input type="text" className="form-control" name="notification_num" value={this.state.notification_num} aria-describedby="notificationHelper" placeholder="Notification Number:" onChange={this.handleChange} />
                        <small id="notificationHelper" className="form-text text-muted">If the qunatity of the item reaches this value the wms system send a notification to the webshop </small>
                    </div>

                    {/* <label />URL:<label />
                    <div className="form-group">
                        <input type="url" className="form-control" name="url" placeholder="URL" />
                        <small id="urleHelper" className="form-text text-muted">https://getbootstrap.com</small>
                    </div>
                    <label />Email:<label />
                    <div className="form-group">
                        <input type="email" className="form-control" name="email" placeholder="Email" />
                        <small className="form-text text-muted">example@gmail.com</small>
                    </div> */}
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                {infomsg}
            </div>
        )
    }
}

export default AddItem;