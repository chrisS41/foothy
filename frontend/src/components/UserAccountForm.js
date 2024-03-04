import React, { useState } from 'react';
import { Textfield } from './Input';
import { Button } from './Button';
import { Redirect, Route } from "react-router";
import * as validators from './ValidatorUtil';
import './styles/Form.css';
// import { resolveContent } from 'nodemailer/lib/shared';
import axios from 'axios'
import { BiWindows } from 'react-icons/bi';
import config from "./../config/config.json"

// --- login form dummy component --- // 
// TODO: separate loginForm and registrationForm into separate files??

const LoginForm = ({ label, link, onSignIn }) => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  const [errorBannerMsg, setErrorBannerMsg] = useState('');

  const isFormValid = () => {
    return Object.keys(values).length === 2 && Object.keys(errors).length === 0;
  }

  const loginValidators = {
    username: event => {
      event.preventDefault();
      const { name, value } = event.target;
      const val = value.trim();

      if (!validators.required(val)) {
        if (values[name]) delete value[name];
        setErrors({ ...errors, [name]: 'Required' });
      }

      else {
        if (errors[name]) delete errors[name];
        setValues({ ...values, [name]: val });
      }
    },
    password: event => {
      event.preventDefault();
      const { name, value } = event.target;
      const val = value.trim();

      if (!validators.required(val)) {
        if (values[name]) delete value[name];
        setErrors({ ...errors, [name]: 'Required' });
      }

      else {
        if (errors[name]) delete errors[name];
        setValues({ ...values, [name]: val });
      }
    }
  }

  const __renderButton = text => {
    return (
      <div style={{ margin: 10 }} className="button-container-full">
        <Button
          onClick={loginButtonClick}
          filled
          disabled={!isFormValid()}
          label={text} />
      </div>
    )
  }

  const onChange = event => {
    const { value, name } = event.target;
    const val = value;

    setValues({ ...values, [name]: val });
  }

  // when login clicked
  let loginButtonClick = async () => {
    try {
      await axios.post(config.BE.Addr + '/user/login',
        JSON.stringify({ 
          username: values.username, // pass values
          password: values.password 
        }), {
        mode: "cors",
        headers: { 'Content-Type': 'application/json' }})
        .then(res => {
          if (res.status === 200) {
            console.log(res.data)
            window.sessionStorage.setItem("username", res.data["username"])
            window.sessionStorage.setItem("firstName", res.data["firstName"])
            window.sessionStorage.setItem("islogin", res.data["islogin"])
            // window.location.replace("/welcome");      
            //window.sessionStorage.setItem("username", values.username)
            onSignIn();
            /*
            res.json().then(result => {
              window.sessionStorage.setItem('islogin', result.islogin);   // set window session
              window.sessionStorage.setItem('username', result.username);
              window.location.replace("/welcome");
            });
            */
          }
          // 401 error: Incorrect username, Incorrect password, 
          //            already logged in, other error while database reading
          else {
            if (res.status === 401) {
              res.json().then(error => {
                // alert(error);
                window.sessionStorage.setItem("islogin", false)
                setErrorBannerMsg('ERROR: Incorrect username or password. Please try logging in again.');
              })
            }
            // else error: in case of server problem
            else {
              // alert("Error: try again");
              window.sessionStorage.setItem("islogin", false)
              setErrorBannerMsg('ERROR: Error occurred logging in. Please try again.');
            }
          }
        })
    } catch (e) {
      console.log(e);
      //alert("login  " + e.message);
    }
  }

  return (
    <div className="user-account-form">
      <h1 className="popup-header-text">Login</h1>
      {errorBannerMsg ? <div className="error-banner" style={{ margin: 10 }}>{errorBannerMsg}</div> : ''}
      <form>
        <div className="flex-row">
          <div className="flex-column">
            <Textfield
              onBlur={(e) => loginValidators.username(e)}
              placeholder="Username"
              name="username"
              type="text"
              required
              label="Username"
              value={values.username}
              error={errors.username}
              onChange={(e) => onChange(e)} />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-column">
            <Textfield
              onBlur={(e) => loginValidators.password(e)}
              placeholder="Password"
              name="password"
              type="password"
              label="Password"
              value={values.password}
              error={errors.password}
              onChange={(e) => onChange(e)}
              autoComplete="on"
              required />
          </div>
        </div>
      </form>
      {/*button should be outside of the form, otherwise it is called twice and returns fetch error*/}
      <div>
        {__renderButton(label)}
        {link}
      </div>
    </div>
  );
}

