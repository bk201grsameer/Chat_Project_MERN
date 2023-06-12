import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState('');
    const [selectedChat, setSelectedChat] = useState('');;
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    console.log('I am ChatProvider ', { user, selectedChat, chats });

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/');
            return;
        }
        setUser(userInfo);
    }, [navigate]);
    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>{children}</ChatContext.Provider>
    );
};
const ChatState = () => {
    return useContext(ChatContext);
};

export { ChatProvider, ChatState };