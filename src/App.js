import React, { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function App() {

  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios('http://127.0.0.1:5000/fetch/projects', {
      method: "GET",
      headers: {
        'Accept': "application/json"
      }
    }).then((res) => {
      if (res.status == 200) {
        console.log(res.data)
        setProjects(res.data)
      } else {
        alert("Data couldn't be fetched")
      }
    })
  }, [])

  return (
    <div className="App" >
      <nav style={{ display: 'flex', justifyContent: "space-around", position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '100', padding: '10px' }}>
        <ol style={{ display: 'flex', flexDirection: 'row', width: 'fit-content' }}>
          <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
            navigate("/")
          }}>
            Home
          </ul>
          <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
            navigate("/about")
          }}>
            About us
          </ul>
          <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
            navigate("/contact")
          }}>
            Projects
          </ul>
          <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
            navigate("/contact")
          }}>
            Contact us
          </ul>
        </ol>
        <ol style={{ display: 'flex', flexDirection: 'row' }}>
          <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
            navigate("/contact")
          }}>
            Customer
          </ul>
          <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
            navigate("/employee")
          }}>
            Employee
          </ul>
        </ol>
      </nav>
      <div style={{
        height: '50vh', display: "flex", alignItems: "center",
        backgroundPosition: "center",
        backgroundSize: 'cover',
        backgroundImage: "url(https://cdn.discordapp.com/attachments/903863587343314975/1048934034723569664/Modified-Elevation_mutthangi.jpg)"
      }}>

        <h1 style={{ textAlign: 'center', margin: 'auto', color: "#353333", backgroundColor: "whitesmoke", opacity: '0.8', fontSize: "48px", textTransform: 'uppercase', fontFamily: "Fira Sans" }}>
          Sai Constructions
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: "column", width: 'fit-content', margin: 'auto', padding: '1em', paddingTop: '0' }}>
        <h2 style={{ textAlign: "center", fontFamily: 'Fira Sans', fontSize: '35px' }}>
          Our Projects
        </h2>
        <button style={{ background: "#FAF089", border: 'none', padding: '10px' }}>
          Know more &rarr;
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", flexWrap: "wrap" }}>
        {
          projects.map(project => (
            <div key={project[0]} style={{ padding: "1em", textAlign: "center", backgroundColor: "whitesmoke", width: "fit-content" }}>
              <h1 style={{ fontFamily: "cursive", fontWeight: "200", fontSize: '30px' }}>{project[2]}</h1>
              <h3 style={{ fontWeight: "400" }}>{project[1]}</h3>
              <div style={{ 'overflow': 'hidden', 'width': '20rem', height: "15rem", display: 'flex', alignItems: "center", justifyContent: "center" }}>
                <img style={{ 'height': '10rem', 'position': 'absolute', zIndex: '0', width: "20rem", height: "12rem" }} src={project[4]} />
                <a target='_blank' href={project[5]} style={{ 'zIndex': '1', margin: 'auto' }}>
                  <button style={{ background: "#FAF089", border: 'none', padding: '0.5em', borderRadius: '10px' }}>View Brochure</button>
                </a>
              </div>
            </div>

          ))
        }
      </div>
    </div >
  )
}

export default App;
