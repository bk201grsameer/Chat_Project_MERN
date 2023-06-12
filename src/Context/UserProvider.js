import { createContext, useContext, useState } from "react";



const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState('');
    console.log('getderived', { userInfo });
    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};
const UserState = () => {
    return useContext(UserContext);
};
export { UserProvider, UserState };
