import React, { useEffect, useState } from 'react';
import './styles/studentDashboard.css';
import axios from 'axios';

const StudentDashboard = () => {
    const [publicComment, setPublicComment] = useState('');
    const [privateComment, setPrivateComment] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const instructors = [
        { id: 1, name: 'Instructor A' },
        { id: 2, name: 'Instructor B' },
        { id: 3, name: 'Instructor C' },
    ];

    useEffect(()=>{
        fetchCourses();
    },[]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User is not authenticated.');
            }
            const { data } = await axios.get('http://localhost/E-LearningWebsite/backend/admin/get_courses.php', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.status === 'success') {
                setCourses(data.data);
            } else {
                console.error('Error:', data.message || 'Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNewEnrollment = async (course) => {
        const isEnrolling = !course.enrolled; 
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User is not authenticated.');
            }
    
            const response = await axios.post(
                'http://localhost/E-LearningWebsite/backend/student/enroll_course.php',
                {
                    course_id: course.id,
                    enroll: isEnrolling,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.status === 'success') {
                alert(response.data.message);
                // Update the course enrollment status
                setCourses((prevCourses) =>
                    prevCourses.map((c) =>
                        c.id === course.id ? { ...c, enrolled: isEnrolling } : c
                    )
                );
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during enrollment:', error.message);
        }
    };
    

    const handlePostPublicComment = () => {
        if (publicComment.trim()) {
            console.log('Public Comment:', publicComment);
            setPublicComment('');
        } else {
            alert('Please enter a comment before posting.');
        }
    };

    const handleSendPrivateComment = () => {
        if (privateComment.trim()) {
            if (!selectedInstructor) {
                alert('Please select an instructor to send your private comment.');
                return;
            }
            console.log(`Private Comment to ${selectedInstructor}:`, privateComment);
            setPrivateComment('');
        } else {
            alert('Please enter a private comment before sending.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAssignmentFile(file);
        }
    };

    const handleSubmitAssignment = () => {
        if (assignmentFile) {
            console.log('Submitting Assignment with file:', assignmentFile.name);
            setAssignmentFile(null); 
        } else {
            alert('Please attach a file before submitting.');
        }
    };

    return (
        <div className="student-dashboard">
            {/* Dashboard Overview */}
                <h3>Welcome, Student</h3>
                <p>View your current courses, assignments, and comments below.</p>


            {/* Enroll in Courses Section */}
            <section className="enroll-courses">
                <h3>Enroll in Courses</h3>
                <div className="courses-list">
                    {courses.map((course) => (
                        <div className="course" key={course.id}>
                            <h4>{course.title}</h4>
                            <p>{course.description}</p>
                            <p>Instructor: {course.instructor_name}</p>
                            <button onClick={() => handleNewEnrollment(course)}>{course.enrolled ? "Unenroll" : "Enroll"}</button>

                        </div>
                    ))}
                </div>
            </section>


            {/* Course Streams */}
            <section className="course-streams">
                <h3>Course Streams</h3>
                <div className="stream">
                    <p><strong>Course Name:</strong> Stream of posts, announcements, and discussions...</p>
                    {/* More streams for enrolled courses */}
                </div>
            </section>

            {/* Assignments Section */}
            <section className="assignments">
                <h3>Assignments</h3>
                <div className="assignment-list">
                    <div className="assignment">
                        <p>Assignment Name</p>
                        {/* File Input for Assignment Submission */}
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept=".pdf, .docx, .txt"
                        />
                        {assignmentFile && (
                            <p>Attached File: {assignmentFile.name}</p>
                        )}
                        <button onClick={handleSubmitAssignment}>Submit Assignment</button>
                    </div>
                    {/* Add more assignments here */}
                </div>
            </section>

            {/* Comments Section */}
            <section className="comments">
                <h3>Public Comments</h3>
                <div className="public-comments">
                    <textarea
                        placeholder="Post a public comment"
                        value={publicComment}
                        onChange={(e) => setPublicComment(e.target.value)}
                    />
                    <button onClick={handlePostPublicComment}>Post Comment</button>
                </div>

                <h3>Private Comments</h3>
                <div className="private-comments">
                    {/* Instructor Dropdown */}
                    <select
                        value={selectedInstructor}
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                        className="instructor-select"
                    >
                        <option value="">Select Instructor</option>
                        {instructors.map((instructor) => (
                            <option key={instructor.id} value={instructor.name}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Send a private comment to the instructor"
                        value={privateComment}
                        onChange={(e) => setPrivateComment(e.target.value)}
                    />
                    <button onClick={handleSendPrivateComment}>Send Comment</button>
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
