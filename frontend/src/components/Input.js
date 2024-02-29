import React, { useState } from 'react';
import './styles/Input.css';

export const Textfield = props => {
  const [focused, setFocused] = useState(false);

  const renderErrorMessage = message => {
    return props.error ? (
      <div className="error-message">{message}</div>
    ) : ''
  };

  const __onBlur = event => {
    event.preventDefault();
    setFocused(false);

    if (props.onBlur) { 
      props.onBlur(event); // calls any onBlur handler passed from parent component through props
      } 
  }

  const __onChange = event => {
    if (props.onChange) props.onChange(event); // calls any onChange handler passed from parent component through props
  }

  const __onFocus = () => {
    setFocused(true);
  }

    return (
      <div className="input-container">
        {props.label ? <label className={`input-label ${focused || props.value ? 'focused' : ''}`} htmlFor={props.name}>{!props.required ? props.label : `${props.label}*`}</label> : ''}
        <input 
        className={`input-field ${props.error ? 'error' : ''}`}
        value={props.value || ''}
        type={props.type || 'text'} 
        name={props.name}
        aria-required={props.required}
        aria-label={props.label}
        autoComplete={props.autoComplete || 'off'}
        inputMode={props.inputMode || 'text'}
        onBlur={(e) => __onBlur(e)} 
        onFocus={__onFocus}
        onChange={(e) => __onChange(e)}
        disabled={props.disabled}
        >
        </input>
        {renderErrorMessage(props.error)}
      </div>
  );
}

export const Textarea = props => {
  const [focused, setFocused] = useState(false);

  const renderErrorMessage = message => {
    return props.error ? (
      <div className="error-message">{message}</div>
    ) : ''
  };

  const __onBlur = event => {
    event.preventDefault();

    setFocused(false);
    if (props.onBlur) { 
      props.onBlur(event);
      } // any additional validation aside from required validation defined in parent component
  }

  const __onChange = event => {
    if (props.onChange) props.onChange(event); // calls any onChange handler passed from parent component through props
  }

  const __onFocus = () => setFocused(true);

  return (
    <div className="input-container">
      {props.label ? <label className={`input-label ${focused || props.value ? 'focused' : ''}`} htmlFor={props.name}>{!props.required ? props.label : `${props.label}*`}</label> : ''}
      <textarea 
      value={props.value || ''}
      className={`form-textarea ${props.error ? 'error' : ''}`}
      placeholder={props.placeholder} 
      name={props.name}
      aria-required={props.required}
      aria-label={props.label}
      onBlur={(e) => __onBlur(e)} 
      onChange={(e) => __onChange(e)}
      onFocus={__onFocus}></textarea>
      {renderErrorMessage(props.error)}
    </div>
  );
}

export const Select = props => {
  const [focused, setFocused] = useState(false);

  const renderErrorMessage = message => {
    return props.error ? (
      <div className="error-message">{message}</div>
    ) : ''
  };

  const renderOptions = options => {
    const listOptions = [{ value: '', disabled: true, selected: true, label: ''}, ...options]; // adding placeholder 
    return listOptions.length ? listOptions.map((option, index) => {
      return(
      <option key={`${option.value}_${index}` }
      value={option.value} 
      disabled={option.disabled}>
        {option.label}
      </option>
      ) 
    }) : '';
  }

  const __onBlur = event => {
    event.preventDefault();
    setFocused(false);

    if (props.onBlur) { 
      props.onBlur(event); // calls any onBlur handler passed from parent component through props
      } 
  }

  const __onChange = value => {
    if (props.onChange) props.onChange(value); // calls any onChange handler passed from parent component through props
  }

  const __onFocus = () => {
    setFocused(true);
  }

  return (
    <div className="input-container">
      <label className={`input-label ${focused || props.value ? 'focused' : ''}`} htmlFor={props.name}>{!props.required ? props.label : `${props.label}*`}</label>
      <select 
      className={`input-field ${props.error ? 'error' : ''}`}
      value={props.value || ''}
      name={props.name}
      aria-required={props.required}
      aria-label={props.label}
      onBlur={(e) => __onBlur(e)} 
      onFocus={__onFocus}
      onChange={(e) => __onChange(e)}>
        {renderOptions(props.options)}
      </select>
      {renderErrorMessage(props.error)}
    </div>
  );
}