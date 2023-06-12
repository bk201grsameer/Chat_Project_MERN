import { Badge, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';

const FormInput = ({ title, isRequired, id, handleOnChange, value, type = 'text' }) => {
    return (
        <FormControl id={id} isRequired={isRequired}>
            <FormLabel>
                <Badge padding={1} paddingLeft={2} paddingRight={2} borderRadius='md' colorScheme={'purple'} color='black'>
                    {title}
                </Badge>
            </FormLabel>
            <Input
                type={type}
                value={value}
                placeholder={`Enter Your ${title}`}
                onChange={(e) => { handleOnChange(e.target.value); }}
            />
        </FormControl>
    );
};

export default FormInput;
