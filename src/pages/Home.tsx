import {
  Box,
  Container,
  Heading,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

function Home() {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'success' | 'error' | 'info' | null>(null);

  // Mutation để xử lý đăng xuất
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setStatus('info');
      setMessage('ℹ️ You have been logged out successfully.');
      // AppRoutes sẽ tự động chuyển về trang /login
    },
    onError: () => {
      setStatus('error');
      setMessage('❌ Failed to log out. Please try again.');
    },
  });

  if (!user) {
    return (
      <Container maxW="container.md" py={10}>
        <Text>Loading user data...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack gap={8} align="stretch">
        <Box textAlign="center">
          <Heading>Welcome, {user.email}!</Heading>
          <Text fontSize="lg" color="gray.600">
            This is your protected dashboard.
          </Text>
        </Box>

        {/* Thông báo CSS thay cho toast */}
        {message && (
          <Box
            p={3}
            borderRadius="md"
            bg={
              status === 'success'
                ? 'green.100'
                : status === 'error'
                ? 'red.100'
                : 'blue.100'
            }
            border={`1px solid ${
              status === 'success'
                ? '#48BB78'
                : status === 'error'
                ? '#F56565'
                : '#4299E1'
            }`}
            color={
              status === 'success'
                ? 'green.700'
                : status === 'error'
                ? 'red.700'
                : 'blue.700'
            }
            fontSize="sm"
            textAlign="center"
          >
            {message}
          </Box>
        )}

        {/* Thay Card bằng Box */}
        <Box
          borderWidth={1}
          borderRadius="xl"
          p={6}
          boxShadow="md"
          bg="white"
          _dark={{ bg: 'gray.700' }}
        >
          <Heading size="md" mb={4}>
            Your Profile
          </Heading>
          <Text>
            <strong>Email:</strong> {user.email}
          </Text>
          <Text>
            <strong>Joined:</strong>{' '}
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </Box>

        <Button
          colorScheme="red"
          bg="blue.400"
          onClick={() => {
            setMessage(null);
            logoutMutation.mutate();
          }}
          loading={Boolean(logoutMutation.isPending)}
        >
          Logout
        </Button>
      </VStack>
    </Container>
  );
}

export default Home;
