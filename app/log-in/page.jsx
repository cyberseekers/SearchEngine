import React from "react";
import '../../styles/login.css';
import LoggedOutNav from '../../components/logged-out-nav';


const LogIn = () => {

    return (
        <div >
            <LoggedOutNav />
            <div className="login-container" >
                <div className="login-box">
                    <form className="login-form">
                        <h1>Login</h1>
                        <div className="input-group">
                            <label className="label-login">
                                Username:
                                <input className="username-box"
                                    id='username'
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    required
                                />
                                <div className="errors">
                                </div>

                            </label>
                            <label className="label-login">
                                Password:
                                <input className="password-box"
                                    id='password'
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                />
                            </label>
                            <div className="errors">

                            </div>
                        </div>

                        <button
                            type="submit"
                            className="log-submit"
                        >
                            Login
                        </button>


                    </form>
                </div>
            </div>




        </div>

    );

}

export default LogIn;