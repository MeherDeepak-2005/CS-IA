import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { VStack } from '@chakra-ui/react';
import {
    Flex,
    Heading,
    Input,
    Button,
    Stack,
    Box,
    Link,
    Avatar,
} from "@chakra-ui/react";

function Signup() {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phone, setPhone] = useState();
    const [designation, setDesignation] = useState();
    const [secretCode, setSecretCode] = useState();
    const [cookie, setCookie] = useCookies(['user']);
    const navigate = useNavigate();

    const { type } = useParams();

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (type === 'customer') {

            axios('http://127.0.0.1:5000/user/new', {
                method: "POST",
                data: {
                    "name": name,
                    "email": email,
                    "password": password
                }
            })
                .then((res) => {
                    console.log(res.data);
                    setCookie("login", 'true')
                    setCookie("customerId", res.data.customerId)
                    navigate("/")
                }).catch((err) => { alert(err); })
        }

        if (type === 'employee') {
            axios('http://127.0.0.1:5000/employee/new', {
                method: "POST",
                data: {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "designation": designation,
                    "password": password,
                    "secretCode": secretCode
                }
            })
                .then((res) => {
                    console.log(res.data);
                    setCookie("employeeLogin", 'true')
                    setCookie("employeeId", res.data.employeeId)
                    navigate("/")
                }).catch((err) => { alert(err); })
        }
    }

    useEffect(() => {
        if (type === 'customer' && cookie.login === 'true') return navigate("/");
        if (type === 'employee' && cookie.employeeLogin === 'true') return navigate("/");

    }, [])

    return (
        <center>
            <Flex
                flexDirection="column"
                width="100wh"
                height="100vh"
                backgroundColor="gray.200"
                justifyContent="center"
                alignItems="center"
            >
                <Stack
                    flexDir="column"
                    mb="2"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Avatar bg="teal.500" />
                    <Heading color="teal.400">Welcome</Heading>
                    <Box minW={{ base: "90%", md: "468px" }}>
                        <form onSubmit={(e) => { handleFormSubmit(e); }} style={{ maxWidth: "20rem" }}>
                            <VStack spacing={4}>
                                <Input name='name' value={name} required placeholder='Name' onChange={(e) => { setName(e.target.value); }} />
                                <Input name='email' placeholder='Email' required value={email} onChange={(e) => { setEmail(e.target.value); }} />
                                {
                                    (type === 'employee') ? <>
                                        <Input name='phone' placeholder='Phone' required value={phone} onChange={(e) => { setPhone(e.target.value); }} />
                                        <Input name='designation' placeholder='designation' required value={designation} onChange={(e) => { setDesignation(e.target.value); }} />
                                        <Input placeholder='Company Secret Code' type='password' name='company secret code' required value={secretCode} onChange={(e) => { setSecretCode(e.target.value); }} />
                                    </> : <></>
                                }
                                <Input placeholder='Passsword' type='password' name='password' required value={password} onChange={(e) => { setPassword(e.target.value); }} />
                                <Button
                                    borderRadius={0}
                                    type="submit"
                                    variant="solid"
                                    colorScheme="teal"
                                    width="full"
                                >
                                    Signup
                                </Button>
                            </VStack>
                        </form>
                    </Box>
                </Stack>
                <Box>
                    Already have an account?
                    <Link color="teal.500" href="/signup">
                        Login
                    </Link>
                </Box>
            </Flex>
        </center>
    )
}

export default Signup