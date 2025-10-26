import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.lg" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;