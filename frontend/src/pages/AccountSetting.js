import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './styles/AccountSetting.css';
import { AccountSettingData } from '../components/SidebarData';

class AccountSettingPage extends Component {
    render(){
        return (
            <div className='accountSetting'>
                <h1>Account Setting</h1>

                <nav className = 'accountSettingContainer'>
                    {AccountSettingData.map((id, index)=>{
                        return(
                        <li key={index} className={id.cName}>
                            <Link to={id.path}>
                                {id.title}
                            </Link>
                        </li>
                        )
                    })}
                </nav>
            </div>
        );
    }
}
export default AccountSettingPage;


