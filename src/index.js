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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: '/uploadProject',
    element: <Uploader />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/employee",
    element: <Employee />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
