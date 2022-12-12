import {
    Box,
    Flex,
    Heading,
    HStack,
    Link,
    Stack,
    Text,
    useColorModeValue as mode,
    Button,
    Image,
    VStack,
    Select
} from '@chakra-ui/react'
import axios from 'axios'
import * as React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'


function Card({ productId, name, image, price }) {
    const [makeQuantity, setQuantities] = useState([]);
    const [quantity, setQuantity] = useState(0);

    const [cookie, setCookie] = useCookies(['user']);

    const currentPrice = localStorage.getItem("totalPrice")

    localStorage.setItem("totalPrice", parseInt(currentPrice) + (quantity * price));

    console.log(currentPrice)


    const removeItem = () => {
        axios(`http://127.0.0.1:5000/delete/cart/${productId}`, {
            method: "POST",
            data: {
                "customerId": cookie.customerId
            }
        }).then((res) => { window.location.reload(); }).catch((err) => { console.log(err); })
    }

    useEffect(() => {
        for (let i = 0; i < 11; i++) {
            makeQuantity.push(i)
            setQuantities([...makeQuantity]);
        }
    }, [])
    return (
        <HStack width='100%' justifyContent={'space-evenly'}>
            <HStack alignItems='flex-start'>
                <Image src={`http://127.0.0.1:5000/${image}`} height='7rem' width='10rem' />
                <VStack alignItems={'flex-start'} paddingX='10px' paddingY='20px'>
                    <Heading fontWeight={'400'} as='h5' fontSize='xl'>{name}</Heading>
                    <Text>Description</Text>
                </VStack>
            </HStack>
            <Select maxW='64px' onChange={(e) => { setQuantity(e.target.value); console.log(e.target.value) }}>
                {
                    makeQuantity.map((quan) => {
                        return <option key={quan} value={quan} >{quan}</option>
                    })
                }
            </Select>
            <Text>{formatPrice(price)}</Text>
            <Text>
                ₹ {quantity * price}
            </Text>
            <Button onClick={() => { removeItem() }}>
                <Text fontSize='xl' fontWeight={'400'}>
                    &times;
                </Text>
            </Button>
        </HStack>
    )
}

const OrderSummaryItem = (props) => {
    const { label, value, children } = props
    return (
        <Flex justify="space-between" fontSize="sm">
            <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
                {label}
            </Text>
            {value ? <Text fontWeight="medium">{value}</Text> : children}
        </Flex>
    )
}


export function formatPrice(value, opts) {
    const formatter = new Intl.NumberFormat('en-IN', {
        currency: "INR",
        style: 'currency',
        maximumFractionDigits: 2,
    })
    return formatter.format(value)
}

export default function Cart() {
    const [cookie, setCookie] = useCookies(['user']);

    const [cartItems, setCartItems] = useState([]);

    const [totalPrice, setTotalPrice] = useState(localStorage.getItem("totalPrice"))
    const [gotPrice, setGotPrice] = useState(false);

    console.log(cookie.customerId);

    localStorage.setItem("totalPrice", 0)

    const getPrice = () => {
        const res = localStorage.getItem("totalPrice")
        setGotPrice(true);
        return res;
    }

    const navigate = useNavigate();


    useEffect(() => {
        axios("http://127.0.0.1:5000/get/cart", {
            method: "POST",
            data: {
                "customerId": cookie.customerId
            }
        }).then((res) => { console.log(res.data); setCartItems(res.data.cart); });

    }, [])

    return (
        <Box
            maxW={{ base: '3xl', lg: '7xl' }}
            mx="auto"
            px={{ base: '4', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '12' }}
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                align={{ lg: 'flex-start' }}
                spacing={{ base: '8', md: '16' }}
            >
                <Stack spacing={{ base: '8', md: '10' }} flex="2">
                    <Heading fontSize="2xl" fontWeight="extrabold">
                        Shopping Cart ({cartItems.length} items)
                    </Heading>

                    <Stack spacing="6">
                        {cartItems.map((item) => (
                            <Card key={item[0]} productId={item[0]} name={item[1]} price={item[2]} image={item[3]} />
                        ))}
                    </Stack>
                </Stack>

                <Flex direction="column" align="center" flex="1">
                    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
                        <Heading size="md">Order Summary</Heading>

                        <Stack spacing="6">
                            <OrderSummaryItem label="Subtotal" value={formatPrice(597)} />
                            <OrderSummaryItem label="Shipping + Tax">
                                <Link href="#" textDecor="underline">
                                    Calculate shipping
                                </Link>
                            </OrderSummaryItem>
                            <OrderSummaryItem label="Coupon Code">
                                <Link href="#" textDecor="underline">
                                    Add coupon code
                                </Link>
                            </OrderSummaryItem>
                            <Flex justify="space-between">
                                <Text fontSize="lg" fontWeight="semibold">
                                    Total
                                </Text>
                                <Text fontSize="xl" fontWeight="extrabold">
                                    {
                                        (gotPrice) ? <>{formatPrice(totalPrice)}</> : <Button onClick={() => { getPrice() }}>
                                            Calculate
                                        </Button>

                                    }
                                </Text>
                            </Flex>
                        </Stack>
                        <Button onClick={() => { navigate("/") }} colorScheme="blue" size="lg" fontSize="md" rightIcon={<FaArrowRight />}>
                            Checkout
                        </Button>
                    </Stack>
                    <HStack mt="6" fontWeight="semibold">
                        <p>or</p>
                        <Link color={mode('blue.500', 'blue.200')}>Continue shopping</Link>
                    </HStack>
                </Flex>
            </Stack>
        </Box>
    )
}