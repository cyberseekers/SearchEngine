import React from "react";
import '../styles/login.css';
import LoggedOutNav from './logged-out-nav';


const LogIn = () => {

    return (
        <div >
            <LoggedOutNav />
            <div className="login-container">
                <div className="login-box">
                    <form className="login-form">
                        <h1>Login</h1>
                        <div className="input-group">
                            <label className="label-login">
                                UserName:
                                <input className="username-box"
                                    id='username'
                                    name="username"
                                    type="text"
                                    placeholder="username"
                                    required
                                />
                            </label>
                        </div>


                    </form>
                </div>
            </div>




        </div>

    );

}

export default LogIn;