import React, { useState, useContext, useCallback } from 'react'
import { STYLES } from '../lib/theme'
import { FaJoint, FaUser, FaContao, FaCog, FaSearch } from "react-icons/fa";
import { APPLICATION_CONTEXT, VIEW_CONTEXT } from '../lib';
import { Link, NavLink } from 'react-router-dom';
import links from '../lib/links';


const AUTOHIDE_TIMEOUT = 20000
let timer: any
// TODO: build your own toolbar styling.

export default function Toolbar() {
    const [state, setState] = useState({ showMenu: false })
    const ctx = useContext(APPLICATION_CONTEXT)
    const vctx = useContext(VIEW_CONTEXT)
    const toggleMenu = () => {
        // Clear the existing timer for closing menu and then hide/show the menu
        clearTimeout(timer)
        if (state.showMenu) {
            setState({ ...state, showMenu: false })
        } else {
            setState({ ...state, showMenu: true })
            timer = setTimeout(() => {
                setState({ ...state, showMenu: false })
            }, AUTOHIDE_TIMEOUT)
        }
    }

    return (
        <nav className='navbar' role='navigation' style={STYLES.toolbar} aria-label='main navigation'>
            <div className='navbar-brand'>
                <Link className='navbar-item' to={links.home}>
                    <FaContao style={STYLES.appLogoIcon} />
                    <span style={STYLES.appLogoText}>{ctx.config.appName}</span>
                </Link>
                <a role="button" className={`navbar-burger burger ${state.showMenu ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbar" onClick={toggleMenu}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div className={`navbar-menu ${state.showMenu ? 'is-active' : ''}`} >
                <div className='navbar-start'>
                    <NavLink to={links.dashboard} exact activeClassName='is-active' className='navbar-item is-tab'>Dashboard</NavLink>
                    <NavLink to={links.messages} activeClassName='is-active' className='navbar-item is-tab'>Messages</NavLink>
                    <NavLink to={links.invoices} activeClassName='is-active' className='navbar-item is-tab'>Invoices</NavLink>
                    <NavLink to={links.jobs} activeClassName='is-active' className='navbar-item is-tab'>Jobs</NavLink>
                </div>
                <div className='navbar-end'>
                    <div className='navbar-item'>
                        <div className='field'>
                            <p className='control has-icons-left'>
                                <input className='input is-rounded' type='search' placeholder='Type to search...' />
                                <span className='icon is-small is-left'><FaSearch className='is-size-5' /></span>
                            </p>
                        </div>
                    </div>
                    <div className='navbar-item has-dropdown is-hoverable'>
                        <span className='navbar-link'>
                            {`${ctx.user?.firstName} ${ctx.user?.lastName}`}
                        </span>
                        <div className='navbar-dropdown'>
                            <Link to={links.profile} className='navbar-item'>Profile</Link>
                            <Link to={links.helpCenter} className='navbar-item'>Help Center</Link>
                            <Link to={links.logout} className='navbar-item'>Sign Out</Link>
                        </div>
                    </div>
                    <div className='navbar-item'>
                        <Link to={links.settings} className='button is-rounded is-light is-fullwidth'><FaCog /></Link>
                    </div>
                </div>
            </div>
        </nav >
    )
}