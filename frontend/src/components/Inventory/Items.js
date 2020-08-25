import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select'


class Items extends Component {
    constructor() {
        super();
        this.state = {
            webshops: '',
            webshops_options: [],
            fromError: null,
        };
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

    render() {
        return (
            <div className="container">
                <h1>Items</h1>
                <div className="form-group">
                    <label>Select WebShop Name:</label>
                    <Select options={this.state.webshops_options} onChange={this.onChangeSelect} />
                </div>
            </div>
        )
    }
}

export default Items;