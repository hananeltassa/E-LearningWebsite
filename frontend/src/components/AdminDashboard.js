
import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard" id="admin">
            <h3>Admin Dashboard</h3>
            <p>Manage users and courses.</p>
            <button>View All Users</button>
            <button>View All Courses</button>
            <button>Assign Instructors</button>
        </div>
    );
};

export default AdminDashboard;
