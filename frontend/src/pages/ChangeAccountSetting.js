import React, { Component, useState , useEffect} from 'react';
import { Textfield } from '../components/Input';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import * as validators from '../components/ValidatorUtil';
import './styles/changeAccntSetting.css'
import profilePic from './img/LogoNoText.png'
import addPic from './img/plus.png'
import axios from 'axios';
import config from "./../config/config.json"

const UserSettingForm = (props) => {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [OGvalues, setOGvalues] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const currentImage = React.useRef(null);
    const uploader = React.useRef(null);

    const isFormValid = () => {
        return Object.keys(values).length === 3 && Object.keys(errors).length === 0;
        //return Object.keys(values).length === 3;
    }

    const imageUpload = e => {
        const [file] = e.target.files;
        if (file) {
            const fReader = new FileReader();
            const {current} = currentImage;
            current.file = file;
            fReader.onload = e => {
                current.src = e.target.result;
            };
            fReader.readAsDataURL(file);
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onSubmit = event => {
        event.preventDefault();
    }

    const settingValidators = {
        currentPassword: event => {
            event.preventDefault();
            const { name, value } = event.target;
            const val = value.trim();

            if (!validators.required(val)) {
                if (values[name]) delete value[name];
                setErrors({ ...errors, [name]: 'Required' });
            }
            //else if (val !== '1234') { // Dummy value
            //    setErrors({ ...errors, [name]: 'Current password is not matching with our record.' });
            //}
            else {
                if (errors[name]) delete errors[name];
                passwordcheck(val)
                .then((result) => {
                    if( !result ) {
                        setErrors({ ...errors, [name] : 'Password not match'});
                    }
                    else {
                        setValues({ ...values, [name]: val });
                    }
                })
            }

        },
        newPassword: event => {
            // Required to check if the new password is the same as the hisory of user's password
            event.preventDefault();
            const { name, value } = event.target;
            const val = value.trim();

            const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

            if (!validators.required(val)) {
                if (values[name]) delete value[name];
                setErrors({ ...errors, [name]: 'Required' });
            } else if (!passwordRegex.test(val)) {
                setErrors({ ...errors, [name]: 'Password must have a minimum of eight characters, at least one letter, one number, and one special character.' });
            } else {
                if (errors[name]) delete errors[name];
                setValues({ ...values, [name]: val });
            }
        },
        confirmPassword: event => {
            event.preventDefault();
            const { name, value } = event.target;
            const val = value.trim();

            if (!validators.required(val)) {
                if (values[name]) delete value[name];
                setErrors({ ...errors, [name]: 'Required' });
            } else if (val !== values.newPassword) {
                setErrors({ ...errors, [name]: 'Passwords must match.' });
            } else {
                if (errors[name]) delete errors[name];
                setValues({ ...values, [name]: val });
            }
        }
    }

    const __renderButton = text => {
        if (!isFormValid()) {
            return (
                <div className="save-container">
                    <Button onClick={changeAccount} filled disabled={!isFormValid()} label="Save" />
                </div>
            )
        } else {
            return (
                <div className="save-container">
                    <Link to="/accountsetting">
                        <Button onClick={changeAccount} label="Save" />
                    </Link>
                </div>
            )
        }
    }
    const onChange = event => {
        const { value, name } = event.target;
        // const val = value.trim();

        setValues({ ...values, [name]: value });
    }

    useEffect(async () => {
        try {
            //await fetch('/loadAccountSetting')
            await axios.post(config.BE.Addr + '/user/get',
                JSON.stringify({
                    username: window.sessionStorage.getItem('username')
                }), {
                mode: "cors",
                headers: { 'Content-Type': 'application/json' }
            })
                .then(res => {
                    if (res.status === 200) {
                        //res.json().then(result => {
                            //console.log(result);
                            setOGvalues({
                                username: res.data['username'],
                                firstName: res.data['firstName'],
                                lastName: res.data['lastName'],
                                email: res.data['email'] 
                            });
                        //})
                    }
                })
                .catch(res => {
                    if(res.status === 401) {
                        //res.json().then(result => {
                            alert("changeAccountSetting " + res.data);
                        //})
                    }
                    else    alert("Error: try again");
                })
        } catch (e) {
            alert(e);
        }
    }, []);
    
    let passwordcheck = async (val) => {
        let result;
        try {
            /*await fetch('/passwordcheck', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: val
                })
            })*/
            await axios.post(config.BE.Addr + '/user/login', 
            JSON.stringify({ 
                username: window.sessionStorage.getItem('username'), // pass values
                password: val
              }), {
              mode: "cors",
              headers: { 'Content-Type': 'application/json' }}
            )
                .then(res => {
                    if (res.status === 200) result = true;
                    else if (res.status === 405) result = false;
                    else alert("Error: try again");
                })
        }
        catch (e) {
            //alert("password check  " + e);
        }
        return result;
    }

    let changeAccount = async () => {
        // Redirect and save the information to our database 
        try {
            /*await fetch('/changeAccountSetting', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: OGvalues.username,
                    currentPassword: values.currentPassword,
                    newPassword : values.newPassword
                })
            })*/
            await axios.post(config.BE.Addr + '/user/passwd', 
            JSON.stringify({ 
                username: window.sessionStorage.getItem('username'), // pass values
                currentPassword: values.currentPassword,
                newPassword : values.newPassword
              }), {
              mode: "cors",
              headers: { 'Content-Type': 'application/json' }}
            )
            .then(res => {
                console.log(res);
                if(res.status === 200) {
                    //res.json().then(result => {
                        alert(res.data);
                        window.location.replace("/");
                   // })
                }
                else if(res.status === 403) {
                    //res.json().then(error => {
                      alert(res.data);
                    //})
                }
                else    alert("Error: try again");
            })
        } catch (e) {
            //alert(e);
        }
    }

    return (
        <div className="accnt-form">
            <h1>Change Account Setting</h1>
            <form onSubmit={(e) => onSubmit(e)}>
                <div className="accnt-pic">
                    {/* <img className="foothy-pic" src={profilePic} alt="ProfilePic"/> */}
                    <input className="uploadImage" type="file" accept="image/*" onChange={imageUpload} ref={uploader} />
                    {/* <div className="changeImage" onClick={() => uploader.current.click()}> */}
                    <div className= {currentImage ? "imageExist" : "changeImage"} onClick={() => uploader.current.click()}>
                        <img ref={currentImage} />
                    </div>
                </div>
                <div className="accnt-row">
                    <div className="accnt-column">
                        <label>First Name: </label>
                        {/* <span className="text-box" name="firstName" label="First Name">{OGvalues.firstName}</span> */}
                        <Textfield
                            className="accnt-fixed"
                            disabled
                            name="firstName"
                            type="text"
                            disabled
                            value={OGvalues.firstName}
                        />
                    </div>
                </div>
                <div className="accnt-row">
                    <div className="accnt-column">
                        <label>Last Name: </label>
                        {/* <span className="text-box" name="lastName" label="Last Name">{OGvalues.lastName}</span> */}
                        <Textfield
                            className="accnt-fixed"
                            readonly
                            name="lastname"
                            type="text"
                            disabled
                            value={OGvalues.lastName}
                        />
                    </div>
                </div>
                <div className="accnt-row">
                    <div className="accnt-column">
                        <label>Email: </label>
                        {/* <span className="text-box" name="email" label="Email">{OGvalues.email}</span> */}
                        <Textfield
                            className="accnt-fixed"
                            readonly
                            name="email"
                            type="text"
                            disabled
                            value={OGvalues.email}
                        />
                    </div>
                </div>
                <div className="accnt-row">
                    <div className="accnt-column">
                        <label>User Name: </label>
                        {/* <span className="text-box" name="username" label="Username">{OGvalues.username}</span> */}
                        <Textfield
                            className="accnt-fixed"
                            readonly
                            name="username"
                            type="text"
                            disabled
                            value={OGvalues.username}
                        />
                    </div>
                </div>
                <div className="accnt-row">
                    <div className="accnt-column">
                        <label>Current Password: </label>
                        <Textfield onBlur={(e) => settingValidators.currentPassword(e)}
                            name="currentPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            error={errors.currentPassword}
                            value={values.currentPassword}
                            autoComplete="on"
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                </div>
                <div className="accnt-row">
                    <div className="accnt-column">
                        <label>New Password: </label>
                        <Textfield onBlur={(e) => settingValidators.newPassword(e)}
                            placeholder="New Password"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            error={errors.newPassword}
                            value={values.newPassword}
                            autoComplete="on"
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                </div>
                <div className="accnt-row">
                    <div className="accnt-column">
                        <label>Confirm Password: </label>
                        <Textfield onBlur={(e) => settingValidators.confirmPassword(e)}
                            placeholder="Confirm Password"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            required
                            error={errors.confirmPassword}
                            value={values.confirmPassword}
                            autoComplete="on"
                            onChange={(e) => onChange(e)}
                        />
                    </div>
                </div>
                <div className="accnt-row">
                    <div className="show-password">
                        <input name="showPassword" type="checkbox" onClick={toggleShowPassword}></input>
                        <label htmlFor="showPassword">Show Password</label>

                    </div>
                </div>
                {__renderButton("Save")}

            </form>
        </div>
    )
}

export default UserSettingForm;