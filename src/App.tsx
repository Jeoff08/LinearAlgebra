// App.tsx
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import mathBg from "./assets/math.jpeg";
import TopicPage from "./pages/TopicPage";
// import TopicsPage from "./pages/TopicsPage";
import LoginPage from "./pages/LoginPage";
import PublicPage from "./pages/PublicPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import CalculatorApp from "./calculators/CalculatorApp";
import CalculatorsPage from "./pages/CalculatorsPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <div className="app-shell">
            <div className="ambient" aria-hidden>
              <img
                src={mathBg}
                alt="Mathematics Background"
                className="ambient-bg-img"
              />
              <div className="ambient-overlay" />
            </div>
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
              <Route path="/calculator" element={<CalculatorApp />} />
              <Route path="/calculators" element={<CalculatorsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}