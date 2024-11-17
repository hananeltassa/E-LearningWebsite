import React, { useEffect, useState } from 'react';
import './styles/dashboard.css';

const Dashboard = ({ user }) => {
    const [role, setRole] = useState(user?.role || 'student'); // Default 'student'
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
            </nav>

            {/* Main Content */}
            <div className="dashboard-content">
                {role === 'student' && (
                    <div className="student-dashboard" id="courses">
                        <h3>Your Courses</h3>
                        <p>Here you can see all your enrolled courses.</p>
                        <ul>
                            {enrolledCourses.map((course, index) => (
                                <li key={index}>{course}</li>
                            ))}
                        </ul>
                        <button onClick={handleEnrollCourse}>Enroll in a New Course</button>

                        <h3>Course Streams</h3>
                        <p>Check out the latest streams for your enrolled courses.</p>
                        <div className="streams-list">
                            {courseStreams.map((courseStream, index) => (
                                enrolledCourses.includes(courseStream.course) && (
                                    <div key={index} className="stream-course">
                                        <h4>{courseStream.course}</h4>
                                        <ul>
                                            {courseStream.streamPosts.map((post, postIndex) => (
                                                <li key={postIndex}>{post}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            ))}
                        </div>

                        <h3>Your Assignments</h3>
                        <p>Submit your assignments below.</p>
                        <button onClick={handleAssignmentSubmit}>Submit Assignment</button>
                    </div>
                )}

                {role === 'instructor' && (
                    <div className="instructor-dashboard" id="streams">
                        <h3>Your Courses & Streams</h3>
                        <p>Manage streams for the courses you're teaching.</p>
                        <div className="streams-management">
                            <h4>Course Streams</h4>
                            {courseStreams.map((courseStream, index) => (
                                <div key={index}>
                                    <h5>{courseStream.course}</h5>
                                    <ul>
                                        {courseStream.streamPosts.map((post, postIndex) => (
                                            <li key={postIndex}>{post}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <h3>Post Announcements</h3>
                        <textarea
                            placeholder="Write an announcement..."
                            value={announcement}
                            onChange={(e) => setAnnouncement(e.target.value)}
                        ></textarea>
                        <button onClick={handlePostAnnouncement}>Post Announcement</button>
                    </div>
                )}

                {role === 'admin' && (
                    <div className="admin-dashboard" id="admin">
                        <h3>Admin Dashboard</h3>
                        <p>Manage users and courses.</p>
                        <button>View All Users</button>
                        <button>View All Courses</button>
                        <button>Assign Instructors</button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="dashboard-footer">
                <p>&copy; 2024 E-Learning Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
