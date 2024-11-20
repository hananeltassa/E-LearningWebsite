import React, { useEffect, useState } from 'react';
import './styles/studentDashboard.css';
import axios from 'axios';

const StudentDashboard = () => {
    const [error, setError] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
    const [newCommentText, setNewCommentText] = useState({});
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [privateComment, setPrivateComment] = useState('');


    useEffect(()=>{
        fetchCourses();
        fetchAnnouncements();
        fetchAssignments(); 
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
    

    // Handle file selection for assignment submission
    const handleFileChange = (e) => {
        setAssignmentFile(e.target.files[0]);
    };

    // Handle private comment change
    const handlePrivateCommentChange = (e) => {
        setPrivateComment(e.target.value);
    };

    // Handle assignment submission
    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User is not authenticated.');
            }
            const { data } = await axios.get('http://localhost/E-LearningWebsite/backend/student/get_assignments.php', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.status === 'success') {
                // Fetch assignment submission status for each assignment
                const assignmentsWithStatus = await Promise.all(data.data.map(async (assignment) => {
                    const submissionCheck = await axios.get(
                        `http://localhost/E-LearningWebsite/backend/student/check_assignment_submission.php?assignment_id=${assignment.id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    return {
                        ...assignment,
                        submitted: submissionCheck.data.status === 'success' && submissionCheck.data.submitted,  
                    };
                }));
                setAssignments(assignmentsWithStatus);
            } else {
                console.error('Error:', data.message || 'Failed to fetch assignments');
            }
        } catch (error) {
            console.error('Error fetching assignments:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAssignment = async (assignmentId) => {
        if (!assignmentFile) {
            alert('Please attach an assignment file.');
            return;
        }

        const formData = new FormData();
        formData.append('assignment_file', assignmentFile);
        formData.append('assignment_id', assignmentId);
        formData.append('private_comment', privateComment);

        // Prevent multiple submissions by checking the 'submitted' status
        const assignment = assignments.find(a => a.id === assignmentId);
        if (assignment && assignment.submitted) {
            alert('Assignment has already been submitted.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User is not authenticated.');
            }
            const response = await axios.post(
                'http://localhost/E-LearningWebsite/backend/student/submit_assignment.php',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === 'success') {
                alert(response.data.message);
                // Mark the assignment as submitted
                setAssignments((prevAssignments) =>
                    prevAssignments.map((a) =>
                        a.id === assignmentId ? { ...a, submitted: true } : a
                    )
                );
                setAssignmentFile(null);
                setPrivateComment('');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error submitting assignment:', error.message);
            alert('Failed to submit assignment. Please try again.');
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

            {/* Assignments Section */}
            <section className="assignments">
                <h3>Assignments</h3>
                <div className="assignment-list">
                    {loading ? (
                        <p>Loading assignments...</p>
                    ) : assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <div className="assignment" key={assignment.id}>
                                <h4>{assignment.title}</h4>
                                <p>Course: {assignment.course_name}</p>
                                <p>{assignment.description}</p>
                                <p>Due Date: {new Date(assignment.due_date).toLocaleDateString()}</p>
                                <p>Posted At: {new Date(assignment.posted_at).toLocaleDateString()}</p>

                                {/* File Upload and Submission Form */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSubmitAssignment(assignment.id);
                                    }}
                                >
                                    <label>
                                        Upload File:
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept=".pdf,.docx,.txt"
                                            disabled={assignment.submitted} 
                                        />
                                    </label>
                                    <button
                                        type="submit"
                                        className={assignment.submitted ? 'assignment-submitted' : ''}
                                        disabled={assignment.submitted}  
                                    >
                                        {assignment.submitted ? 'Submitted' : 'Submit Assignment'}
                                    </button>
                                </form>
                            </div>
                        ))
                    ) : (
                        <p>No assignments available.</p>
                    )}
                </div>
            </section>

        </div>
    );
};

export default StudentDashboard;
