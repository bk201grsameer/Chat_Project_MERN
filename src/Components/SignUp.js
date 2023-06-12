import { FormLabel, Input, InputGroup, InputRightElement, Text, VStack } from '@chakra-ui/react';
import { Spinner } from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';
import {
    FormControl,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import ButtonHandler from './ButtonHandler';
import FormInput from './FormInput';
import axios from "axios";
import { UserState } from '../Context/UserProvider';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pic, setPic] = useState('');
    const { setUserInfo } = UserState();
    const navigate = useNavigate();

    const validate = () => {
        try {
            if (!name || !email || !password || !confirmPassword)
                throw new Error("ALL FIELDS REQUIRED");
            if (password !== confirmPassword)
                throw new Error("Password Doest match");
            return true;
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 2000);
        }
        return false;
    };

    const uploadImage = async (image) => {
        try {
            setLoading(true);
            if (image === undefined) {
                setError('PLEASE SELECT AN IMAGE');
                setLoading(false);
                return;
            }
            console.log(image.type);
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                const data = new FormData();
                data.append("file", image);
                data.append('upload_preset', "tttclone");
                data.append("cloud_name", "dugopwfxa");

                const res = await fetch("https://api.cloudinary.com/v1_1/dugopwfxa/image/upload", {
                    method: 'POST',
                    body: data
                });
                const result = await res.json();
                console.log(result.secure_url);
                setPic(result.secure_url);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log(error.message);
        }
    };

    const submit_Handler = async (e) => {
        try {
            if (!validate())
                return;
            setLoading(true);
            const postData = {
                name: name,
                email: email,
                password: password,
                pic: pic
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const { data } = await axios.post('http://localhost:5000/api/user/signup', postData, config);
            console.log(data);
            setLoading(false);
            if (data.sucess === false) {
                setError(data.message);
                setTimeout(() => {
                    setError('');
                }, 2000);
                setLoading(false);
                return;
            }
            if (data.sucess === true) {
                setUserInfo({ token: data.token, user: data.userInfo });
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
                navigate('/chatpage');
            }
        } catch (error) {
            setLoading(false);
        }
    };
    return (
        <VStack
            spacing={5}
            align='stretch'
            color={'black'}
        >
            {error && <Text
                textAlign={'center'}
                color='red'>{error}</Text>}
            <FormInput
                title={'Name'}
                isRequired={true}
                id='username'
                value={name}
                handleOnChange={setName}
            />
            <FormInput
                title={'Email'}
                isRequired={true}
                id='email'
                value={email}
                handleOnChange={setEmail}
            />
            <FormInput
                title={'password'}
                isRequired={true}
                id='password'
                value={password}
                type={'password'}
                handleOnChange={setPassword}
            />
            <FormInput
                title={'confirmPassword'}
                isRequired={true}
                id='confirmpassword'
                value={confirmPassword}
                type={'password'}
                handleOnChange={setConfirmPassword}
            />

            <FormControl id='pic'>
                <FormLabel><Badge colorScheme={'purple'}>Upload Your Profile</Badge></FormLabel>
                <InputGroup size='md'>
                    <Input
                        type={'file'}
                        p={1.5}
                        accept='image/*'
                        onChange={(e) => {
                            uploadImage(e.target.files[0]);
                        }}
                    />
                    <InputRightElement width='4.5rem'>
                        {loading && <Spinner />}
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <ButtonHandler title={'Sign Up'} handler={submit_Handler} loading={loading}
            />
        </VStack >
    );
};

export default SignUp;
