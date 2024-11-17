import React, { useEffect, useState } from 'react';
import './styles/dashboard.css';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = ({ user }) => {
    const [role, setRole] = useState(user?.role || 'student'); 
    const [enrolledCourses, setEnrolledCourses] = useState(["Course 1", "Course 2"]);
    const [courseStreams, setCourseStreams] = useState([
        { course: "Course 1", streamPosts: ["Stream post 1", "Stream post 2"] },
        { course: "Course 2", streamPosts: ["Stream post 3", "Stream post 4"] },
    ]);
    const [assignments, setAssignments] = useState([]);
    const [comment, setComment] = useState("");
    const [announcement, setAnnouncement] = useState("");

    useEffect(() => {
        if (user) {
            setRole(user.role);
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        window.location.href = 'login'; 
    };

    const handleEnrollCourse = () => {
        const newCourse = prompt("Enter course name to enroll:");
        if (newCourse) {
            setEnrolledCourses([...enrolledCourses, newCourse]);
        }
    };

    const handleAssignmentSubmit = () => {
        const assignment = prompt("Enter assignment details:");
        if (assignment) {
            setAssignments([...assignments, assignment]);
        }
    };

    const handlePostComment = () => {
        if (comment.trim()) {
            alert(`Comment Posted: ${comment}`);
            setComment(""); 
        }
    };

    const handlePostAnnouncement = () => {
        if (announcement.trim()) {
            alert(`Announcement Posted: ${announcement}`);
            setAnnouncement(""); 
        }
    };

    return (
        <div className="dashboard">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h2>Dashboard</h2>
                <ul>
                    <li><a href="#courses">Courses</a></li>
                    <li><a href="#streams">Streams</a></li>
                    <li><a href="#assignments">Assignments</a></li>
                    <li><a href="#comments">Comments</a></li>
                    {role === 'instructor' && <li><a href="#announcements">Announcements</a></li>}
                    {role === 'admin' && <li><a href="#admin">Admin Panel</a></li>}
                </ul>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            {/* Main Content */}
            <div className="dashboard-content">
                {role === 'student' && (
                    <StudentDashboard
                        enrolledCourses={enrolledCourses}
                        courseStreams={courseStreams}
                        handleEnrollCourse={handleEnrollCourse}
                        handleAssignmentSubmit={handleAssignmentSubmit}
                    />
                )}
                {role === 'instructor' && (
                    <InstructorDashboard
                        courseStreams={courseStreams}
                        announcement={announcement}
                        setAnnouncement={setAnnouncement}
                        handlePostAnnouncement={handlePostAnnouncement}
                    />
                )}
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
