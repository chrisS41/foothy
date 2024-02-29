import React, { Component } from 'react';
import { Accordion } from '../components/Accordion';
import { EmailForm } from '../components/EmailForm';
import styles from './styles/HelpPage.module.css';

const FAQ_CONFIG = {
  recipes: [
    { label: 'How do I search for recipes?', text: <span>Foothy users can search for recipes either by recipes or by ingredients. To search by recipe, simply type the name of the dish you wish to make. If you would like to find recipes based on ingredients on hand, simply toggle the switch above the search bar to switch to <strong>Ingredients</strong> mode. In this mode, users can then choose to type in ingredients they either wish to include or exclude in recipes.</span> },
    { label: 'How are recipes in the search results curated?', text: <span>Recipes are categorized by <strong>health score</strong> before being sorted from highest to lowest based on this score. Foothy analyzes each recipe based on seven key calculated nutrients:
    
    <ul>
        <li><strong>fat</strong> </li>
        <li><strong>saturated fat</strong></li>
        <li><strong>carbohydrates</strong></li>
        <li><strong>sugar</strong></li>
        <li><strong>protein</strong></li>
        <li><strong>salt</strong></li>
        <li><strong>fiber</strong></li>
      </ul>  
      
      Based on these given nutrients, Foothy assigns recipes their corresponding health scores ranging from <strong>1</strong> (least healthy) to <strong>3</strong> (healthiest) based on the recommended percentages of each nutrient present in a given recipe.</span> },
    { label: 'How do I add recipes to my favorites?', text: <span>Users can favorite recipes through two ways: on the recipe cards located in the search results, or on the pages of the individual recipes. To favorite a recipe, simply look for the heart icon near the recipe photos and click. Users can then view their favorites on their Favorite List. <br/><br/><strong>NOTE: <em>Users must have a Foothy account in order to favorite recipes.</em></strong></span>},
    { label: 'Can I add my own recipes?', text: <span>Here at Foothy, we encourage users to post and share customized recipes with others. To add recipes, navigate to the homepage and click on the "Add Recipe" button on the bottom right corner of the page to open up our <strong>Create Recipe</strong> form. Then, users can fill out recipe details such as the dish's name, cook and prep time, amount of servings, calories, ingredients, steps, and even a photo. <br/><br/><strong>NOTE: <em>Users must have a Foothy account in order to favorite recipes.</em></strong></span>},
  ],

  account: [
    { label: 'Do I need an account to use Foothy?', text: <span>Foothy does not require users to create accounts to search for recipes by recipes or ingredients. However, we recommend users create accounts to take advantage of all that Foothy has to offer. With an account, users can: 

      <ul>
        <li><strong>favorite</strong> recipes to save for later</li>
        <li><strong>rate</strong> recipes</li>
        <li><strong>post</strong> their own customized recipes to share with other Foothy users.</li>
      </ul>
      </span>},
    { label: 'How do I sign up for Foothy?', text: <span>To open Foothy's account forms, click on the user icon or greeting text on the upper right hand corner of the top bar within the application. Users will then see a popup that prompts them to log in. If users would like to create an account with us, they can simply click on the link on the bottom of the popup labeled, <strong>"Sign up!"</strong> and fill out the account creation form accordingly.</span>},   
    { label: 'How do I change my password?', text: <span>When signed into the application, go to the user menu and click on <strong>Account Setting</strong> to navigate to the account management page. Here is where users can view their account details, as well as change their password.</span>}, 
  ]
}


class HelpPage extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      header: 'SUPPORT', 
    };

    this.renderHeader = this.renderHeader.bind(this);
  }

  renderHeader() {
    const header = this.state.header;

    return (<h1 className={styles.headerText}>{header}</h1>);
  }
  
  render() {
    return(
    <div className={styles.helpPage}>
      {this.renderHeader()}
      <h2 className={styles.subHeaderText}>Frequently Asked Questions (FAQ)</h2>
        <h3 className={styles.categoryHeaderText}>RECIPES</h3>
          <div className={styles.accordion}><Accordion items={FAQ_CONFIG.recipes}/></div>
        <h3 className={styles.categoryHeaderText}>ACCOUNT MANAGEMENT</h3>
          <div className={styles.accordion}><Accordion items={FAQ_CONFIG.account}/></div>
      <h2 className={styles.subHeaderText}>Contact Us</h2>
      <EmailForm/>
    </div>
    );
  };
}

export default HelpPage;