// --- signup form dummy component --- // 
const RegistrationForm = (props) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = () => {
    return Object.keys(values).length === 6 && Object.keys(errors).length === 0;
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const USERNAME_MINIMUM_LENGTH = 6;

  const registrationValidators = {
    firstName: event => {
      event.preventDefault();
      const { name, value } = event.target;
      const val = value.trim();

      if (!validators.required(val)) {
        if (values[name]) delete value[name];
        setErrors({ ...errors, [name]: 'Required' });
      }

      else {
        if (errors[name]) delete errors[name];
        setValues({ ...values, [name]: val });
      }
    },
    lastName: event => {
      event.preventDefault();
      const { name, value } = event.target;
      const val = value.trim();

      if (!validators.required(val)) {
        if (values[name]) delete value[name];
        setErrors({ ...errors, [name]: 'Required' });
      }

      else {
        if (errors[name]) delete errors[name];
        setValues({ ...values, [name]: val });
      }
    },
    email: event => {
      event.preventDefault();
      const { name, value } = event.target;
      const val = value.trim();

      if (!validators.required(val)) {
        if (values[name]) delete value[name];
        setErrors({ ...errors, [name]: 'Required' });
      }

      else {
        if (errors[name]) delete errors[name];
        duplicatecheck(val, false)
          .then((result) => {
            if (!result) {
              setErrors({ ...errors, [name]: 'This email already has an account' });
            }
            else {
              setValues({ ...values, [name]: val });
            }
          })
      }

      // will need to check if email exists in database
    },
    username: event => {
      event.preventDefault();
      const { name, value } = event.target;
      const val = value.trim();

      if (!validators.required(val)) {
        if (values[name]) delete value[name];
        setErrors({ ...errors, [name]: 'Required' });
      }

      else if (!validators.minLength(val, USERNAME_MINIMUM_LENGTH)) {
        setErrors({
          ...errors,
          [name]: 'Username must be greater than 6 characters'
        });
      }

      else {
        if (errors[name]) delete errors[name];
        duplicatecheck(val, true)
          .then((result) => {
            if (!result) {
              setErrors({ ...errors, [name]: 'Username already exists' });
            }
            else {
              setValues({ ...values, [name]: val });
            }
          })
      }

      // will need to check if username exists in database before setting error
    },
    password: event => {
      event.preventDefault();
      const { name, value } = event.target;
      const val = value.trim();

      const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/);

      if (!validators.required(val)) {
        if (values[name]) delete value[name];
        setErrors({ ...errors, [name]: 'Required' });
      }

      else if (!passwordRegex.test(val)) {
        setErrors({ ...errors, [name]: 'Password must have a minimum of eight characters, at least one letter, one number, and one special character.' + ' Special characters allowed: ! @ # $ % & * ?'})
      }

      else {
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
      }

      else if (val !== values.password) {
        setErrors({ ...errors, [name]: 'Passwords must match.' });
      }
      else {
        if (errors[name]) delete errors[name];
        setValues({ ...values, [name]: val });
      }
    }
  }

  const __renderButton = text => {
    return (
      <div style={{ margin: 10 }} className="button-container-full">
        <Button
          onClick={signupButtonClick}
          filled
          disabled={!isFormValid()}
          label={text} />
      </div>
    )
  }

  const onChange = event => {
    const { value, name } = event.target;
    const val = value.trim();

    setValues({ ...values, [name]: val });
  }

  let duplicatecheck = async (val, nameOrEmail) => {
    let result;
    try {
      await axios.post(config.BE.Addr + '/user/dupChecker',
        JSON.stringify({
          value: val,
          nameOrEmail: nameOrEmail
        }), {
        mode: "cors",  
        headers: { 'Content-Type': 'application/json' }})
        .then(res => {
          if (res.status === 200) result = true;
          else if (res.status === 405) result = false;
          else alert("Error: try again");
        })
    }
    catch (e) {
      //alert("duplicate check  " + e);
    }
    return result;
  }

  // sign up button click
  let signupButtonClick = async () => {
    try {
      await axios.post(config.BE.Addr + '/user/signup',
        JSON.stringify({
          username: values.username,
          password: values.password,
          email: values.email,
          fName: values.firstName,
          lName: values.lastName
      }), {
        mode: "cors",
        headers: { 'Content-Type': 'application/json' }})
        .then(res => {
          if (res.status === 200) {
            alert("account created");
            window.location.replace("/");
          }
          else if (res.status === 402) {
            res.json().then(error => {
              alert(error);
            })
          }
          else alert("Error: try again");
        })
    } catch (e) {
      alert("signup  " + e);
    }
  }

  return (
    <div className="user-account-form">
      <h1 className="popup-header-text">Create Account</h1>
      <form id="signup">
        <div className="flex-row">
          <div className="flex-column">
            <Textfield
              onBlur={(e) => registrationValidators.firstName(e)}
              placeholder="First Name"
              name="firstName"
              type="text"
              label="First Name"
              required
              error={errors.firstName}
              value={values.firstName}
              onChange={(e) => onChange(e)} />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-column">
            <Textfield
              onBlur={(e) => registrationValidators.lastName(e)}
              placeholder="Last Name"
              name="lastName"
              type="text"
              label="Last Name"
              required
              error={errors.lastName}
              value={values.lastName}
              onChange={(e) => onChange(e)} />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-column">
            <Textfield
              onBlur={(e) => registrationValidators.email(e)}
              placeholder="Email Address"
              name="email"
              type="email"
              label="Email"
              required
              error={errors.email}
              value={values.email}
              onChange={(e) => onChange(e)} />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-column">
            <Textfield
              onBlur={(e) => registrationValidators.username(e)}
              key="username"
              placeholder="Username"
              name="username"
              type="text"
              label="Username"
              required
              error={errors.username}
              value={values.username}
              onChange={(e) => onChange(e)} />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-column">
            <Textfield
              onBlur={(e) => registrationValidators.password(e)}
              placeholder="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              required
              error={errors.password}
              value={values.password}
              autoComplete="on"
              onChange={(e) => onChange(e)} />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-column">
            <Textfield
              onBlur={(e) => registrationValidators.confirmPassword(e)}
              placeholder="Confirm password"
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              required
              error={errors.confirmPassword}
              value={values.confirmPassword}
              autoComplete="on"
              onChange={(e) => onChange(e)} />
          </div>
        </div>
        <div className="flex-row">
          <div className="flex-column">
            <div className="show-password">
              <input name="showPassword" type="checkbox" onClick={toggleShowPassword}></input>
              <label htmlFor="showPassword">Show Password</label>
            </div>
          </div>
        </div>
      </form>
      <div>
        {/*button should be outside of the form, otherwise it is called twice and returns fetch error*/}
        {__renderButton(props.label)}
        {props.link}
      </div>
    </div>
  )
}

// --- user account controller smart component (handles main logic) ---/
export const UserAccountForm = ({ onSignIn }) => {
  const [mode, setMode] = useState('LOGIN');
  const __toggleMode = event => {
    event.preventDefault();
    const __mode = mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN';
    setMode(__mode);
  }


  const __renderLink = () => {
    return mode === 'LOGIN' ? (
      <div className="user-account-text">
        Don't have an account?
        <button className="user-account-link" role="link" onClick={(e) => __toggleMode(e)}> Sign up!</button>
      </div>)
      :
      <div className="user-account-text">
        Already have an account?
          <button className="user-account-link" role="link" onClick={(e) => __toggleMode(e)}> Login!</button>
      </div>
  }
  return (
    <div className="user-account-form-container">
      {mode === 'LOGIN' ? <LoginForm label="Log In" link={__renderLink()} onSignIn={onSignIn}/> : <RegistrationForm label="Sign Up" link={__renderLink()} />}
    </div>)
}