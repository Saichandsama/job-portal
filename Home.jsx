import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', margin: '100px 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-primary)' }}>
          Find Your <span style={{ color: 'var(--primary-color)' }}>Dream Job</span> Today
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Connect with top employers and discover opportunities that match your skills. The ultimate platform for ambitious professionals.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-outline">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
