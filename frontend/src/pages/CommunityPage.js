import React, {Component} from 'react';
import { Button } from '../components/Button';
import { RecipePopup } from '../components/RecipePopup';

import './styles/CommunityPage.css';

class CommunityPage extends Component {

  constructor(props){
    super(props);

    this.state = {
      popupOpen: false,
    }

    this.displayTabContent = this.displayTabContent.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  displayTabContent(category) { //this function displays the content of a tab when it is clicked on
      var i, tabContent;
      //Hide all tabs
      tabContent = document.getElementsByClassName("tabContent");
      for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
      }

    document.getElementById(category).style.display = "block";

  }

  togglePopup() {
    const { popupOpen } = this.state
    this.setState({ popupOpen: !popupOpen });
  }

  render() {
    const { popupOpen } = this.state;
    return (
      <div className='community'>
        <h1 class="main-page-header">community</h1>
        <div class="add-button-container">
          <Button 
          filled
          label="+ Add Recipe"
          onClick={this.togglePopup}/>
        </div>
        { popupOpen ? <RecipePopup onClose={this.togglePopup}/> : ''}
        <div className="categoryTabs">
          <button className="tabButtons" id="defaultTab" onClick={() => this.displayTabContent("Popular Posts")}>Popular Posts</button>
          <button className="tabButtons" onClick={() => this.displayTabContent("My Feed")}>My Feed</button>
          <button className="tabButtons" onClick={() => this.displayTabContent("New Posts")}>New Posts</button> 
        </div>

        <div id="Popular Posts" className="tabContent">
        <h3>Category1</h3>
        </div>

        <div id="My Feed" className="tabContent">
        <h3>Category2</h3>
        </div>

        <div id="New Posts" className="tabContent">
          <h3>Category3</h3>
        </div>
      </div>
    )
  }

}

export default CommunityPage;
