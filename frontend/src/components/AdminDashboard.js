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
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchCourses();
    }, []);

    // Fetch Users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost/E-LearningWebsite/backend/admin/view_users.php', {
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

   // Handle creating a new user
   const handleCreateUser = async () => {
    console.log('New User Data:', newUser);

    if (newUser.username && newUser.email && newUser.password) {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                'http://localhost/E-LearningWebsite/backend/apis/register.php',
                { ...newUser, role: 'instructor' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === 'success') {
                setUsers([
                    ...users,
                    { ...newUser, id: response.data.userId, role: 'instructor' },
                ]);
                setNewUser({ username: '', email: '', password: '', role: 'instructor' });
            } else {
                console.error('Error creating user:', response.data.message);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    } else {
        alert('Please fill out all fields');
    }
};
    
    // Fetch Courses
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost/E-LearningWebsite/backend/admin/get_courses.php', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.status === 'success') setCourses(data.data);
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
                const response = await axios.post('http://localhost/E-LearningWebsite/backend/admin/create_course.php', newCourse, {
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
            const response = await axios({
                method: 'delete',
                url: 'http://localhost/E-LearningWebsite/backend/admin/delete_course.php',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { id: courseId },
            });
    
            if (response.data.status === 'success') {
                setCourses(courses.filter(course => course.id !== courseId)); 
            } else {
                console.error('Failed to delete course:', response.data.message);
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
                const response = await axios.put(
                    'http://localhost/E-LearningWebsite/backend/admin/edit_course.php',
                    {
                        id: editingCourse.id,
                        title: editingCourse.title,
                        description: editingCourse.description,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.data.status === 'success') {
                    setCourses(courses.map(course => 
                        course.id === editingCourse.id ? editingCourse : course
                    ));
                    setEditingCourse(null); 
                } else {
                    console.error('Error editing course:', response.data.message);
                }
            } catch (error) {
                console.error('Error editing course:', error);
            }
        } else {
            alert('Please fill out all fields.');
        }
    };

    const handleBanUser = async (userId, banStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost/E-LearningWebsite/backend/admin/ban_users.php',
                { id: userId, ban: banStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json', 
                    },
                }
            );
            
            if (response.data.status === 'success') {
                setUsers(users.map(user => 
                    user.id === userId ? { ...user, ban: banStatus } : user
                ));
            } else {
                console.error('Error banning user:', response.data.message);
            }
        } catch (error) {
            console.error('Error banning/unbanning user:', error);
        }
    };

    return (
        <div className="admin-dashboard" id="admin">
            <h3>Admin Dashboard</h3>
            <p>Manage users and courses.</p>

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
                                <th>Ban</th>
                                <th></th>
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
                                        <td>{user.ban ? 'Banned' : 'Active'}</td>
                                        <td>
                                            <button onClick={() => handleBanUser(user.id, user.ban ? 0 : 1)}>
                                                {user.ban ? 'Unban' : 'Ban'}
                                            </button>
                                        </td>
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
           
           {/* Add User Form */}
           <div className="add-user-form">
           <h4>Add A New Instructor</h4>
                    <input
                        type="text"
                        placeholder="Username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <button onClick={handleCreateUser}>Create User</button>
                </div>

            {/* Course Management */}
            {showCourses && (
                <div className="courses-table">
                    <h4>Manage Courses</h4>
                    <div className="course-form">
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
                        <select
                            value={newCourse.instructor_name}
                            onChange={(e) => setNewCourse({ ...newCourse, instructor_name: e.target.value })}>
                            <option value="">Select Instructor</option>
                            {users.filter((user) => user.role === 'instructor').map((instructor) => (
                                <option key={instructor.id} value={instructor.username}>{instructor.username}</option>
                            ))}
                        </select>
                        <button onClick={handleAddCourse}>Add Course</button>
                    </div>
                    <h4>All Courses</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Instructor</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td>{course.title}</td>
                                    <td>{course.description}</td>
                                    <td>{course.instructor_name}</td>
                                    <td>
                                        <button onClick={() => setEditingCourse(course)}>Edit</button>
                                        <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
                            {/* Instructor Dropdown */}
                            <label htmlFor="instructor-select">Select Instructor</label>
                            <select
                                value={newCourse.instructor_name}
                                onChange={(e) => setNewCourse({ ...newCourse, instructor_name: e.target.value })}>
                                <option value="">Select Instructor</option>
                                {users.filter((user) => user.role === 'instructor').map((instructor) => (
                                    <option key={instructor.id} value={instructor.username}>{instructor.username}</option>
                                ))}
                            </select>
                            
                            <button onClick={handleEditCourse}>Save</button>
                            <button onClick={() => setEditingCourse(null)}>Cancel</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
