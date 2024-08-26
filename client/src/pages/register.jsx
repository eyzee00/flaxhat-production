import { Form, Row, Col, Stack, Alert, Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Register = () => {
    const { registerInfo, updateRegisterInfo, registerUser, registerError, isLoading } = useContext(AuthContext);
    return (
        <>
            <Form onSubmit={registerUser}>
                <Row style={{
                    height: "100vh",
                    justifyContent: "center",
                    paddingTop: "10%"
                }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2 className="text-center">Register Now And Start Chatting!</h2>

                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter your name" onChange={(e) => {
                                    updateRegisterInfo({
                                        ...registerInfo,
                                        name: e.target.value
                                    });
                                }} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" onChange={(e) => {
                                    updateRegisterInfo({
                                        ...registerInfo,
                                        email: e.target.value
                                    });
                                }} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your password" onChange={(e) => {
                                    updateRegisterInfo({
                                        ...registerInfo,
                                        password: e.target.value
                                    });
                                }} />
                            </Form.Group>

                            <Button variant="primary" type="submit">{isLoading ? "Creating Account..." : "Register"}</Button>
                            {
                                registerError?.error && <Alert variant="danger"><p>{registerError?.message}</p></Alert>
                            }
                            <Alert variant="info" className="text-center">Already Have an Account? <Alert.Link href="/login">Log In Now!</Alert.Link></Alert>

                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
 
export default Register;