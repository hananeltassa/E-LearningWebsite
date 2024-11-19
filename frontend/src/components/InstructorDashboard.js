import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/instructorDashboard.css';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [assignment, setAssignment] = useState('');

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost/E-LearningWebsite/backend/apis/get_courses_instructors.php', {
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

  // Handle posting announcements
  const handlePostAnnouncement = async () => {
    if (!selectedCourse || !announcement) {
      alert('Please select a course and write an announcement.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost/E-LearningWebsite/backend/apis/post_announcement.php', {
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
    if (!selectedCourse) {
      alert('Please select a course for the assignment.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost/E-LearningWebsite/backend/apis/post_assignment.php', {
        assignment,
        course_id: selectedCourse,  
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'success') {
        alert('Assignment posted successfully!');
        setAssignment(''); 
        setSelectedCourse(''); 
      } else {
        alert('Failed to post assignment');
      }
    } catch (error) {
      alert('Error posting assignment: ' + error.message);
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

            {/* The assignment section can stay the same */}
            <div className="assignment-section">
            <h3>Post Assignments</h3>
                <textarea
                    placeholder="Write an assignment..."
                    value={assignment}
                    onChange={(e) => setAssignment(e.target.value)}
                />
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="">Select a Course</option>
                    {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                </select>
                <button onClick={handlePostAssignment}>Post Assignment</button>
            </div>

        </section>


      {/* Invite Students Section */}
    </div>
  );
};

export default InstructorDashboard;
