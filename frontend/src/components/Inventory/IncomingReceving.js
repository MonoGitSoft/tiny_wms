import React, { Component } from 'react'

class IncomingReceving extends Component {
    constructor() {
        super();
        this.state = {
            webshops: '',
        }; //'name', 'barcode', 'item_number', 'quantity', 'webshop_id', 'description', 'notification_num'
        this.baseState = this.state;


    }

    render() {
        return (
            <div>
                <h1>IncomingReceving</h1>
            </div>
        )
    }
}

export default IncomingReceving;