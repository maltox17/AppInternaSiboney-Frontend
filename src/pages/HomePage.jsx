import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to the Employee Management App</h1>
      <div style={styles.linksContainer}>
        <Link to="/login" style={styles.linkButton}>Go to Login</Link>
        <Link to="/empleado" style={styles.linkButton}>Go to Employee Page</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  linksContainer: {
    display: 'flex',
    gap: '20px',
  },
  linkButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    textDecoration: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default HomePage;