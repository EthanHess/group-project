import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ChatLobby from './components/ChatLobby/ChatLobby.js';
import LandingParent from './components/LandingParent/LandingParent.js';
import Profile from './components/User/Profile/Profile';
import Dashboard from './components/Dashboard/Dashboard'
import Map from './components/Map/Map'
import LoginRegister from './components/LoginRegister/LoginRegister'
import EventSearch from './components/EventSearch/EventSearch'

export default (
    <Switch>
        <Route component={ LandingParent } exact path="/"/>
        <Route component={ ChatLobby } path="/chat"/>
        <Route component={ Profile } path="/user/:id" />
        <Route component={ Dashboard } path="/dashboard" />
        <Route component={ Map } path="/map" />       
        <Route component={ LoginRegister } path="/login" /> 
        <Route component={ EventSearch } path='/event-search' />      
    </Switch>
)