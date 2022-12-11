import { Button, Center, Heading, HStack, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom'

function Product() {
    const { productId } = useParams();
    const [product, setProduct] = useState();

    const [cookies, setCookies] = useCookies();


    useEffect(() => {
        axios(`http://127.0.0.1:5000/get/product/${productId}`, {
            method: "GET"
        }).then((res) => {
            console.log(res.data);
            setProduct(res.data);
        })
    }, []);

    const addtoCart = () => {
        axios(`http://127.0.0.1:5000/add/cart/${product.id}`, {
            method: "POST",
            data: {
                "customerId": cookies.customerId
            }
        }).then((res) => { console.log(res.status); }).catch((err) => { console.log(err); })
    }

    return (
        <>
            <Heading textAlign={'center'} fontWeight={'300'}>
                {product?.name}
            </Heading>
            <HStack maxW={'80vw'} margin='auto' marginTop='1.5rem' flexWrap={'wrap'} justifyContent='space-evenly'>
                {
                    product?.images?.map((image) => {
                        return <Image height='50vh' src={`http://127.0.0.1:5000/${image}`} />
                    })
                }
            </HStack>
            <Text maxW='80vw' margin='auto' marginTop='1.5rem'>
                Puma SE, branded as Puma, is a German multinational corporation that designs and manufactures athletic and casual footwear, apparel and accessories, which is headquartered in Herzogenaurach, Bavaria, Germany. Puma is the third largest sportswear manufacturer in the world.[5] The company was founded in 1948 by Rudolf Dassler. In 1924, Rudolf and his brother Adolf "Adi" Dassler had jointly formed the company Gebrüder Dassler Schuhfabrik (Dassler Brothers Shoe Factory). The relationship between the two brothers deteriorated until the two agreed to split in 1948, forming two separate entities, Adidas and Puma.

                Following the split, Rudolf originally registered the newly established company as Ruda (derived from Rudolf Dassler, as Adidas was based on Adi Dassler), but later changed the name to Puma.[6] Puma's earliest logo consisted of a square and beast jumping through a D, which was registered, along with the company's name, in 1948. Puma's shoe and clothing designs feature the Puma logo and the distinctive "Formstrip" which was introduced in 1958.[7]
            </Text>
            <Center marginTop={'20px'}>
                <Button onClick={() => { addtoCart() }}>
                    Add to cart
                </Button>
            </Center>

        </>
    )
}

export default Product