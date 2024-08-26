import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Notification from "./chat/notification";

const NavBar = () => {
    const { user, logOutUser } = useContext(AuthContext);
    
    return ( 
        <Navbar className="mb-4" style={{ height: "3.75rem", backgroundColor: "rgb(3, 10, 14)" }}>
            <Container>
                <h2>
                    <Link to="/" className="link-light text-decoration-none">FlaXhat</Link>
                </h2>
                <span className="text-warning">{user ? <p>Logged in as {user.name}</p> : <p>Instant Messaging At Your Fingertips!</p>}</span>
                <Nav>
                    <Stack direction="horizontal" gap={3}>
                        {!user && (
                            <>
                                {window.location.pathname !== "/register" && (
                                    <Link
                                        to="/register"
                                        className={`link-light text-decoration-none ${
                                            window.location.pathname === "/register" ? "active" : ""
                                        }`}
                                    >
                                        Register
                                    </Link>
                                )}
                                {window.location.pathname !== "/login" && (
                                    <Link
                                        to="/login"
                                        className={`link-light text-decoration-none ${
                                            window.location.pathname === "/login" ? "active" : ""
                                        }`}
                                    >
                                        Login
                                    </Link>
                                )}
                            </>
                        )}
                        {user && (
                            <>
                            <Notification />
                            <Link
                                to="/login"
                                className="link-light text-decoration-none"
                                onClick={logOutUser}>
                                Logout
                            </Link>
                            </>
                        )}
                    </Stack>
                </Nav>
            </Container>
        </Navbar> 
    );
}
 
export default NavBar;