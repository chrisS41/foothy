import { React, useEffect, useState } from 'react';
import './App.css';

import HelpPage from '../src/pages/HelpPage';
import RecipePage from '../src/pages/RecipePage';
import Navbar from './components/Navbar';
import HomePage from '../src/pages/HomePage'
import CommunityPage from '../src/pages/CommunityPage'
import SingleRecipePage from '../src/pages/SingleRecipePage'
import Images from "../src/pages/Images"
import Bar from "../src/pages/Bar"
import ChangeAccountSettingPage from '../src/pages/ChangeAccountSetting'
import FavoriteList from '../src/pages/FavoriteList'
import ViewProfile from '../src/pages/ViewAccount'


import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  const [islogin, setIslogin] = useState(false);

  // useEffect(async () => {
  //   try {
  //     await fetch('/getUserInfo')
  //       .then (res => res.json)
  //       .then(res => {
  //         if (res.status === 200) {
  //           res.json().then(result => {
  //             //console.log(result);
  //             setIslogin(result.islogin);
  //           })
  //         }
  //       })
  //   } catch (e) {
  //     alert("App.js "+e);
  //   }
  // }, []);

  return (
    <Router>
      <Navbar /> 
      <Switch>
        <Route exact path='/' component={HomePage}/>
        <Route path='/cookbook' component={RecipePage} />
        <Route path='/community' component={CommunityPage} />
        <Route path='/help' component={HelpPage} />
        <Route path='/singlerecipepage' component={SingleRecipePage} />
        <Route path='/images' component={Images} />
        <Route path="/bar" component={Bar}/>
        <Route path='/accountsetting' component={ChangeAccountSettingPage} />
        <Route path='/favoritelist' component={FavoriteList} />
        <Route path='/viewprofile' component={ViewProfile} />
        <Route path='/result/:id' component={SingleRecipePage} /> 
        <Route path='/userResult/:id' component={SingleRecipePage} />
      </Switch>
    </Router>
  );
}

export default App;
