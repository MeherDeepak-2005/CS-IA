import React, { useState } from 'react';
import axios from 'axios';

function Uploader() {
    const [name, setName] = useState();
    const [image, setImage] = useState();
    const [brochure, setBrochure] = useState();
    const [city, setCity] = useState();


    const handleFile = async (e) => {

        e.preventDefault();

        const formdata = new FormData();

        formdata.append('brochure', brochure);
        formdata.append('image', image)

        const res = await fetch('http://127.0.0.1:5000/upload', {
            method: "POST",
            body: formdata
        })
        let json = await res.json()

        const imageUrl = json.image_downloadURL;
        const brochureUrl = json.brochure_downloadURL;

        axios("http://127.0.0.1:5000/add/project", {
            method: "POST",
            data: {
                "name": name,
                "brochure": brochureUrl,
                "image": imageUrl,
                "city": city
            }
        }).then((res) => {
            if (res.status == 201) {
                // router.push("/")
            } else {
                alert("Something went wrong")
            }
        })
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
                    <label>Select image </label>
                    <input required type="file" name="image"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div>
                    <label>
                        Select Brochure
                    </label>
                    <input required type='file' name='brochure'
                        onChange={(e) => setBrochure(e.target.files[0])}
                    />
                </div>

                <button>Upload</button>

            </form>
        </>
    )
}

export default Uploader