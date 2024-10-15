import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmailForm from './pages/EmailForm';
import MessagesPage from './pages/MessagePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmailForm />} />
        <Route path="/messages" element={<MessagesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
