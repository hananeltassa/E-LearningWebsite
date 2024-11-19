import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/instructorDashboard.css';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="instructor-dashboard" id="instructor">
      {/* Assigned Courses Section */}
      <section className="assigned-courses">
        <h3>Your Assigned Courses</h3>
        <p>Manage the courses you are teaching and the related streams.</p>

        {/* Display loading or error message */}
        {loading && <p>Loading courses...</p>}
        {error && <p className="error">{error}</p>}

        {/* Display courses in card layout */}
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

      {/* Invite Students Section */}
    </div>
  );
};

export default InstructorDashboard;
