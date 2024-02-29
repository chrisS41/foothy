import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/UserMenu.css'
import { UserNavData } from './SidebarData';
import axios from 'axios'

function UserMenu() {
    const [menu, setUserMenu] = useState(false);

    const showUserMenu = () => setUserMenu(!menu);

    // logout button clicked
    let logoutButtonClick = async () => {
        try {
            window.sessionStorage.setItem('islogin', false);    // set window session
            window.sessionStorage.setItem('username', "Guest");
            window.sessionStorage.setItem('firstName', "Guest");
            window.location.replace("/");
            /*
            await axios.post('https://currserver.herokuapp.com/logout', {
                mode: "cors"
            })
                .then(res => {
                    if (res.status === 200) {
                        alert("logout success");
                        window.location.replace("/");
                    }
                })*/
        } catch (e) {
            alert("logout failed")
        }
    }

    return (
        <nav className='menuContainer'>
            <ul className='user-nav-data' onClick={showUserMenu}>
                {UserNavData.map((id, index) => {
                    if (id.title === "Sign Out") {
                        return (
                            <li key={index} className={id.cName} onClick={logoutButtonClick}>
                                <Link to={id.path} >
                                    {id.title}
                                </Link>
                            </li>
                        )
                    }
                    else {
                        return (
                            <li key={index} className={id.cName} >
                                <Link to={id.path} >
                                    {id.title}
                                </Link>
                            </li>
                        )
                    }
                })}
            </ul>
        </nav>
    );

}

export default UserMenu;