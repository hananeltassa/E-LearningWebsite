import React from 'react';
import './styles/instructorDashboard.css';
const InstructorDashboard = ({ courseStreams, announcement, setAnnouncement, handlePostAnnouncement }) => {
    return (
        <div className="instructor-dashboard" id="streams">
            <h3>Your Courses & Streams</h3>
            <p>Manage streams for the courses you're teaching.</p>
            <div className="streams-management">
                <h4>Course Streams</h4>
                {courseStreams.map((courseStream, index) => (
                    <div key={index}>
                        <h5>{courseStream.course}</h5>
                        <ul>
                            {courseStream.streamPosts.map((post, postIndex) => (
                                <li key={postIndex}>{post}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <h3>Post Announcements</h3>
            <textarea
                placeholder="Write an announcement..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
            ></textarea>
            <button onClick={handlePostAnnouncement}>Post Announcement</button>
        </div>
    );
};

export default InstructorDashboard;
