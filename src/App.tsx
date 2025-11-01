import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, defaultSystem, Spinner, Center } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";

const queryClient = new QueryClient();

// Component điều hướng, sử dụng trạng thái từ AuthContext
function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Nếu đang kiểm tra auth (lần tải đầu), hiển thị spinner
  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
     );
  }

  return (
    <Routes>
      {/* Trang Public: Nếu đã đăng nhập, điều hướng về Home */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/signup" 
        element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />} 
      />

      {/* Trang Protected: Nếu chưa đăng nhập, điều hướng về Login */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/home" 
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
      />

      {/* Bất kỳ route nào không khớp sẽ bị điều hướng */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <Router>
          {/* Bọc toàn bộ ứng dụng trong AuthProvider */}
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
