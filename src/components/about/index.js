import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'

function About() {
    return (
        <>
            <Box
                backgroundImage='https://raw.githubusercontent.com/MeherDeepak-2005/CS-IA/main/ppm-3.png'
                backgroundSize={'contain'}
                backgroundPosition='center'
                height='40vh'
                marginY='20px'
                backgroundRepeat={'no-repeat'}
                display='flex'
                alignItems={'center'}
            >
                <Heading backgroundColor='whitesmoke' fontWeight='400' margin='auto'>
                    About Us
                </Heading>

            </Box>
            <Text textAlign={'center'} maxW='80%'>
                We're PPM Industries. Moddagudu Type here
            </Text>
        </>
    )
}

export default About