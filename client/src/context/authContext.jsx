/**
 * Description: Auth context to handle user registration, login, and logout
 */

// Import the createContext, useState, useCallback, and useEffect hooks from React
import { createContext, useState, useCallback, useEffect } from "react";
// Import the PropTypes package
import PropTypes from "prop-types";
// Import the baseUrl and postRequest functions
import { baseUrl, postRequest } from "../utils/services";


// Create a new context
const AuthContext = createContext();


// Create a new component
const AuthContextProvider = ({ children }) => {

    // Add the following prop type validation for the children prop
    AuthContextProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };

    // Add the following state variables
    const [ user, setUser ] = useState(null);
    const [ registerError, setRegisterError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ registerInfo, setRegisterInfo ] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [ loginError, setLoginError ] = useState(null);
    const [ loginIsLoading, setLoginIsLoading ] = useState(false);
    const [ loginInfo, setLoginInfo ] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUser(user);
        }
    }, []);

    const logOutUser = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        if (response.error) {
            setIsLoading(false);
            return setRegisterError(response);
        }
        setIsLoading(false);

        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);
    }, [registerInfo]);

    // Add the following function
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info);
    }, []);

    const loginUser = useCallback(async (e) => {
        e.preventDefault();
        setLoginIsLoading(true);
        setLoginError(null);

        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));

        setLoginIsLoading(false);
        if (response.error) {
            return setLoginError(response);
        }
        localStorage.setItem("user", JSON.stringify(response));
        setUser(response);
    }, [loginInfo]);

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info);
    }, []);

    return (
        <AuthContext.Provider value={{  user, registerInfo, updateRegisterInfo, 
        registerUser, logOutUser, registerError, isLoading, loginUser, loginError, loginInfo, 
        updateLoginInfo, loginIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };