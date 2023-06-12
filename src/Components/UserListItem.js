import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

const UserListItem = ({ user, handlerFunction }) => {
    return (
        <>
            <Box
                onClick={handlerFunction}
                cursor="pointer"
                bg="#E8E8E8"
                _hover={{
                    background: "#38B2AC",
                    color: "white",
                }}
                w="100%"
                d="flex"
                alignItems="center"
                color="black"
                margin={'5px 0px 5px 0px'}
                px={3}
                py={1}
                mb={2}
                borderRadius="lg"
            >
                <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={user.name}
                    src={user.avatar}
                />
                <Box>
                    <Text>{user.name}</Text>
                    <Text fontSize="xs">
                        <b>Email : </b>
                        {user.email}
                    </Text>
                </Box>
            </Box>
        </>
        // <Text onClick={handlerFunction}>{user.name}</Text>
        // <Text onClick={(e) => { handlerFunction(); }}>{user.name}</Text>
    );
};

export default UserListItem;