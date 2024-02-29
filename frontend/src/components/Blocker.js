import React from 'react'
import './styles/Blocker.css';

export const Blocker = ({ onClick, transparent }) => <div className={`blocker ${transparent ? 'transparent' : 'darkened'}`} onClick={onClick}></div>;
