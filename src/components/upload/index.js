import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Uploader() {
    const [name, setName] = useState();
    const [images, setImages] = useState([])
    const [price, setPrice] = useState();
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const formdata = new FormData();


    const handleImageUpload = (e) => {
        images.push(e.target.files[0]);
        setImages([...images])
    }

    const handleFile = async (e) => {

        e.preventDefault();

        formdata.append('name', name)
        formdata.append("price", price)
        images.map((image) => {
            formdata.append(image.name, image);
            return null;
        })
        for (const value of formdata.values()) {
            console.log(value);
        }

        const addProduct = await axios('http://127.0.0.1:5000/add/product', {
            method: "POST",
            data: {
                "name": name,
                "price": price
            }
        }).catch((err) => {
            setErrors([{ "code": 1, 'text': 'Service currently not available. Please try again later' }]);
        })

        const productId = await addProduct.data[0];

        const res = await fetch(`http://127.0.0.1:5000/upload/${productId}`, {
            method: "POST",
            body: formdata
        })

        if (res.status === 201) {
            navigate('/')
        } else {
            setErrors([{ 'code': 2, 'text': "Something went wrong. Please try again" }])
            console.log(errors)
        }
    }
    return (
        <>
            <h1>THE FORM</h1>

            <form onSubmit={e => { handleFile(e) }}>

                <div>
                    <input required value={name} placeholder='Project Name' name='projectName'
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <input required placeholder='Price' name='price' value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="">
                    <label>Images</label>
                    <p>You can choose multiple images</p>
                    <p>You have chosen {images.length} images</p>
                    <input required type="file" name="image"
                        onChange={(e) => handleImageUpload(e)}
                    />
                </div>
                {
                    errors.map((message) => (
                        <div key={message.code}>
                            <p style={{ color: 'red' }}>{message.text}</p>
                        </div>
                    ))
                }
                <button>Upload</button>

            </form>
        </>
    )
}

export default Uploader