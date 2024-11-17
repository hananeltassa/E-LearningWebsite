import React, { useEffect, useState } from 'react';


const Dashboard = ({ user }) => {
    const [role, setRole] = useState(user?.role || 'student'); // Default 'student'

    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user]);

    return (
        <div className="dashboard">
            <h2>Welcome to your Dashboard</h2>
            <div className="dashboard-content">
                {role === 'student' && (
                    <div className="student-dashboard">
                        <h3>Your Courses</h3>
                        <p>Here you can see all your enrolled courses.</p>
                        <ul>
                            <li>Course 1</li>
                            <li>Course 2</li>
                        </ul>
                        <h3>Your Assignments</h3>
                        <p>Submit your assignments below.</p>
                        <button>Submit Assignment</button>
                    </div>
                )}

                {role === 'instructor' && (
                    <div className="instructor-dashboard">
                        <h3>Assigned Courses</h3>
                        <p>Here you can see all the courses you're teaching.</p>
                        <ul>
                            <li>Course A</li>
                            <li>Course B</li>
                        </ul>
                        <h3>Post Announcements</h3>
                        <textarea placeholder="Write an announcement..."></textarea>
                        <button>Post Announcement</button>
                    </div>
                )}

                {role === 'admin' && (
                    <div className="admin-dashboard">
                        <h3>Admin Dashboard</h3>
                        <p>Manage users and courses.</p>
                        <button>View All Users</button>
                        <button>View All Courses</button>
                        <button>Assign Instructors</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
