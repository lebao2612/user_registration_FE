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
import axios from 'axios';

interface SignUpFormData {
  email: string;
  password: string;
}

const API_URL = 'https://user-registration-api-dl92.onrender.com';

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const response = await axios.post(`${API_URL}/user/register`, data);
      return response.data;
    },
    onSuccess: () => {
      alert('Account created successfully');
      navigate('/login');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Error creating account');
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    mutation.mutate(data);
  };

  return (
    <Container
      maxW="container.sm"
      minH="100vh" // chiếm toàn bộ chiều cao màn hình
      display="flex"
      alignContent="center"
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
                  bg="gray.50"
                  borderColor="gray.300"
                  //focusBorderColor="blue.500"
                  rounded="md"
                  size="md"
                  _hover={{ borderColor: 'blue.400' }}
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
                  bg="gray.50"
                  borderColor="gray.300"
                  //focusBorderColor="blue.500"
                  rounded="md"
                  size="md"
                  _hover={{ borderColor: 'blue.400' }}
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
                colorScheme="blue"
                width="full"
                size="md"
                fontWeight="600"
                rounded="lg"
                loading={isSubmitting}
                _hover={{ bg: 'blue.600' }}
                _active={{ bg: 'blue.700' }}
                mt={2}
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
