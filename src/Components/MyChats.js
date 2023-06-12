import { AddIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getSender, getUser } from '../Config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const MyChats = ({ fetchAgain, setFetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState('');
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    // get all the user chats
    const fetchChats = async () => {
        try {
            if (user) {
                const config = {
                    headers: {
                        Authorization: user.token
                    }
                };
                const { data } = await axios.get('http://localhost:5000/api/chat/fetchchats', config);
                console.log(data);
                setChats(data.userChats);
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo)
            setLoggedUser(userInfo);
        if (user)
            fetchChats();
    }, [fetchAgain]);
    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDirection="column"
            alignItems={"center"}
            p={3}
            bg="white"
            width={{ base: "80%", md: "40%" }}
            borderRadius="lg"
            borderWidth={'1px'}
            mt={2}
            ml={2}
            mb={2}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{
                    base: "28px",
                    md: "30px"
                }}
                display={"flex"}
                width="100%"
                justifyContent={'space-between'}
                alignItems="center"
            >
                <Text>MyChat</Text>
                <Button
                    display={'flex'}
                    mt={1.5}
                    rightIcon={<AddIcon />}
                >Group Chat</Button>
            </Box>
            <Box
                mt={1}
                display={'flex'}
                flexDirection="column"
                p={3}
                bg="#F8F8F8"
                w={"100%"}
                h={"100%"}
                overflowY={'hidden'}
            >
                {chats ?
                    <Stack overflowY={"scroll"}>
                        {chats?.map((chat) => {
                            return (
                                <Box
                                    onClick={(e) => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Box>
                                        <Avatar src={!chat.isGroupChat ? getUser(loggedUser, chat.users).avatar : ''}></Avatar>
                                    </Box>
                                    <Text> {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</Text>
                                </Box>
                            );
                        })}
                    </Stack> : <Text>Loading ....</Text>}
            </Box>
        </Box>
    );
};

export default MyChats;