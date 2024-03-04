import React, { Component, useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './styles/Navbar.css';
import { IconContext } from 'react-icons'
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { UserAccountPopup } from './UserAccountPopup';
import { WelcomePopup } from './WelcomePopup';
import UserMenu from './UserMenu';
import HeaderLogo from '../pages/img/LogoNoText.png';
import { Blocker } from './Blocker';

function Navbar() {
    var loc = useLocation()
    const history = useHistory();
    console.log(loc.pathname)
    if(window.sessionStorage.getItem("location") == undefined) {
        window.sessionStorage.setItem("location", loc.pathname);
        window.sessionStorage.setItem("prevLoc", "");
        console.log("back");
    } else {
        if(window.sessionStorage.getItem("location") !== loc.pathname) {
            var back = window.sessionStorage.getItem("location")
            window.sessionStorage.setItem("location", loc.pathname);
            window.sessionStorage.setItem("prevLoc", back);
        }
    }
    const [sidebar, setSidebar] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const [loggedIn, setLoggedIn] = useState(window.sessionStorage.getItem("islogin")); //temporary user logged in flag
    const [user, setUser] = useState(loggedIn ? window.sessionStorage.getItem("username") : "Guest");   //grab username if logined, otherwise "Guest"
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showWelcomePopup, setWelcomePopup] = useState(false);

    const showSidebar = () => setSidebar(!sidebar)
    const togglePopup = () => setShowUserPopup(!showUserPopup);
    const toggleLogIn = () => { 
        setLoggedIn(window.sessionStorage.getItem('islogin'));  // get string "true" or "false"
        if(loggedIn != "true") {    // compare with string "true"
            setUser("Guest");
            togglePopup();
        } else toggleUserMenu();
    }
    const toggleWelcomePopup = () => {
        setWelcomePopup(!showWelcomePopup);
        setTimeout(() => {
            setWelcomePopup(false);
            window.location.reload(true)
            }, 
        3000);
    };

/*
    useEffect(async () => {
        try {
            if(window.sessionStorage.getItem("islogin")) {
                setLoggedIn(window.sessionStorage.getItem("islogin"));
                setUser(window.sessionStorage.getItem("firstName"));
            }
            /*await fetch('/getUserInfo')
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(result => {
                            setLoggedIn(result.islogin);
                            setUser(result.firstName);
                        })
                    }
                })
        } catch (e) {
            alert(e);
        }
    }, []);
*/
    const toggleUserMenu = () => setShowUserMenu(!showUserMenu)

    return (
        /* Below is needed to make Hamburger Menu white */
        <IconContext.Provider value={{color: '#ffffff'}}> 
          <div className='navbar'>
            
            {(window.location.href.search(/result/g) !== -1 || window.location.href.search(/userResult/g) !== -1) ?
                <FaIcons.FaArrowLeft className='arrow-button' onClick={()=>{ history.goBack()}}/>
            
            : 
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
            }


                
                {window.location.pathname !== '/' ? <div className="header-logo-img-container"><img className="header-logo-img" alt="Foothy avocado logo" onClick={() => window.location.replace('/')} style={{width: 50, height: 50}} src={HeaderLogo}/></div> : ``}
                <div className="user-container">
                        <FaIcons.FaUser 
                        onClick={toggleLogIn}
                        className="user-icon"/> 
                    <div className="greeting-text" onClick={toggleLogIn}>
                        Hello, {user}!
                        <div style={{marginLeft: 5}}>{user === 'Guest' ? <FaSignInAlt/> : <FaSignOutAlt/>}</div>
                    </div>
                 </div>
                    {/* <button onClick={toggleLogIn} >Logged {loggedIn? "in" : "off" } </button> */}
            </div>
            
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}> 
                    <li className="navbar-toggle">
                        <Link to="#" className='menu-bars'>
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            {sidebar? <Blocker onClick={()=>showSidebar()} transparent /> : null}
            {(showUserMenu && loggedIn)? <UserMenu/> : null }
            {showUserMenu? <Blocker onClick={toggleUserMenu} transparent/> : null}
            {showUserPopup ? <div><UserAccountPopup onSignIn={() => { togglePopup(); toggleWelcomePopup() }} onClose={togglePopup}/></div> : ''}
            {showWelcomePopup ? <WelcomePopup onClose={toggleWelcomePopup}/> : ''}
        </IconContext.Provider>
    );
}

export default Navbar;