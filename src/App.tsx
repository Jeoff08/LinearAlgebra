import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import TopicPage from "./pages/TopicPage";
// import TopicsPage from "./pages/TopicsPage";
import LoginPage from "./pages/LoginPage";
import PublicPage from "./pages/PublicPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";


export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="app-shell">
          <div className="ambient" aria-hidden />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<PublicPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              {/* <Route path="/topics" element={<TopicsPage />} /> */}
              <Route path="/topics/:id" element={<TopicPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}