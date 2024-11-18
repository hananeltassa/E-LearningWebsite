import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/adminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showUsers, setShowUsers] = useState(false);
    const [showCourses, setShowCourses] = useState(true);
    const [filterRole, setFilterRole] = useState('all');
    const [loading, setLoading] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructorName: '' });
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost/E-LearningWebsite/backend/apis/view_users.php', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status === 'success') {
                setUsers(response.data.data);
                setShowUsers(true);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost/E-LearningWebsite/backend/apis/get_courses.php', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status === 'success') {
                setCourses(response.data.courses);
                setShowCourses(true);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle adding a new course
    const handleAddCourse = async () => {
        console.log('newCourse:', newCourse); 
        if (newCourse.title && newCourse.description && newCourse.instructor_name) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost/E-LearningWebsite/backend/apis/create_course.php', newCourse, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status === 'success') {

                    setCourses([...courses, { ...newCourse, id: response.data.courseId }]);
                    setNewCourse({ title: '', description: '', instructor_name: '' });
                } else {
                    console.error('Error creating course:', response.data.message);
                }
            } catch (error) {
                console.error('Error adding course:', error);
            }
        } else {
            alert('Please fill out all fields');
        }
    };

    // Handle course deletion
    const handleDeleteCourse = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost/E-LearningWebsite/backend/apis/delete_course.php?id=${courseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status === 'success') {
                setCourses(courses.filter(course => course.id !== courseId));
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    // Handle course editing
    const handleEditCourse = async () => {
        if (editingCourse && editingCourse.title && editingCourse.description) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.put('http://localhost/E-LearningWebsite/backend/apis/edit_course.php', editingCourse, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status === 'success') {
                    setCourses(courses.map(course => course.id === editingCourse.id ? editingCourse : course));
                    setEditingCourse(null); // Reset editing state
                }
            } catch (error) {
                console.error('Error editing course:', error);
            }
        }
    };

    return (
        <div className="admin-dashboard" id="admin">
            <h3>Admin Dashboard</h3>
            <p>Manage users and courses.</p>

            {/* Loading Indicator */}
            {loading && <p>Loading...</p>}

            {/* User Management */}
            {showUsers && !loading && (
                <div className="filter-options">
                    <label>Filter by role: </label>
                    <select onChange={(e) => setFilterRole(e.target.value)} value={filterRole}>
                        <option value="all">All</option>
                        <option value="student">Students</option>
                        <option value="instructor">Instructors</option>
                    </select>
                </div>
            )}

            {/* Users Table */}
            {showUsers && !loading && (
                <div className="users-table">
                    <h4>All Users</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.filter(user => filterRole === 'all' || user.role === filterRole)
                                    .map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No users found for the selected role.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Course Management */}
            {showCourses && !loading && (
                <div className="courses-table">
                    <h4>Manage Courses</h4>
                    <div>
                        <input
                            type="text"
                            placeholder="Course Title"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Course Description"
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        />

                        {/* Instructor selection */}
                        <select
                            value={newCourse.instructor_name}
                            onChange={(e) => setNewCourse({ ...newCourse, instructor_name: e.target.value })}
                        >
                            <option value="">Select Instructor</option>
                            {users.filter(user => user.role === 'instructor').map((instructor) => (
                                <option key={instructor.id} value={instructor.username}>
                                    {instructor.username}
                                </option>
                            ))}
                        </select>

                        <button onClick={handleAddCourse}>Add Course</button>
                    </div>

                    {/* Courses Table */}
                    <table>
                        <thead>
                            <tr>
                                <th>Course Title</th>
                                <th>Description</th>
                                <th>Instructor</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <tr key={course.id}>
                                        <td>{course.title}</td>
                                        <td>{course.description}</td>
                                        <td>{course.instructorName}</td>
                                        <td>
                                            <button onClick={() => setEditingCourse(course)}>Edit</button>
                                            <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No courses available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Edit Course Modal */}
                    {editingCourse && (
                        <div className="edit-course-modal">
                            <h5>Edit Course</h5>
                            <input
                                type="text"
                                value={editingCourse.title}
                                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                            />
                            <input
                                type="text"
                                value={editingCourse.description}
                                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                            />
                            <button onClick={handleEditCourse}>Save Changes</button>
                            <button onClick={() => setEditingCourse(null)}>Cancel</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
