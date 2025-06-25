import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { UserProvider } from "./contexts/UserContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CompleteProfile from "./pages/CompleteProfile"
import Dashboard from "./pages/Dashboard"
import Chatbot from "./pages/Chatbot"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"
import Appointments from "./pages/Appointments"
import Health from "./pages/Health"
import Medication from "./pages/Medication"
import Profile from "./pages/Profile"

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <ProtectedRoute>
                    <Chatbot />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/health"
                element={
                  <ProtectedRoute>
                    <Health />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/medication"
                element={
                  <ProtectedRoute>
                    <Medication />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
