import { Box } from '@chakra-ui/react';
import React from 'react';
import { ChatState } from '../Context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    console.log(`getDerived  chat box`, { selectedChat });
    return (
        <Box
            display={{ base: selectedChat ? "flex" : 'none', md: 'flex' }}
            alignItems="center"
            flexDir={"column"}
            p={3}
            bg="white"
            width={{ base: "100%", md: '68%' }}
            mt={2}
            ml={2}
            mb={2}
            mr={2}
            borderRadius={'lg'}
        >
            <SingleChat   fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default ChatBox;