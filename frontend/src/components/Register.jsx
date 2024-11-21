import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './styles/auth.module.css';


const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();
    
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("Please fill out all fields.");
            setSuccessMessage("");
            return;
        }
        try {
            const response = await fetch("http://localhost/E-LearningWebsite/backend/apis/register.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role,
                }),
            });

            const data = await response.json();

            if (data.status === "success") {
                setSuccessMessage(data.message);
                setError("");
                // Reset form fields
                setUsername("");
                setEmail("");
                setPassword("");
                setRole("student");

                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } else {
                setError(data.message);
                setSuccessMessage("");
            }
        } catch (error) {
            setError("An error occurred while registering. Please try again.");
            setSuccessMessage("");
            console.error("Error:", error);
        }

    };

    return (
        <div className={styles.registerContainer}>
        <div className={styles.container}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Enter Your Username"
                    />
                </div>

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

                <div>
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>
                </div>

                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}

                <button type="submit">Register</button>
            </form>
        </div>
    </div>
    );
};

export default Register;
