import { Button } from '@chakra-ui/react';
import React from 'react';

const ButtonHandler = ({ title, handler, color = 'blue', loading = false }) => {
    return (
        <Button colorScheme={color}
            onClick={handler}
            variant='solid'
            width={'100%'}
            isLoading={loading}
        >{title}</Button>
    );
};

export default ButtonHandler;
