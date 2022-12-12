import { Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // get products from Backend REST API
        const fetchproducts = () => {
            axios('http://127.0.0.1:5000/get/products', {
                method: "GET"
            }).then((res) => {
                if (res.status === 200) {
                    console.log(res.data)
                    setProducts(res.data)
                } else {
                    alert("Data couldn't be fetched")
                }
            });
        }
        fetchproducts();
    }, [])
    return (
        <>
            <Heading textAlign={'center'} fontWeight='400' marginY='20px'>
                Our Products
            </Heading>
            {
                products.map(product => (
                    <div key={product[0]} style={{ padding: "1em", textAlign: "center", backgroundColor: "whitesmoke", width: "fit-content", margin: '10px' }}>
                        <h1 style={{ fontFamily: "cursive", fontWeight: "200", fontSize: '30px' }}>{product[1]}</h1>
                        <h3 style={{ fontWeight: "400" }}>{product[2]}</h3>
                        <div style={{ 'overflow': 'hidden', 'width': '20rem', height: "15rem", display: 'flex', alignItems: "center", justifyContent: "center" }}>
                            <img style={{ 'position': 'absolute', zIndex: '0', width: "20rem", height: "12rem" }} src={`http://127.0.0.1:5000/${product[3]}`} alt='product photos' />
                            <a target='_blank' rel='noreferrer' href={`/products/${product[0]}`} style={{ 'zIndex': '1', margin: 'auto' }}>
                                <button style={{ background: "#FAF089", border: 'none', padding: '0.5em', borderRadius: '10px' }}>More Information</button>
                            </a>
                        </div>
                    </div>

                ))
            }
        </>
    )
}

export default Products