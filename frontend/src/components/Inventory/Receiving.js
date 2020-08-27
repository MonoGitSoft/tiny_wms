import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select'
import { Message, Form, Button } from "semantic-ui-react";

class Receiving extends Component {
    constructor() {
        super()
        this.state = {
            webshops: '',
            webshops_options: '',
            webshop_id: '',
            products: '',
            products_options: null,
            fromError: null,
            track_id: '',
            comment: '',
            receiving_products: [],
        }; //

        this.receving_products = [];
        this.baseState = this.state;
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
                    <button onClick={this.resetForm} className="btn btn-primary">Add Receiving Package</button>
                </>);
        }
        else {
            return (<></>);
        }
    }

    onChangeSelect = e => {
        console.log(this.state.webshops.find(element => element.name == e.value));
        const id = parseInt(this.state.webshops.find(element => element.name == e.value).id); //webshop_id az egy foreignkey es a django rinyal ezt kell parcolni
        this.setState({ webshop_id: id })
        console.log(id)
        axios.get(`http://127.0.0.1:8000/items/${id}`)
            .then(res => {
                const res_products = res.data;
                this.setState({ products: res_products });
                const options = [];
                res_products.forEach(element => options.push({ value: element.name, label: element.name }));
                this.setState({ products_options: options });
            })
        this.receving_products = [];
    }

    onChangeSelectProduct = (e, id) => {
        const product_id = parseInt(this.state.products.find(element => element.name == e.value).id);
        this.receving_products[id].product_id = product_id;
        console.log(this.receving_products[id])
    }

    onChangeSelectProductQuantity = (e, id) => {
        this.receving_products[id].quantity = e.target.value;
        console.log(this.receving_products[id])
    }

    addReceivingProductInput = () => {
        this.receving_products.push({ product_id: '', quantity: '' });
        console.log(this.receving_products)
        this.forceUpdate();
    }

    handleChange = event => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
        console.log(this.state)
    }

    handleSubmit = event => {
        console.log("parent handleSubmit")
        event.preventDefault();
        const data = {
            webshop_id: this.state.webshop_id,
            track_id: this.state.track_id,
            comment: this.state.comment,
            items: this.receving_products,
        }

        axios.post(`http://127.0.0.1:8000/inventory/receiving_package/`, data)
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

    render() {
        const listItems = this.receving_products.map((product, index) => <AddProductInput
            products_options={this.state.products_options}
            onChangeSelectProduct={(e) => this.onChangeSelectProduct(e, index)}
            onChangeSelectProductQuantity={(e) => this.onChangeSelectProductQuantity(e, index)} />);

            const infomsg = this.InfoMessage();
        return (
            <div className="container">
                <h1>Add Receiving Package</h1>
                    <div className="form-group">
                        <label>Select WebShop:</label>
                        <Select options={this.state.webshops_options} onChange={this.onChangeSelect} />
                    </div>
                    <input type="text" className="form-control" name="track_id" value={this.state.track_id} aria-describedby="trakIDHelper" placeholder="Track ID:" onChange={this.handleChange} />
                    <small id="trakIDHelper" className="form-text text-muted">Track ID, csomagszám (Ezzel lehet nyomon követni a csomagokat a gls vagy bármelyik futárszolgálatnál) </small>
                    <input type="text" className="form-control" name="comment" value={this.state.comment} aria-describedby="commentHelper" placeholder="Comment:" onChange={this.handleChange} />
                    <small id="commentHelper" className="form-text text-muted">Barmilyen comment ami az adott csomag bevételezésénél szóba jöhet.</small>
                    {listItems}
                    <div className="container">
                        <div className="row">
                            <div className="col-sm">
                                <button type="button" className="btn btn-primary" onClick={this.handleSubmit} >Submit</button>
                            </div>
                            <div className="col-sm">
                                <AddReceivingProductButton products_options={this.state.products_options} onClick={this.addReceivingProductInput} />
                            </div>
                        </div>
                    </div>
                {infomsg}
            </div>
        )
    }
}

class AddReceivingProductButton extends Component {
    constructor(props) {
        super(props)
    }

    handleSubmit = event => {
        //console.log('helo')
        event.preventDefault();
    }

    hello = () => {
        console.log("Hello");
    }

    render() {
        if (this.props.products_options != null) {
            return (
                <form onSubmit={this.handleSubmit}>
                    <button type="submit" onClick={this.props.onClick} className="btn btn-primary" >Add Product</button>
                </form>
            );
        }
        else {
            return (<></>);
        }
    }
}


class AddProductInput extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.products_options != null) {
            return (
                <>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm">
                                <div className="form-group">
                                    <label>Select Product:</label>
                                    <Select options={this.props.products_options} onChange={this.props.onChangeSelectProduct} />
                                </div>
                            </div>
                            <div className="col-sm">
                                <div className="form-group">
                                    <label>Quantity:</label>
                                    <input type="number" min="0" className="form-control" name="quantity" placeholder="Quantity" onChange={this.props.onChangeSelectProductQuantity} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>);
        }
        else {
            return (<></>);
        }
    }
}

export default Receiving;