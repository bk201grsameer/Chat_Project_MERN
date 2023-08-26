import { Box, Text } from '@chakra-ui/react';
import React from 'react';

const Header = () => {
    return (
        <Box
            display={'Flex'}
            justifyContent="center"
            p={3}
            bg={"white"}
            w="100%"
            m="30px 0px 15px 0"
            borderRadius={'lg'}
            borderWidth="1px"
            border='1px' borderColor='black.200'
        >
            <Text
                fontSize={'4xl'}
            >Naruto Chat App</Text>
        </Box>
    );
};

export default Header;
