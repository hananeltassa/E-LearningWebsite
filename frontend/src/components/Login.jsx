import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './styles/auth.module.css';
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");

        if (!username || !password) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            const response = await axios.post("http://localhost/E-LearningWebsite/backend/apis/login.php",{
                username,
                password,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });


            if (response.data.status === "success") {
                setSuccessMessage(response.data.message);
                localStorage.setItem("token", response.data.token);

                setUsername("");
                setPassword("");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);

            } else {
                setError(response.data.message || "An error occurred during login.");
            }
        } catch (error) {
            setError("An error occurred while logging in. Please try again.");
            console.error("Login Error:", error.message);
        }
    };

    return (
        <div className={styles.registerContainer}>
        <div className={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username</label>
                    <input 
                        type="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Enter your username" 
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter your password" 
                    />
                </div>

                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <button type="submit">Login</button>
            </form>
        </div>
        </div>
    );
};

export default Login;
