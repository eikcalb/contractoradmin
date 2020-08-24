import React, { useContext } from "react";
import { APPLICATION_CONTEXT } from "../lib";
import links from '../lib/links'
import { Link } from "react-router-dom";

export function Footer() {
    const ctx = useContext(APPLICATION_CONTEXT)

    return (
        <footer className='footer is-unselectable' >
            <div className="content has-text-centered is-size-7-touch">
                <p>&copy; {ctx.config.appName} {new Date().getFullYear()}. All Rights Reserved | <Link to={links.privacyPolicy}>Privacy Policy</Link> | <Link to={links.termsOfService}>Terms of Service</Link> </p>
            </div>
        </footer>
    )
}