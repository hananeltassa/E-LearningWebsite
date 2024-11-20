import React, { useEffect, useState } from 'react';
import './styles/studentDashboard.css';
import axios from 'axios';

const StudentDashboard = () => {
    const [error, setError] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
    const [publicComment, setPublicComment] = useState('');
    const [newCommentText, setNewCommentText] = useState({});
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [privateComment, setPrivateComment] = useState('');

    useEffect(()=>{
        fetchCourses();
        fetchAnnouncements();
    },[]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User is not authenticated.');
            }
            const { data } = await axios.get('http://localhost/E-LearningWebsite/backend/student/get_courses_student.php', {
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

    const fetchAnnouncements = async () => {
        setLoadingAnnouncements(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User is not authenticated.');
            }
    
            const { data } = await axios.get('http://localhost/E-LearningWebsite/backend/student/get_announcements.php', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (data.status === 'success') {
                const announcementsWithComments = await Promise.all(
                    data.announcements.map(async (announcement) => {
                        const commentsResponse = await axios.get(
                            `http://localhost/E-LearningWebsite/backend/student/announcement_comments.php?announcement_id=${announcement.id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        return {
                            ...announcement,
                            comments: commentsResponse.data.status === 'success' ? commentsResponse.data.comments : [],
                        };
                    })
                );
                setAnnouncements(announcementsWithComments);
            } else {
                setError(data.message || 'Failed to fetch announcements.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching announcements.');
        } finally {
            setLoadingAnnouncements(false);
        }
    };
    

    
    // Handle comment submission
    const handleCommentChange = (e, announcementId) => {
        setNewCommentText((prev) => ({ ...prev, [announcementId]: e.target.value }));
    };

    const handleCommentSubmit = async (e, announcementId) => {
        e.preventDefault();
        const commentText = newCommentText[announcementId]?.trim();
        if (!commentText) return alert('Comment cannot be empty.');
    
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('User is not authenticated.');
    
            const response = await axios.post(
                'http://localhost/E-LearningWebsite/backend/student/announcement_comments.php',
                { announcement_id: announcementId, comment_text: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.status === 'success') {
                alert(response.data.message);
                setNewCommentText((prev) => ({ ...prev, [announcementId]: '' })); 
                fetchAnnouncements();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error posting comment:', error.message);
            alert('Failed to post comment. Please try again.');
        }
    };
    

    const handleFileChange = (e) => {

    };

    const handleSubmitAssignment = () => {

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

            {/* Course Streams Section */}
            <section className="course-streams">
                <h3>Course Streams</h3>
                {loadingAnnouncements ? (
                    <p>Loading announcements...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : announcements.length ? (
                    announcements.map((announcement) => (
                <div className="stream" key={announcement.id}>
                    <h4>Course: {announcement.course_name}</h4>
                    <p>
                        <strong>Announcement:</strong> {announcement.announcement_text}
                    </p>
                    <p>
                        <em>Posted on: {new Date(announcement.created_at).toLocaleString()}</em>
                    </p>

                    {/* Comments Section in Announcments */}
                    <div className="comments-section">
                        <h5>Comments</h5>
                        {announcement.comments?.length > 0 ? (
                            announcement.comments.map((comment) => (
                                <div key={comment.id} className="comment">
                                    <p>
                                        <strong>{comment.commenter_name}:</strong> {comment.comment_text}
                                    </p>
                                    <p>
                                        <em>{new Date(comment.created_at).toLocaleString()}</em>
                                    </p>
                                </div>
                                        ))
                                    ) : (
                                        <p>No comments yet.</p>
                                    )}

                                    {/* Add Comment Form */}
                                    <form onSubmit={(e) => handleCommentSubmit(e, announcement.id)} className="add-comment-form">
                                        <input type="text" placeholder="Write a comment..." value={newCommentText[announcement.id] || ""}
                                            onChange={(e) => handleCommentChange(e, announcement.id)} />
                                        <button type="submit">Add Comment</button>
                                    </form>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No announcements found for your enrolled courses.</p>
                    )}
            </section>

            {/* Assignments Section */}
            <section className="assignments">
                <h3>Assignments</h3>
                <div className="assignment-list">
                    {loading ? (
                        <p>Loading assignments...</p>
                    ) : (
                        assignments.map((assignment) => (
                            <div className="assignment" key={assignment.id}>
                                <h4>{assignment.title}</h4>
                                <p>Course: {assignment.course_name}</p>
                                <p>{assignment.description}</p>
                                <p>Due Date: {assignment.due_date}</p>
                                <p>Posted At: {assignment.posted_at}</p>

                                {/* File Input for Assignment Submission */}
                                <input type="file" onChange={handleFileChange} accept=".pdf, .docx, .txt"/>
                                {assignmentFile && (
                                    <p>Attached File: {assignmentFile.name}</p>
                                )}

                                {/* Private Comment Input */}
                                <textarea value={privateComment} onChange={handleCommentChange} placeholder="Leave a private comment for the instructor"></textarea>
                                <button onClick={() => handleSubmitAssignment(assignment.id)}>
                                    Submit Assignment
                                </button>
                            </div>
                        ))
                    )}
                    <p>No assignments to show</p>
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
