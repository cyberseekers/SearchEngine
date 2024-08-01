'use client'
import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {

        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            setIsAuthenticated(true);
            setToken(savedToken);
        }
    }, []);

    const checkLogin = async (username, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const { token } = data;
                setToken(token);
                localStorage.setItem('authToken', token);
                setIsAuthenticated(true);
                alert('Login Successful');

            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const logout = () => {
        setToken('');
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');

    };



    return (
        <AuthContext.Provider value={{ isAuthenticated, token, checkLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);