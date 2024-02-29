import React from 'react';
import './styles/Button.css';

export const Button = props => {
  const Icon = props.icon || '';
  return (
    <button 
      className={`${props.filled ? 'filled-button' : 'secondary-button'} ${props.disabled ? 'disabled-button' : ''}`}
      aria-disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.icon ? <Icon/> : ''} {props.label}
    </button>
  ); 
};