import { Box, Container, Heading } from '@chakra-ui/react';

function Home() {
  return (
    <Container maxW="container.md" py={10}>
      <Box textAlign="center">
        <Heading>Welcome to the Home Page</Heading>
      </Box>
    </Container>
  );
}

export default Home;