import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css'
import { useAlert } from 'react-alert'

import NavWMS from './components/NavWMS.js'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Summary from './components/Summary'
import AddItem from './components/Inventory/AddItem'
import Items from './components/Inventory/Items'
import Putaway from './components/Inventory/Putaway'
import Receiving from './components/Inventory/Receiving'
import IncomingReceving from './components/Inventory/IncomingReceving'

import InComing from './components/Orders/InComing'
import Picking from './components/Orders/Picking'
import Packing from './components/Orders/Packing'
import AddWebshop from './components/AddWebshop'
import Shipping from './components/Shipping'


function App() {
  const alert = useAlert();
  return (
    <Router>
      <NavWMS />
      <Switch>
          <Route exact path="/" component={Summary} />
          <Route exact path="/addwebshop" component={AddWebshop}/>
          <Route exact path="/inventory/items" component={Items}/>
          <Route exact path="/inventory/additem" component={AddItem}/>
          <Route exact path="/inventory/putaway" component={Putaway}/>
          <Route exact path="/inventory/addreceiving_pack" component={Receiving}/>
          <Route exact path="/inventory/incomingreceving" component={() => <IncomingReceving alert={alert}/>  } />
          <Route exact path="/orders/incoming" component={InComing}/>
          <Route exact path="/orders/picking" component={Picking}/>
          <Route exact path="/orders/packing" component={Packing}/>
          <Route exact path="/shipping" component={Shipping}/>
        </Switch>
    </Router>
  );
}

export default App;
