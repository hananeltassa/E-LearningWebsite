import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/instructorDashboard.css';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [assignment, setAssignment] = useState({ title: '', description: '', dueDate: '' });
  const [selectedStudent, setSelectedStudent] = useState('');
  const [invitationStatus, setInvitationStatus] = useState('');
  const [selectedCourseForAnnouncement, setSelectedCourseForAnnouncement] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost/E-LearningWebsite/backend/instructor/get_courses_instructors.php', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'success') {
          setCourses(response.data.courses);
        } else {
          setError(response.data.message || 'Failed to fetch courses');
        }
      } catch (error) {
        setError('Error fetching courses: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost/E-LearningWebsite/backend/instructor/get_students.php', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.status === 'success') {
          setStudents(response.data.students);
        } else {
          setError(response.data.message || 'Failed to fetch students');
        }
      } catch (error) {
        setError('Error fetching students: ' + error.message);
      }
    };
  
    fetchStudents();
  }, []);

  const handlePostAnnouncement = async () => {
    if (!selectedCourse || !announcement) {
      alert('Please select a course and write an announcement.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost/E-LearningWebsite/backend/instructor/post_announcement.php', {
        announcement,
        course_id: selectedCourse,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        alert('Announcement posted successfully!');
        setAnnouncement('');
        setSelectedCourse('');
      } else {
        alert('Failed to post announcement');
      }
    } catch (error) {
      alert('Error posting announcement: ' + error.message);
    }
  };

  const handlePostAssignment = async () => {
    if (!selectedCourse || !assignment.title || !assignment.description || !assignment.dueDate) {
      alert('Please fill out all fields and select a course for the assignment.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost/E-LearningWebsite/backend/instructor/post_assignment.php', {
        title: assignment.title,
        description: assignment.description,
        due_date: assignment.dueDate,
        course_id: selectedCourse,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        alert('Assignment posted successfully!');
        setAssignment({ title: '', description: '', dueDate: '' });
        setSelectedCourse('');
      } else {
        alert('Failed to post assignment');
      }
    } catch (error) {
      alert('Error posting assignment: ' + error.message);
    }
  };

  const handleInviteStudent = async () => {
    if (!selectedStudent || !selectedCourseForAnnouncement) {
      alert('Please select a student and a course to send an invitation.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost/E-LearningWebsite/backend/instructor/post_invitation.php', {
        student_id: selectedStudent,
        course_id: selectedCourseForAnnouncement,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(response);
  
      if (response.data.status === 'success') {
        setInvitationStatus('Invitation sent successfully!');
        setSelectedStudent('');
        setSelectedCourseForAnnouncement('');
      } else {
        setInvitationStatus('Failed to send invitation');
      }
    } catch (error) {
      setInvitationStatus('Error sending invitation: ' + error.message);
      console.error(error); // Log the error message
    }
  };

  return (
    <div className="instructor-dashboard" id="instructor">
      {/* Assigned Courses Section */}
      <section className="assigned-courses">
        <h3>Your Assigned Courses</h3>
        <p>Manage the courses you are teaching and the related streams.</p>

        {/* Display loading or error message */}
        {loading && <p>Loading courses...</p>}
        {error && <p className="error">{error}</p>}

        {/* card layout */}
        {courses.length > 0 ? (
          <div className="courses-container">
            {courses.map(course => (
              <div className="course-card" key={course.id}>
                <h4 className="course-title">{course.title}</h4>
                <p className="course-description">{course.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses found.</p>
        )}
      </section>

      {/* Announcements & Assignments Section */}
      <section className="announcements-assignments">
        <h3>Post Announcements</h3>

        <div className="announcement-section">
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Write an announcement..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />

          <button onClick={handlePostAnnouncement}>Post Announcement</button>
        </div>

        <h3>Post Assignments</h3>
        <div className="assignment-section">
          <input
            type="text"
            placeholder="Assignment Title"
            value={assignment.title}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          />
          <textarea
            placeholder="Write an assignment description..."
            value={assignment.description}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          />
          <input
            type="date"
            value={assignment.dueDate}
            onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
          />
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button onClick={handlePostAssignment}>Post Assignment</button>
        </div>
      </section>

      {/* Invite Students Section */}
      <section className="invite-students">
        <h3>Invite Students</h3>
        <select value={selectedCourseForAnnouncement} onChange={(e) => setSelectedCourseForAnnouncement(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
        <option value="">Select Student</option>
            {students.map(student => (
                <option key={student.id} value={student.id}>
                {student.username}
            </option>
            ))}
        </select>

        <button onClick={handleInviteStudent}>Send Invitation</button>
        {invitationStatus && <p>{invitationStatus}</p>}
      </section>
    </div>
  );
};

export default InstructorDashboard;
