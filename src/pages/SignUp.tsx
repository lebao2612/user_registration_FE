import {
  Box,
  Button,
  Container,
  Input,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/api';
import { AxiosError } from 'axios';
import { useState } from 'react';

interface SignUpFormData {
  email: string;
  password: string;
}

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const response = await api.post('/user/register', data);
      return response.data;
    },
    onSuccess: () => {
      setStatus('success');
      setMessage('✅ Account created successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || '❌ Error creating account.';
      setStatus('error');
      setMessage(errorMessage);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    setMessage(null);
    mutation.mutate(data);
  };

  return (
    <Container
      maxW="container.sm"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={10}
    >
      <Box
        p={10}
        borderWidth={1}
        borderRadius="2xl"
        boxShadow="2xl"
        bg="white"
        _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
        w="100%"
        maxW="500px"
      >
        <Box display="flex" flexDirection="column" gap={6}>
          <Heading
            textAlign="center"
            size="lg"
            color="blue.600"
            mb={2}
            letterSpacing="wide"
          >
            Create Your Account 🚀
          </Heading>

          {/* Thông báo bằng CSS thuần */}
          {message && (
            <Box
              p={3}
              borderRadius="md"
              bg={status === 'success' ? 'green.100' : 'red.100'}
              border={`1px solid ${status === 'success' ? '#48BB78' : '#F56565'}`}
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
                  disabled={mutation.isPending}
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
                  disabled={mutation.isPending}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
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
                loading={mutation.isPending}
              >
                Sign Up
              </Button>
            </Box>
          </form>

          {/* Footer */}
          <Text textAlign="center" color="gray.600" mt={4}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3182CE', fontWeight: 600 }}>
              Login
            </Link>
          </Text>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
