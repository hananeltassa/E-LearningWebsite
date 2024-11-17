import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './styles/auth.module.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccessMessage("");

        if (!email || !password) {
            setError("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost/E-LearningWebsite/backend/apis/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (data.status === "success") {
                setSuccessMessage(data.message);

                // store token and user data in local storage
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setEmail("");
                setPassword("");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);

            } else {
                setError(data.message || "An error occurred during login.");
            }
        } catch (error) {
            setError("An error occurred while logging in. Please try again.");
            console.error("Login Error:", error);
        }
    };

    return (
        <div className={styles.registerContainer}>
        <div className={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter your email" 
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
