import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Uploader from './components/upload';
import Contact from './components/contact';
import { ChakraProvider } from '@chakra-ui/react';
import About from './components/about';
import Employee from './components/employee';
import Cart from './components/cart';
import { CookiesProvider } from 'react-cookie';
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import Nav from './components/Nav';
import Product from './components/products/product';

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
      <Nav />
      <App />
    </>,
  },
  {
    path: '/uploadProject',
    element: <>
      <Nav />
      <Uploader />
    </>,
  },
  {
    path: '/contact',
    element: <>
      <Nav />
      <Contact />
    </>,
  },
  {
    path: "/about",
    element: <>
      <Nav />
      <About />
    </>,
  },
  {
    path: "/employee",
    element: <>
      <Nav />
      <Employee />
    </>,
  },
  {
    path: "/cart",
    element: <>
      <Nav />
      <Cart />
    </>,
  }, {
    path: "/login/:type",
    element: <>
      <Nav />
      <Login />
    </>,
  }, {
    path: '/signup/:type',
    element: <>
      <Nav />
      <Signup />
    </>,
  }, {
    path: "/products/:productId",
    element: <>
      <Nav />
      <Product />
    </>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </CookiesProvider>
);
