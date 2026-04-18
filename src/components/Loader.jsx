import { Container, Spinner } from 'react-bootstrap'
const Loader = () => {
  return (
    <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Loading...</p>
      </Container>
  )
}

export default Loader