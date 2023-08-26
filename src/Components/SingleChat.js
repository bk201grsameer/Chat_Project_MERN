import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { getUser } from '../Config/ChatLogics';
import { Badge } from '@chakra-ui/react';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import { SocketState } from '../Context/SocketProvider';
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const { user, selectedChat, setSelectedChat } = ChatState();
    const { socket } = SocketState();
    const [isTyping, setIsTyping] = useState(false);
    const lastMessageRef = useRef(null);
    console.log('get derived SingleChat', { user, selectedChat, messages, newMessage });
    //send message handler
    const sendMessage = async (e) => {
        try {
            if (e.key === 'Enter' && newMessage) {
                const config = {
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: user.token
                    }
                };
                const { data } = await axios.post('http://localhost:5000/api/message/sendmessage', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);
                console.log(data.message[0]);
                setNewMessage('');

                socket.emit('newMessage', { msg: data.message[0] });
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const eventListener = (data) => {
            console.log(data);
            if (selectedChat._id === data.msg.chat._id)
                setMessages((messages) => { return [...messages, data.msg]; });
        };
        socket.on('newMessageResponse', eventListener);

        const typingListener = (data) => {
            console.log(data);
            setIsTyping(data.typing);
        };

        socket.on('typing..', typingListener);
        return () => {
            socket.off('newMessageResponse', eventListener);
            socket.off('typing..', typingListener);
        };
    }, [socket, messages]);

    // typing handler
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (e.target.value === "")
            socket.emit('typing..', ({ to: getUser(user, selectedChat.users)._id, typing: false }));

        else
            socket.emit('typing..', ({ to: getUser(user, selectedChat.users)._id, typing: true }));
        // future typing indicator logic
    };

    //will fetch messages
    const fetchMessages = async () => {
        if (!selectedChat)
            return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: user.token
                }
            };
            const { data } = await axios.get(` http://localhost:5000/api/message/${selectedChat._id}`, config);
            console.log(data);
            setMessages(data.messages);
            setLoading(false);
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);





    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (
        <>
            {selectedChat ?
                <>
                    <Box
                        width='100%'
                        display={'flex'}>
                        <IconButton
                            mt={2}
                            display={{ base: 'flex', md: 'flex' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => { setSelectedChat(''); }}
                        />
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            pb={3}
                            px={2}
                            width='100%'
                            textAlign={'center'}
                        >
                            <Badge colorScheme='purple' fontSize={{ base: '20px', md: '25px' }} borderRadius={"lg"}>{getUser(user, selectedChat.users).name}</Badge>
                        </Text>
                        <Box
                            display={'flex'}
                            justifyContent='center'
                            alignItems={'center'}>
                            <ProfileModal user={getUser(user, selectedChat.users)} />
                        </Box>
                    </Box>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? <Spinner size={'xl'}
                            w={20}
                            h={20}
                            alignSelf='center'
                            margin={"auto"}
                        /> : <div className='messages'>
                            <ScrollableChat messages={messages} lastMessageRef={lastMessageRef} />
                        </div>}
                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired={true}
                            mt={3}
                        >
                            {isTyping && <h3 style={{ marginLeft: '5px', marginBottom: '3px' }}>Typing...</h3>}
                            <Input
                                variant={'filled'}
                                bg="#E0E0E0"
                                onChange={typingHandler}
                                value={newMessage}
                            ></Input>
                        </FormControl>
                    </Box>
                </>
                : <Box
                    display={'flex'}
                    alignItems='center'
                    justifyContent={'center'}
                    height='100%'
                ><Text>Select User To Start Chatting </Text>
                </Box>}
        </>
    );
};

export default SingleChat;;