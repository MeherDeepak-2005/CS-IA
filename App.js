import React, { Component, useEffect, useState } from 'react'
import './App.css';
import axios from 'axios'

function App() {

  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [brochure, setBrochure] = useState();

  const handleFile = (e) => {

    e.preventDefault();

    console.log(brochure)

    const formdata = new FormData();

    formdata.append('image', image);
    formdata.append('name', name);
    formdata.append("brochure", this.state.brochure);

    fetch('http://127.0.0.1:5000/upload', {
      method: "POST",
      body: formdata,
    }).then((res) => alert(res.status))

    axios('http://127.0.0.1:5000/add', {
      method: "POST",
      data: {
        "name": name
      }
    })
  }


  const projects = [
      {"id": 72, "name": 'MR Project'},
      {"id": 80, "name": 'SC Project'}
    ];




  return (
      <div className="App" >

        {
          projects.map(project => (
                <h1 key={project.id}>{project.name}</h1>
          ))
        }

        <h1>THE FORM</h1>

        <form onSubmit={e => { this.handleFile(e) }}>

          <div>
            <input required placeholder='Project Name' name='projectName'
              onChange={(e) => setName(e.target.value)}
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
      </div >
    )
}

export default App;
