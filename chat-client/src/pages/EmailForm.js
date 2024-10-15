import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';

const EmailForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    if (email) {
      fetch(`${process.env.REACT_APP_REST_API_URL}/api/user?email=${encodeURIComponent(email)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('User not found');
          }
          return response.json();
        })
        .then((data) => {
          navigate(`/messages?id=${data.id}&name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}`);
        })
        .catch((error) => {
          setIsNewUser(true);
        });
    } else {
      alert('Please enter a valid email');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (email && name) {
      fetch(`${process.env.REACT_APP_REST_API_URL}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create user');
          }
          return response.json();
        })
        .then((res) => {
          const { id, name, email } = res.data;
          navigate(`/messages?id=${id}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
        })
        .catch((error) => {
          alert('Failed to sign up. Please try again.');
        });
    } else {
      alert('Please enter both email and name');
    }
  };

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {isNewUser ? (
        <form onSubmit={handleSignUp} style={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            style={{ marginBottom: '20px' }}
            disabled
          />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSignIn} style={{ width: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Enter your email
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      )}
    </Container>
  );
};

export default EmailForm;
