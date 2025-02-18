import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage/LoginPage";
import HomePageAluno from "./pages/HomePageAluno/HomePage";
import HomePageProfessor from "./pages/HomePageProfessor/HomePageProfessor";
import HomePageAdmin from "./pages/HomePageAdmin/HomePageAdmin";
import MainPage from "./pages/MainPage/MainPage"
import SchoolPage from "./pages/SchoolPage/SchoolPage";
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  const renderRootRoute = () => {
    if (isAuthenticated) {
      if (user?.tipo === 'professor') {
        return <Navigate to="/HomeProfessor" replace />;
      }
      if(user?.tipo === 'admin'){
        return <Navigate to="/HomeAdmin" replace />;
      }
      return <Navigate to="/HomeAluno" replace />;
    }
    return <MainPage />;
  };

  return (
    <Routes>
      <Route path="/" element={renderRootRoute()} />
      <Route path="/Escolas" element={<SchoolPage />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? renderRootRoute() : <LoginPage />} 
      />
      <Route
        path="/HomeAluno"
        element={
          <ProtectedRoute>
            <HomePageAluno />
          </ProtectedRoute>
        }
      />
      <Route
        path="/HomeProfessor"
        element={
          <ProtectedRoute>
            <HomePageProfessor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/HomeAdmin"
        element={
          <ProtectedRoute>
            <HomePageAdmin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: '#28a745',
                color: '#fff',
              },
            },
            error: {
              duration: 3000,
              style: {
                background: '#dc3545',
                color: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;