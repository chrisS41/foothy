import React, { useState } from 'react';
import { getTrimmedValue } from './ValidatorUtil';

import { Textfield, Textarea } from './Input';

export const ReportPostForm = props => { 
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const onChange = event => {
    const { value, name } = event.target;
    const val = value;

    setValues({...values, [name]: val });

    if (val && val !== '' && errors[name]) { // clear errors out on change
      const currentErrors = {...errors};
      delete currentErrors[name];
      setErrors({...currentErrors});
    }
  }

  const onSubmit = event => {
    event.preventDefault();
  }

  const validators = {
    required: (event) => {
      const { name, value: val } = getTrimmedValue(event); 

      if (!val || val === '') setErrors({...errors, [name]: 'Required'});
      

      setValues({...values, [name]: val});
      return onValidate(values, errors);
    }
  }

  const onValidate = (values, errors) => {
    if (props.onValidate) props.onValidate(isFormValid(values, errors));
  }

  const isFormValid = (values, errors) => {
    return values && errors ? Object.keys(values).length === 2 && Object.keys(errors).length === 0 && Object.values(values).every(value => value && value !== '') : false;
  }

  return(
    <div className="recipe-comment-form">
      <form onSubmit={(e) => onSubmit(e)}>
      <h1 className="popup-header-text">Report</h1>
        <div className="flex-row">
          <div className="flex-column">
          <Textfield 
          onChange={(e) => onChange(e)}
          onBlur={(e) => validators.required(e)}
          label="Name" 
          name="name"
          type="text"
          required 
          error={errors.name}
          value={values.name}/>
          </div>
        </div>

        <div className="flex-row">
          <div className="flex-column">
            <Textarea
            onChange={(e) => onChange(e)}
            onBlur={(e) => validators.required(e)}
            name="reason"
            label="Why are you reporting this post?"
            required         
            type="text"
            error={errors.reason}
            value={values.reason}/>
        </div>
      </div>
    </form>
  </div>
  );
}