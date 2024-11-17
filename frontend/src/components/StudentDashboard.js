import React from 'react';
import './styles/studentDashboard.css';

const StudentDashboard = ({ enrolledCourses, courseStreams, handleEnrollCourse, handleAssignmentSubmit }) => {
    return (
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
    );
};

export default StudentDashboard;
