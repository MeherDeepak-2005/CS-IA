import React, { useState } from 'react';
import axios from 'axios';

function Uploader() {
    const [name, setName] = useState();
    const [images, setImages] = useState([])
    const [brochure, setBrochure] = useState();
    const [city, setCity] = useState();

    const formdata = new FormData();


    const handleImageUpload = (e) => {
        images.push(e.target.files[0].name);
        formdata.append(e.target.files[0].name, e.target.files[0])
        setImages([...images])
    }

    const handleFile = async (e) => {

        e.preventDefault();

        console.log(formdata)
        formdata.append('name', name)
        formdata.append("city", city)

        const res = await fetch('http://127.0.0.1:5000/upload', {
            method: "POST",
            body: formdata
        })
        let json = await res.json()

        console.log(json)


    }
    return (
        <>
            <h1>THE FORM</h1>

            <form onSubmit={e => { handleFile(e) }}>

                <div>
                    <input required placeholder='Project Name' name='projectName'
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <input required placeholder='City' name='city'
                        onChange={(e) => setCity(e.target.value)}
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


                <button>Upload</button>

            </form>
        </>
    )
}

export default Uploader