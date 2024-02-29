import React, { Component } from 'react';
import { Textfield, Textarea } from './Input';
import { Button } from './Button';
import * as validators from './ValidatorUtil';

import './styles/EmailForm.css';
import './styles/Button.css'

export class EmailForm extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      values: {}, 
      errors: {},
    };

    this.validateField = this.validateField.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }


  handleSubmitForm = event => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ ...this.state, submitted: true });
    }
  }

  validateField = event => {
    event.preventDefault();
    event.stopPropagation();
    const { name, value } = event.target;
    const { errors } = this.state;
    let newErrors = {...errors};
    const val = value.trim();
    if (!validators.required(val)) {
      this.setState({ ...this.state, errors: {...errors, [name]: 'Required' }});
    }
    else { // else if has value
      if (errors[name]) { // if error exists in state
        delete newErrors[name];
      } 
     
      this.setState({...this.state, values: { ...this.state.values, [name]: val }, errors: newErrors}) //set values and errors
    }
  };

  getValue = event => {
    event.preventDefault();
    event.stopPropagation();
    const { name, value } = event.target;
    const val = value;

    this.setState({...this.state, values: {...this.state.values, [name]: val }});
  }

  isFormValid = () => {
    const { values, errors } = this.state;

    return Object.keys(values).length === 5 && Object.keys(errors).length === 0;
  }

  renderForm = () => {
    const { values, errors } = this.state;
    return (
    <form onSubmit={this.handleSubmitForm}>
      <div className="flex-row">
        <div className="flex-column">
          <Textfield 
          onBlur={(e) => this.validateField(e)}
          onChange={(e) => this.getValue(e)}
          label="First Name" 
          name="firstName"
          type="text"
          required
          error={errors.firstName}
          value={values.firstName}/>
        </div>
        <div className="flex-column">
          <Textfield 
          onBlur={(e) => this.validateField(e)}
          onChange={(e) => this.getValue(e)}
          label="Last Name" 
          name="lastName"
          type="text"
          required
          error={errors.lastName}
          value={values.lastName}/>
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <Textfield 
          onBlur={(e) => this.validateField(e)}
          onChange={(e) => this.getValue(e)}
          label="Email Address" 
          name="email"
          type="email"
          required
          error={errors.email}
          value={values.email}/>
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <Textfield 
          onBlur={(e) => this.validateField(e)}
          onChange={(e) => this.getValue(e)}
          label="Subject" 
          name="subject"
          type="text"
          required 
          error={errors.subject}
          value={values.subject}/>
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <Textarea
          onBlur={(e) => this.validateField(e)}
          onChange={(e) => this.getValue(e)}
          name="message"
          label="Message"
          required         
          error={errors.message}
          value={values.message}/>
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <div className="button-container-small">
          <Button 
          filled
          disabled={!this.isFormValid()}
          label="Send"/>
        </div>
        </div>
      </div>
    </form>
    )  
  }

  render() {
    const { submitted } = this.state;
    return(
      <div className="email-form">
        { !submitted ? 
          this.renderForm() 
          : <div className="confirmation-message">Thank you for reaching out to us at Foothy! Please allow 3-5 business days for a response.</div>
        }
      </div>
    )
  }
}