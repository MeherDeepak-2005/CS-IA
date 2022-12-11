import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {
    Flex,
    Heading,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    chakra,
    Box,
    Link,
    Avatar,
    FormControl,
    InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { type } = useParams();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [secretCode, setSecretCode] = useState()
    const [cookie, setCookie] = useCookies(['user'])




    const navigate = useNavigate();

    useEffect(() => {
        if (type === 'customer' && cookie.login === 'true') return navigate("/");
        if (type === 'employee' && cookie.employeeLogin === 'true') return navigate("/");
        console.log("SOMETHING IS UP")
    }, [])


    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (type === 'employee') {
            console.log("FOR EMPLOYEE")
            axios('http://127.0.0.1:5000/employee/login', {
                method: "POST",
                data: {
                    "email": email,
                    "password": password,
                    "secretCode": secretCode
                }
            })
                .then((res) => {
                    console.log(res.status);
                    if (res.status === 200) {
                        setCookie("employeeLogin", 'true')
                        setCookie("employeeId", res.data.employeeId)
                        navigate('/employee')
                    }
                })
                .catch((err) => {
                    alert(err);
                })
        }

        if (type === 'customer') {
            axios('http://127.0.0.1:5000/user/login', {
                method: "POST",
                data: {
                    "email": email,
                    "password": password
                }
            })
                .then((res) => { console.log(res.data); setCookie("login", true); setCookie("customerId", res.data.customerId); navigate("/") })
                .catch((err) => { console.log(err); })
        }
    }

    const handleShowClick = () => setShowPassword(!showPassword);

    return (
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
                    <form onSubmit={(e) => { handleFormSubmit(e) }}>
                        <Stack
                            spacing={4}
                            p="1rem"
                            backgroundColor="whiteAlpha.900"
                            boxShadow="md"
                        >
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={<CFaUserAlt color="gray.300" />}
                                    />
                                    <Input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="email address" />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement
                                        pointerEvents="none"
                                        color="gray.300"
                                        children={<CFaLock color="gray.300" />}
                                    />
                                    <Input
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                            {showPassword ? "Hide" : "Show"}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            {
                                (type === 'employee') ? <Input onChange={(e) => { setSecretCode(e.target.value); }} placeholder='Company Secret Code' type='password' /> : <></>
                            }
                            <Button
                                borderRadius={0}
                                type="submit"
                                variant="solid"
                                colorScheme="teal"
                                width="full"
                            >
                                Login
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
            <Box>
                New to us?{" "}
                <Link color="teal.500" href={`/signup/${type}`}>
                    Sign Up
                </Link>
            </Box>
        </Flex>
    );
};


