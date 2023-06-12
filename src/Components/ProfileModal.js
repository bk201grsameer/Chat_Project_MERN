import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Box,
    Text,
    Avatar,
} from '@chakra-ui/react';
import { Card, CardBody, } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';

function BasicUsage({ user, title = '' }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}
                size='sm'
                border="none"
                background={'white'}
                width="100%"
                textAlign={'center'}
            // padding={}
            >
                <Box
                    width='100%' textAlign={'left'}
                    fontSize={'md'}
                    display='flex'
                    justifyContent={'space-between'}
                    alignItems="center">
                    {title} <Avatar name={user.name} src={user.avatar} size={'sm'} />
                </Box>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size={'xs'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color='#fc9090'>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Card>
                            <CardBody>
                                <Box>
                                    <Box textAlign={'center'} w='100%'>
                                        <Avatar name={user.name} src={user.avatar} size={'lg'} />
                                    </Box>
                                    <Text textAlign={'center'} fontSize='xl' width={'100%'}>{user.email}</Text>
                                </Box>
                            </CardBody>
                        </Card>
                    </ModalBody>

                    <ModalFooter>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

const ProfileModal = ({ user, title }) => {
    return (
        <BasicUsage user={user} title={title} />
    );
};

export default ProfileModal;