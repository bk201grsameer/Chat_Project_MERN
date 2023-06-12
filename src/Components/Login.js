import { Box, Button, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketState } from '../Context/SocketProvider';
import { UserState } from '../Context/UserProvider';
import ButtonHandler from './ButtonHandler';
import FormInput from './FormInput';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUserInfo } = UserState();
    const navigate = useNavigate();
    const { socket } = SocketState();
    const validate = () => {
        try {
            if (!email || !password)
                throw new Error("ALL FIELDS REQUIRED");
            return true;
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 2000);
        }
        return false;
    };

    const submit_Handler = async (e) => {
        try {
            if (!validate())
                return;
            setLoading(true);
            const postData = {
                email: email,
                password: password,
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const { data } = await axios.post('http://localhost:5000/api/user/login', postData, config);
            console.log(data);
            if (data.sucess === false) {
                setError(data.message);
                setTimeout(() => {
                    setError('');
                }, 2000);
                setLoading(false);
                return;
            }
            setLoading(false);
            if (data.sucess === true) {
                setUserInfo({ token: data.token, user: data.userInfo });
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
                socket.emit('newUser', { userName: data.userInfo.name, socketID: socket.id });
                navigate('/chatpage');
            }
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <>
            <VStack
                spacing={5}
                align='stretch'
                color={'black'}
            >
                {error && <Text
                    textAlign={'center'}
                    color='red'>{error}</Text>}
                <FormInput
                    title={'Email'}
                    isRequired={true}
                    id='emailLogin'
                    value={email}
                    handleOnChange={setEmail}
                />
                <FormInput
                    title={'password'}
                    isRequired={true}
                    id='passwordLogin'
                    value={password}
                    type={'password'}
                    handleOnChange={setPassword}
                />
                <Box>
                    <ButtonHandler title={'Sign In'} handler={submit_Handler} loading={loading} />
                    <Button colorScheme={'red'}
                        width='100%'
                        marginTop={'8px'}>Submit</Button>
                </Box>
            </VStack >
        </>
    );
};

export default Login;
