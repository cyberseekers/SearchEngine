import React from "react";
import Link from "next/link";




const LoggedOutNav = () => {



    return (
        <nav className="nav">
            <Link href='/'>Home</Link>
            <Link href='/log-in' >Log In</Link>
        </nav>

    )
}

export default LoggedOutNav