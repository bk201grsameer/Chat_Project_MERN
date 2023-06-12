import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({ messages, lastMessageRef }) => {
    const { user } = ChatState();
    console.log('getderived scrollable chat', { user });
    return <Box
        overflowY={'scroll'}
        height={'100%'}
        display={'flex'}
        flexDir={'column'}
        padding={'10px 10px'}
    >
        {messages && messages.map((message, idx) => {
            return <Box
                padding={'5px 5px'}
                width={'50%'}
                borderRadius={'xl'}
                margin={'5px 0px 5px 0px'}
                key={idx}
                bg={'white'}
                marginLeft={user.name === message.sender.name ? 'auto' : '0px'}
            >
                <Text >{message.content}</Text>
            </Box>;
        })}
        <div ref={lastMessageRef} />
    </Box>;
};

export default ScrollableChat;