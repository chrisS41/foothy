import React from 'react'
//import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
//import * as IoIcons from 'react-icons/io';
import * as GiIcons from 'react-icons/gi'; 
import * as ImIcons from 'react-icons/im';
import * as FiIcons from 'react-icons/fi';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    }, 
    /*{
        title: 'Cookbook',
        path: '/cookbook',
        icon: <GiIcons.GiForkKnifeSpoon />,
        cName: 'nav-text'
    },*/
    // {
    //     title: 'Community',
    //     path: '/community',
    //     icon: <ImIcons.ImBubbles4 />,
    //     cName: 'nav-text'
    // },
    {
        title: 'Help',
        path: '/help',
        icon: <FiIcons.FiHelpCircle />,
        cName: 'nav-text'
    }, 

]

export const UserNavData = [
    {
        title: "View Profile",
        path: '/viewprofile',
        icon: '',
        cName: 'userNav-text'
    },
    /*{
        title: "Favorite List",
        path: '/favoritelist',
        icon: '',
        cName: 'userNav-text'
    },*/
    {
        title: 'Account Setting',
        path: '/accountsetting',
        icon: '',
        cName: 'userNav-text'
    },
    {
        title: 'Sign Out',
        path: '/',
        icon: '',
        cName: 'userNav-text'
    }
]
