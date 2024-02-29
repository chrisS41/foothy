import React, { Component, useState } from 'react';
import { Textfield } from './Input';
import { Button } from './ Button';
import * as validators from './ValidatorUtil';

class AccountSettings extends Component{
    AccountSettingForm = ({ label, link }) =>{
        const [errors, setErrors] = useState({});
        const [values, setValues] = useState({});
    
        const isFormValide = () => {
            return Object.keys(values).length === 2 && Object.keys(errors).length === 0;
        }
    
        const accountSettingValidators ={
            // currentPassword: event => {
            //     const { name, value } = event.target;
            //     const val = value.trim();
    
            //     if (!validators.required(val)){
            //         if (values[name]) delete value[name];
            //         setErrors({ ...errors, [name] : 'Required'});
            //     }
            //     else {
            //         if (errors[name]) delete errors[name];
            //         setValues ({...values, [name]: val});
            //     }
            // },
            currentPassword: event=> {
                event.preventDefault();
                const { name, value } = event.target;
                const val = value.trim();
    
                if (!validators.required(val)){
                    if (values[name]) delete value[name];
                    setErrors({ ...errors, [name] : 'Required'});
                }
                else if (value != values[name]){
                    if (value[name]) delete value[name];
                    setErrors({ ...errors, [name] : 'The current password is not matching!'})
                }
                else {
                    if (errors[name]) delete errors[name];
                    setValues({ ...values, [name]: val});
                }            
            },
            newPassword: event => {
                event.preventDefault();
                const { name, value } = event.target;
                const val = value.trim();
    
                const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);
    
                if (!validators.required(val)){
                    if (values[name]) delete value[name];
                    setErrors({ ...errors, [name]: 'Required'});
                }
                else if (!passwordRegex.text(val)){
                    setErrors({ ...errors, [name]: 'Password must have a minimum of eight characters, at least one letter, one number, and one special character.'});
                }
                else {
                    if (errors[name]) delete errors [name];
                    setValues ({ ...values, [name]: val});
                }
            },
            confirmNewPassword: event =>{ 
                event.preventDefault();
                const { name, value } = event.target;
                const val = value.trim();
    
                if (!validators.required(val)){
                    if (values[name]) delete value[name];
                    setErrors({ ...errors, [name]: 'Required'})
                }
                else if (val !== values.password){
                    setErrors({ ...errors, [name]: 'Passwords must match.'});
                }
                else{
                    if (errors[name]) delete errors [name];
                    setValues({ ...values, [name]: val});
                }
            }
        }
    
        const __renderButton = text => {
            return (
                <div className="accnt-setting-save-button">
                <Button filled disabled={!isFormValid()} label={text}/>
                </div>
            )        
        }
    
        const onChange = event => {
            const { value, name } = event.target;
            const val = value;
    
            setValues({...values, [name]: val});
        }
        return(
            <div className="user-accnt-setting-form">
                <h1 className="header-text">{label}</h1>
                <form>
                    <div className="row-style">
                        <div className="col-style">
                            <Textfield onBlur={(e) => accountSettingValidators.username(e)}label="Username" 
                            value={values.username} 
                            error={errors.username}
                            />
                        </div>
                    </div>
                    <div className="row-style">
                        <div className="col-style">
                            <Textfield onBlur={(e) => accountSettingValidators.currentPassword(e)}
                            label="Current Password"
                            name="currentPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter the current password"
                            required
                            value={values.password}
                            error={errors.password}
                            autoComplete="on"
                            />
                        </div>
                    </div>
                    <div className="row-style">
                        <div className="col-style">
                            <Textfield onBlue={(e) => accountSettingValidators.newPassword(e)}
                            placeholder="New Password"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            label="New Password"
                            required
                            value={values.password}
                            error={errors.password}
                            autoComplete="on"
                            onChange={(e) => onChange(e)}
                             />
                        </div>
                    </div>
                    <div className="row-style">
                        <div className="col-style">
                            <Textfield onBlur={(e)=>accountSettingValidators.confirmNewPassword(e)} 
                            placeholder="Confirm new password"
                            name="confirmNewPassword"
                            label="Confirm New Pasword"
                            type={showPassword ? "text" : "password"}
                            required
                            value={values.confirmNewPassword}
                            error={errors.confirmNewPassword}
                            autoComplete="on"
                            onChange={(e) => onChange(e)}
                            />                        
                        </div>
                    </div>
                    <div className="row-style">
                        <div className="col-style">
                            <div className="show-password">
                                <input name="showPassword" type="checkbox" onClick={toggleShowPassword}></input>
                                <label htmlFor="showPassword">Show Password</label>
                            </div>
                        </div>
                    </div>
                    {__renderButtone(props.label)}
                    {props.link}
                </form>
            </div>
        );
    }
}

export default AccountSettings;


