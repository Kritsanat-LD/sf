import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import Sidebarcss from "../css/sidebar.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faMessage, faUserTie, faHouse, faBars, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const NavbarAdmin = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            console.log('You are logged out');
        } catch (e) {
            console.log(e.message);
        }
    };



    return (
        <>

            <div className={Sidebarcss.baradmin}>
                <input type="checkbox" className={Sidebarcss.menu} id="menuToggle" />
                <div className={Sidebarcss.warpper}>
                    <header className={Sidebarcss.header}><img className={Sidebarcss.logo} src="./images/Rotten-potato.png" />
                        <label className={Sidebarcss.bars} htmlFor="menuToggle">
                            <FontAwesomeIcon icon={faBars} />
                        </label>
                    </header>
                    <div className={Sidebarcss.content}>
                        <span className={Sidebarcss.icon}>
                            <FontAwesomeIcon icon={faFilm} />
                        </span>
                        <a href="/movieManagement" className={Sidebarcss.name}>Movie Management</a>
                    </div>
                    <div className={Sidebarcss.content}>
                        <span className={Sidebarcss.icon}>
                            <FontAwesomeIcon icon={faUserTie} />
                        </span>
                        <a href="" className={Sidebarcss.name}>Actor Management</a>
                    </div>
                    <div className={Sidebarcss.content}>
                        <span className={Sidebarcss.icon}>
                            <FontAwesomeIcon icon={faMessage} />
                        </span>
                        <a href="" className={Sidebarcss.name}>Comment Management</a>
                    </div>
                    <div className={Sidebarcss.content}>
                        <span className={Sidebarcss.icon}>
                            <FontAwesomeIcon icon={faHouse} />
                        </span>
                        <a href="" className={Sidebarcss.name}>Home Page User</a>
                    </div>
                    <div className={Sidebarcss.content} onClick={handleLogout}>
                        <span className={Sidebarcss.icon}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                        </span>
                        <a href="" className={Sidebarcss.name}>Logout</a>
                    </div>
                </div>
            </div>
        </>
    )

}

export default NavbarAdmin;