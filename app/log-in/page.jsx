"use client"
import React from "react";
import '../../styles/login.css';
import LoggedOutNav from '../../components/logged-out-nav';
import LoginFormSchema from '../../form_schema/login-schema'
import { useValidation } from '../../form_schema/use-validation'
import { useState } from "react";


const LogIn = () => {

    const [login, errors, setLogin] = useValidation(LoginFormSchema);
    const initialDisabled = true;
    const [disabled, setDisabled] = useState(initialDisabled);

    const change = (event) => {
        setLogin(event, login);
    }

    const handleDisabled = (e) => {
        e.preventDefault()
        if (login.username.length > 0 && login.password.length > 0) {
            setDisabled(() => ({
                disabled: !disabled
            }))
        }
        else {
            setDisabled(() => ({
                disabled: disabled
            }))
        }
    }




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
                                    onChange={change}
                                />
                                <div className="errors">
                                    <p>{errors.username}</p>
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
                                    onChange={change}
                                />
                            </label>
                            <div className="errors">
                                <p>{errors.password}</p>

                            </div>
                        </div>

                        <button
                            type="submit"
                            className="log-submit"
                            disabled={handleDisabled}
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