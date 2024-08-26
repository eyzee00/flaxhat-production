import { Form, Row, Col, Stack, Alert, Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Login = () => {
    const { loginUser, loginError, loginInfo, updateLoginInfo, loginIsLoading} = useContext(AuthContext);
    return (
        
        <>
            <Form onSubmit={loginUser}>
                <Row className="justify-content-center align-items-center vh-100">
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2 className="text-center">Log In</h2>

                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" onChange={(e) => {
                                    updateLoginInfo({ ...loginInfo, email: e.target.value });
                                }} />
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter your password" onChange={(e) => {
                                    updateLoginInfo({ ...loginInfo, password: e.target.value });
                                }} />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                {loginIsLoading ? "Logging In..." : "Log In"}
                            </Button>

                            {
                                loginError?.error && <Alert variant="danger" className="text-center">
                                    <p>{loginError?.message}</p>
                                </Alert>
                            }
                            <Alert variant="info" className="text-center">
                                Have not created an account yet?{" "}
                                <Alert.Link href="/register">Register Now!</Alert.Link>
                            </Alert>
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
 
export default Login;