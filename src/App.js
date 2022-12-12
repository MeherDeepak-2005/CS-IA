import React, { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios'

function App() {

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
    <div className="App" >
      <div style={{
        height: '50vh', display: "flex", alignItems: "center",
        backgroundPosition: "center",
        backgroundSize: 'cover',
        backgroundImage: "url(https://raw.githubusercontent.com/MeherDeepak-2005/CS-IA/main/ppm-2.png)"
      }}>

        <h1 style={{ textAlign: 'center', margin: 'auto', color: "#353333", backgroundColor: "whitesmoke", opacity: '0.8', fontSize: "48px", textTransform: 'uppercase', fontFamily: "Fira Sans" }}>
          Sai Constructions
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: "column", width: 'fit-content', margin: 'auto', padding: '1em', paddingTop: '0' }}>
        <h2 style={{ textAlign: "center", fontFamily: 'Fira Sans', fontSize: '35px' }}>
          Our Products
        </h2>
        <button style={{ background: "#FAF089", border: 'none', padding: '10px' }}>
          Know more &rarr;
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", flexWrap: "wrap", flexBasis: "150px" }}>
        {
          products.map(product => (
            <div key={product[0]} style={{ padding: "1em", textAlign: "center", backgroundColor: "whitesmoke", width: "fit-content", margin: '10px' }}>
              <h1 style={{ fontFamily: "cursive", fontWeight: "200", fontSize: '30px' }}>{product[1]}</h1>
              <h3 style={{ fontWeight: "400" }}>{product[2]}</h3>
              <div style={{ 'overflow': 'hidden', 'width': '20rem', height: "15rem", display: 'flex', alignItems: "center", justifyContent: "center" }}>
                <img style={{ 'position': 'absolute', zIndex: '0', width: "20rem", height: "12rem" }} src={`http://127.0.0.1:5000${product[3]}`} alt='product photos' />
                <a target='_blank' rel='noreferrer' href={`/products/${product[0]}`} style={{ 'zIndex': '1', margin: 'auto' }}>
                  <button style={{ background: "#FAF089", border: 'none', padding: '0.5em', borderRadius: '10px' }}>More Information</button>
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
