import { Box, Button, Divider, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';

import { FaDoorOpen, FaDoorClosed } from "react-icons/fa";

import { BellIcon, HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react';
import axios from 'axios';

import UserListItem from './UserListItem';

const SideDrawer = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = ChatState();
    const btnRef = React.useRef();
    console.log('getDerived', { selectedChat });
    const navigate = useNavigate();
    const { setUser } = ChatState();


    const handleSearch = async () => {
        if (!search)
            return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: user.token
                }
            };
            const { data } = await axios.get(`http://localhost:5000/api/user/getalluser/?search=${search}`, config);
            console.log({ data: data });
            if (data.sucess === true)
                setSearchResult(data.users);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error.message);
        }
    };

    // create the chat
    const accessChat = async (id) => {
        console.log(id);
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: user.token
                }
            };
            const { data } = await axios.post('http://localhost:5000/api/chat/accesschat', {
                userId: id
            }, config);
            console.log(data);
            setSelectedChat(data.chat);

            if (data.chat) {
                if (!(chats.find((c) => { return c._id === data.chat._id; })))
                    setChats((chats) => { return [...chats, data.chat]; });
            }

            setLoadingChat(false);

        } catch (error) {
            setLoadingChat(false);
        }
    };

    return (
        <>
            <Box

                display={'flex'}
                justifyContent='space-between'
                alignItems={'center'}
                bg='white'
                w='100%'
                p={'5px 10px 5px 10px'}
                borderWidth={'5px'}
            >
                <Tooltip hasArrow label='Search Users' bg='gray.800' padding={'5px 5px'}>
                    <Button colorScheme='black' variant='ghost'
                        size={'sm'}
                        border='1px'
                        borderColor='black'
                        padding={4}
                        ref={btnRef} onClick={onOpen}
                    >
                        <SearchIcon />
                        <Text
                            display={{ base: 'none', md: 'flex' }}
                        > Search User</Text>
                    </Button>
                </Tooltip>

                <Text
                    fontSize={{ base: 'xl', md: '3xl' }}
                >Naruto Chat App</Text>
                <div>
                    <Menu>
                        <MenuButton as={Button}
                            px={{ base: 2, md: 4 }}
                            py={{ base: 1, md: 2 }}
                            mr={2}
                            fontSize='sm'>
                            <BellIcon fontSize={{ base: 'lg', md: 'xl' }} />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        {({ isOpen }) => (
                            <>
                                <MenuButton isActive={isOpen} as={Button} rightIcon={<HamburgerIcon />}
                                    px={{ base: 2, md: 4 }}
                                    py={{ base: 1, md: 2 }}
                                    fontSize='sm'
                                >
                                    {isOpen ? <FaDoorOpen fontSize={{ base: 'lg', md: 'xl' }} /> : < FaDoorClosed fontSize={{ base: 'lg', md: 'xl' }} />}
                                </MenuButton>
                                <MenuList>
                                    <ProfileModal user={user} title={'Your Profile'} />
                                    <MenuDivider />
                                    <MenuItem onClick={(e) => {
                                        localStorage.removeItem('userInfo');
                                        setUser('');
                                        navigate('/');
                                        window.location.reload();
                                    }}>Log Out</MenuItem>
                                </MenuList>
                            </>
                        )}
                    </Menu>

                </div>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
                size={"xs"}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton
                        mt={2} />
                    <DrawerHeader>Search User </DrawerHeader>
                    <Divider />
                    <DrawerBody>
                        <Box display={'flex'}>
                            <Input mr={1}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); }}
                            />
                            <Button
                                onClick={() => { handleSearch(); }}
                                isLoading={loading}
                            >Search</Button>
                        </Box>
                        {/* to show the searched result */}
                        {loading ? <Spinner /> :
                            (searchResult?.map((e) => {
                                return <UserListItem key={e._id} handlerFunction={() => {
                                    accessChat(e._id);
                                }} user={e} />;
                            }))
                        }
                    </DrawerBody>

                    <DrawerFooter>
                        {loadingChat && <Text> Loading  Chat.....</Text>}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;