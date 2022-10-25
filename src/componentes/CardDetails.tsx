import React, { ReactNode } from 'react';
import { IconProps } from 'phosphor-react-native';
import { VStack, HStack, Text, Box, useTheme } from 'native-base';

type Props ={
    title: string;
    cpf?: string;
    description?: string;
    pressao?: string;
    saturacao?: string;
    frequencia?: string;
    temperatura?: string;
    footer?: string;
    icon: React.ElementType<IconProps>;
    children?: ReactNode;
}

export function CardDetails({
    title,
    cpf,
    description,
    pressao,
    saturacao,
    frequencia,
    temperatura,
    footer = null,
    icon: Icon,
    children
}: Props) {
    const {colors} =useTheme();

    return (
        <VStack bg="gray.600" p={5} rounded="sm" mt={2}>
            <HStack alignItems="center" mb={4}>
                <Icon color={colors.primary[700]}/>
                <Text ml={2} color="gray.300" fontSize="sm" textTransform="uppercase">
                    {title}
                </Text>
                {
                    !!cpf&&
                    <Text ml={2} color="gray.300" fontSize="sm" >
                        CPF: {cpf}
                    </Text> 
                }               
            </HStack>

            {
                !!description && 
                <Text color="gray.300" fontSize="md">
                    { description }
                </Text>
            }            
            <Box borderTopWidth={1} borderTopColor="gray.400" mt={3}>
                <HStack>
                    <Text ml={0} color="gray.300" fontSize="sm" textTransform="uppercase">
                        {pressao}
                    </Text>
                    <Text ml={2} color="gray.300" fontSize="sm" textTransform="uppercase">
                        {saturacao}
                    </Text>
                    <Text ml={2} color="gray.300" fontSize="sm" textTransform="uppercase">
                        {frequencia}
                    </Text>
                    <Text ml={2} color="gray.300" fontSize="sm" textTransform="uppercase">
                        {temperatura}
                    </Text>
                </HStack>
            </Box>
            {children}
            {
                !!footer && 
                <Box borderTopWidth={1} borderTopColor="gray.400" mt={3}>
                    <Text mt={3} color="gray.300" fontSize="sm">
                        {footer}
                    </Text>
                </Box>
            }

        </VStack>
    );
}