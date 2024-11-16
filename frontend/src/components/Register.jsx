import React, { useState } from "react";
import './Register.css';

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();

        if (username.trim() && email.trim() && password.trim()) {
            setSuccessMessage("Registration successful! You can now log in.");
            setError("");
            // Reset form fields
            setUsername("");
            setEmail("");
            setPassword("");
            setRole("student");
        } else {
            setError("Please fill out all fields.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="container">
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
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
