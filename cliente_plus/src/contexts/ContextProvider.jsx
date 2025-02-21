import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: "Orsano",
    });
    const [token, _setToken] = useState(localStorage.getItem("ACESS_TOKEN"));

    // localStorage.getItem("ACESS_TOKEN")
    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCES_TOKEN", token);
        } else {
            localStorage.removeItem("ACCES_TOKEN");
        }
    };
    return (
        <StateContext.Provider
            value={{
                user,
                token,
                setUser,
                setToken,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useStateContext = () => useContext(StateContext);
