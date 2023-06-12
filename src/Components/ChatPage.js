import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { SocketState } from '../Context/SocketProvider';
import ChatBox from './ChatBox';
import MyChats from './MyChats';
import SideDrawer from './SideDrawer';

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);
    const { socket } = SocketState();

    //logged in users
    useEffect(() => {
        //will not handle reload
        const eventListener = (data) => {
            console.log({ users: data });
        };
        socket.on('newUserResponse', eventListener);
        return () => {
            //clean up
            socket.off('newUserResponse', eventListener);
        };
    }, [socket]);
    return (
        <div
            style={{ width: "100%" }}>
            {user && <SideDrawer />}

            <Box
                border={'1px solid black'}
                display="flex"
                justifyContent={'space-between'}
                w='100%'
                h={'92vh'}
            >
                {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>

        </div>
    );
};

export default ChatPage;