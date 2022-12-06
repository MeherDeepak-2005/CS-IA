import { Heading, Text } from '@chakra-ui/react';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Employee() {

    const [queries, setQueries] = useState([]);


    useEffect(() => {

        axios('http://127.0.0.1:5000/fetch/queries')
            .then((res) => {
                setQueries(res.data);
                console.log(res.data);
            })

    }, [])
    return (
        <div>
            <Heading fontWeight={'400'}>
                Queries
            </Heading>
            {
                queries.map((query) => (
                    <>
                        <Heading as='h3'>
                            {query[2]}
                        </Heading>
                        <Text as='span' textDecoration={"underline"}>
                            {query[0]}
                        </Text>
                        <Text as='p'>
                            {query[3]}
                        </Text>
                        <Text key={query[4]}>
                            {query[1]}
                        </Text>
                    </>
                ))
            }
        </div>
    )
}

export default Employee