import React from "react";
import Link from "next/link";
import '../styles/nav.css'




const LoggedOutNav = () => {



    return (
        <nav className="nav">
            <div className="inner-nav-container">
                <Link className='home-link' href='/'>Home</Link>
                <Link className='login-link' href='/log-in' >Log-in</Link>
                <Link className='home-link' href='/'>Log-out</Link>
            </div>

        </nav>

    )
}

export default LoggedOutNav