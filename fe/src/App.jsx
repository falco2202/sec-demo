import React from "react";
import "./App.css";

export default function App() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [cookies, setCookies] = React.useState('');
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Login function that calls the backend API
  const handleLogin = async (e) => {
    e.preventDefault();

    if (username && password) {
      try {
        const response = await fetch(`${apiUrl}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });        

        const data = await response.json();

        console.log("data", data);
        
        if (data.success) {
          setLoggedIn(true);
          setMessage(`Welcome ${username}! You are now logged in.`);
          displayCookies();
        } else {
          setMessage(data.message || 'Login failed');
        }
      } catch (error) {
        setMessage('Error connecting to server');
        console.error('Login error:', error);
      }
    } else {
      setMessage('Please enter both username and password');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      setLoggedIn(false);
      setUsername('');
      setPassword('');
      setMessage('You have been logged out');
      setCookies('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayCookies = () => {
    setCookies(document.cookie);
  };

  // Simulated XSS attack to steal cookies
  const simulateXssAttack = () => {
    // In a real attack, this would send cookies to an attacker's server
    alert(`XSS Attack! Cookies stolen: ${document.cookie}`);

    // Display what an attacker might do with this data
    setMessage(`
      EDUCATIONAL DEMO ONLY: In a real attack, these cookies would be sent to a malicious server.
      An attacker could then use: curl -H "Cookie: ${document.cookie}" ${apiUrl}/api/profile
    `);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Security demo</h2>

      {!loggedIn ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-green-100 rounded">
            <p>{message}</p>
          </div>

          <div>
            <h3 className="font-medium">Current Cookies:</h3>
            <pre className="mt-1 bg-gray-100 p-2 rounded text-sm overflow-x-auto">
              {cookies || "No cookies found"}
            </pre>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={displayCookies}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
            >
              Refresh Cookies
            </button>

            <button
              onClick={handleLogout}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="mt-6 p-4 border border-red-300 rounded bg-red-50">
            <h3 className="font-medium text-red-800">Vulnerability Demonstration:</h3>
            <p className="text-sm text-red-700 mb-2">
              This demo uses non-HttpOnly cookies which are vulnerable to XSS attacks.
            </p>
            <button
              onClick={simulateXssAttack}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Simulate XSS Attack
            </button>
            <p className="text-sm text-red-700 mt-2">
              Try the search endpoint: <a href={`${apiUrl}/api/search?q=<script>fetch('/log?cookies='+document.cookie)</script>`} target="_blank" rel="noreferrer" className="underline">Vulnerable Search</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}