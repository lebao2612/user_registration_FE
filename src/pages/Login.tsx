import {
  Box,
  Button,
  Container,
  Input,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { AxiosError } from 'axios';
import { useState } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const { login } = useAuth(); // Lấy hàm login từ context
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  // Sử dụng React Query useMutation
  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => login(data.email, data.password),
    onSuccess: () => {
      setStatus('success');
      setMessage('✅ Login successful! Redirecting...');
      // Không cần navigate, AppRoutes sẽ tự xử lý
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message ||
        '❌ Invalid email or password.';
      setStatus('error');
      setMessage(errorMessage);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setMessage(null);
    mutation.mutate(data);
  };

  return (
    <Container maxW="container.sm" py={16}>
      <Box
        p={10}
        borderWidth={1}
        borderRadius="2xl"
        boxShadow="2xl"
        bg="white"
        _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
      >
        <Box display="flex" flexDirection="column" alignItems="stretch" gap={6}>
          <Heading
            textAlign="center"
            size="lg"
            color="blue.600"
            mb={2}
            letterSpacing="wide"
          >
            Welcome Back 👋
          </Heading>

          {/* Thông báo CSS thuần */}
          {message && (
            <Box
              p={3}
              borderRadius="md"
              bg={status === 'success' ? 'green.100' : 'red.100'}
              border={`1px solid ${
                status === 'success' ? '#48BB78' : '#F56565'
              }`}
              color={status === 'success' ? 'green.700' : 'red.700'}
              fontSize="sm"
              textAlign="center"
            >
              {message}
            </Box>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={5}>
              {/* Email Field */}
              <Box>
                <Text fontWeight="600" mb={2} color="gray.700">
                  Email
                </Text>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={Boolean(mutation.isPending)}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.email.message}
                  </Text>
                )}
              </Box>

              {/* Password Field */}
              <Box>
                <Text fontWeight="600" mb={2} color="gray.700">
                  Password
                </Text>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={Boolean(mutation.isPending)}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                {errors.password && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.password.message}
                  </Text>
                )}
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                bg="blue.400"
                colorScheme="blue"
                width="full"
                loading={Boolean(mutation.isPending)}
              >
                Login
              </Button>
            </Box>
          </form>

          {/* Footer */}
          <Text textAlign="center" mt={4}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{ color: '#3182CE', fontWeight: 500 }}
            >
              Sign Up
            </Link>
          </Text>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
