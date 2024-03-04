import React, { useState, useEffect } from 'react';
import { getTrimmedValue } from './ValidatorUtil';

import { Textfield, Textarea } from './Input';
import { Button } from './Button';
import axios from 'axios';
import config from "./../config/config.json"

export const CommentForm = props => { 
  const [values, setValues] = useState({ name: ''});
  const [errors, setErrors] = useState({});

  const onChange = event => {
    const { value, name } = event.target;
    const val = value;

    setValues({...values, [name]: val });
  }

  const onSubmit = event => {
    event.preventDefault();
  }


  const validators = {
    required: event => {
      const { name, value: val } = getTrimmedValue(event); 

      if (val) {
        if (errors[name]) {
          const currentErrors = {...errors};
          delete currentErrors[name];
          setErrors({...currentErrors});
        }
      }

      else {
        setErrors({...errors, [name]: 'Required'});
      }

      setValues({...values, [name]: val})
    }
  }

  let submitComment = async () => {
    try {
      /*await fetch('/submitComment', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeID: props.id,
          name: values.name,
          comment: values.comment
        })
      })*/
      await axios.post(config.BE.Addr + '/submitComment', 
            JSON.stringify({ 
                username: window.sessionStorage.getItem('username'), // pass values
                recipeID: props.id,
                name: values.name,
                comment: values.comment
              }), {
              mode: "cors",
              headers: { 'Content-Type': 'application/json' }}
            )
        .then(res => {
          if (res.status === 200) {
            alert("Comment submitted");
            // can we reload the page here??
            window.location.reload(true); // yes :D
          }
          else {
            alert("Error occur while saving your comment");
          }
        })
    } catch (e) {
      alert("comment  " + e.message);
    }
  }

  const isFormValid = () => Object.keys(values).length === 2 && Object.keys(errors).length === 0;
  return(
    <div className="recipe-comment-form">
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex-row">
          <div style={{justifyContent: 'center'}} className="flex-column">
            <h2 className="sub-header">Have any tips?</h2>
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-column">
          <Textfield 
          onBlur={(e) => validators.required(e)}
          label="Name" 
          name="name"
          type="text"
          required 
          error={errors.name}
          value={props.username}
          disabled/>
          </div>
        </div>

        <div className="flex-row">
          <div className="flex-column">
            <Textarea
            onBlur={(e) => validators.required(e)}
            onChange={(e) => onChange(e)}
            name="comment"
            label="Comment"
            required         
            error={errors.comment}
            value={values.comment}/>
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-column">
          <div className="button-container-small">
            <Button 
            onClick={submitComment}
            filled
            disabled={!isFormValid()}
            label="Send"/>
          </div>
        </div>
      </div>
    </form>
  </div>
  );
}