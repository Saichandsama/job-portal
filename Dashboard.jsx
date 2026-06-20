import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  
  // New Job Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchJobs();
    fetchMyJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch my jobs', err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', {
        title, description, location, salary
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowPostForm(false);
      setTitle(''); setDescription(''); setLocation(''); setSalary('');
      fetchJobs();
      fetchMyJobs();
    } catch (err) {
      console.error('Failed to post job', err);
      alert('Error posting job');
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Successfully applied!');
      fetchMyJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error applying to job');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Welcome, {user.name}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Role: {user.role === 'employer' ? 'Employer' : 'Candidate'}</p>
        </div>
        <button onClick={logout} className="btn btn-outline">Log Out</button>
      </div>

      {user.role === 'employer' && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.5rem' }}>Your Posted Jobs</h3>
            <button onClick={() => setShowPostForm(!showPostForm)} className="btn btn-primary">
              {showPostForm ? 'Cancel' : 'Post New Job'}
            </button>
          </div>

          {showPostForm && (
            <div className="card" style={{ marginBottom: '30px' }}>
              <h4 style={{ marginBottom: '20px' }}>Create Job Posting</h4>
              <form onSubmit={handlePostJob}>
                <div className="form-group">
                  <label>Job Title</label>
                  <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required rows="4"></textarea>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Location</label>
                    <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Salary</label>
                    <input type="text" className="form-control" value={salary} onChange={(e) => setSalary(e.target.value)} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-secondary">Submit Job</button>
              </form>
            </div>
          )}

          {myJobs.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You haven't posted any jobs yet.</p>
          ) : (
            <div className="jobs-grid">
              {myJobs.map(job => (
                <div key={job.id} className="card job-card">
                  <h4 className="job-title">{job.title}</h4>
                  <p className="job-company">{job.company}</p>
                  <p className="job-details">{job.location} • {job.salary}</p>
                  <p className="job-details" style={{ marginBottom: 0 }}>{job.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user.role === 'candidate' && (
        <div style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Your Applications</h3>
          {myJobs.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You haven't applied to any jobs yet.</p>
          ) : (
            <div className="jobs-grid">
              {myJobs.map(job => (
                <div key={job.id} className="card job-card">
                  <h4 className="job-title">{job.title}</h4>
                  <p className="job-company">{job.company}</p>
                  <p className="job-details">{job.location} • {job.salary}</p>
                  <div style={{ display: 'inline-block', padding: '5px 10px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--secondary-color)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', marginTop: '10px' }}>
                    Status: {job.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>All Available Jobs</h3>
        {jobs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No jobs available right now.</p>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="card job-card">
                <h4 className="job-title">{job.title}</h4>
                <p className="job-company">{job.company}</p>
                <p className="job-details">{job.location} • {job.salary}</p>
                <p className="job-details" style={{ height: '60px', overflow: 'hidden' }}>{job.description}</p>
                {user.role === 'candidate' && (
                  <button onClick={() => handleApply(job.id)} className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
