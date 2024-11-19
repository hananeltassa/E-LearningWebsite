import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/dashboard.css';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = ({ user }) => {
    const [role, setRole] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }
            try {
                const response = await axios.get('http://localhost/E-LearningWebsite/backend/apis/dashboard.php', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const data = response.data;
                if (data.role) {
                    setRole(data.role);
                } else {
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserRole();
    }, []);
    

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        window.location.href = 'login'; 
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h2>E-Learning</h2>
                <ul>
                    <li><a href="#courses">Courses</a></li>
                    <li><a href="#streams">Streams</a></li>
                    <li><a href="#assignments">Assignments</a></li>
                    <li><a href="#comments">Comments</a></li>
                    {role === 'instructor' && <li><a href="#announcements">Announcements</a></li>}
                    {role === 'admin' && <li><a href="#admin">Admin Panel</a></li>}
                </ul>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </nav>

            {/* Main Content */}
            <div className="dashboard-content">
                {role === 'student' && (
                    <StudentDashboard/>
                )}
                {role === 'instructor' && <InstructorDashboard />}
                
                {role === 'admin' && <AdminDashboard />}
                
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>&copy; 2024 E-Learning Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
