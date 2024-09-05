import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Register from './Components/Register';
import ConnectionCheck from './Components/ConnectionCheck';
const token = localStorage.getItem('jwtToken')

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={token !== null ? <Dashboard /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token !== null ? <Dashboard /> : <Login />} />
        <Route path="/check-connection" element={<ConnectionCheck />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
