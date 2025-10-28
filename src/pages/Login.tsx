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

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();

  const onSubmit = (data: LoginFormData) => {
    alert('Login successful');
    console.log('Login data:', data);
    navigate('/home');
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

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={5}>
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
                  })}
                />
                {errors.password && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.password.message}
                  </Text>
                )}
              </Box>

              <Button
                type="submit"
                bg="blue.400"
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
                Login
              </Button>
            </Box>
          </form>
          <Text textAlign="center"> Don't have an account?{' '} <Link to="/signup" style={{ color: '#3182CE', fontWeight: '500' }}> Sign Up </Link> </Text>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
