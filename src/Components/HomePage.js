import React, { useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Header from './Header';
import Login from './Login';
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (JSON.parse(localStorage.getItem('userInfo')))
            navigate('/chatpage');
    }, [navigate]);
    return (
        <Container
            maxW={'xl'}
            centerContent
        >
            <Header />
            <Box
                bg={'white'}
                w='100%'
                p={4}
                borderRadius="lg"
                borderWidth={'1px'}
                border='1px' borderColor='black.200'
                textColor={'black'}
            >
                <Tabs variant='soft-rounded' >
                    <TabList mb={"1em"}>
                        <Tab w='50%'>Login</Tab>
                        <Tab w='50%'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
};

export default HomePage;