import React from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap'

function NavWMS() {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Packbase</Navbar.Brand>
            <Nav className="mr-auto">
            <Nav.Link href="/addwebshop">Add Webshop</Nav.Link>
                <NavDropdown title="Inventory" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/inventory/items">Items</NavDropdown.Item>
                    <NavDropdown.Item href="/inventory/additem">AddItem</NavDropdown.Item>
                    <NavDropdown.Item href="/inventory/addreceiving_pack">Add Receiving Package</NavDropdown.Item>
                    <NavDropdown.Item href="/inventory/incomingreceving">Incomming Receiving Package</NavDropdown.Item>
                    <NavDropdown.Item href="/inventory/putaway">Putaway</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Orders" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/orders/incoming">Incoming Orders</NavDropdown.Item>
                    <NavDropdown.Item href="/orders/picking">Picking</NavDropdown.Item>
                    <NavDropdown.Item href="/orders/packing">Packing</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/shipping">Shipping</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default NavWMS;