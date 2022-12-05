import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Uploader from './components/upload';
import Contact from './components/contact';
import { ChakraProvider } from '@chakra-ui/react';

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
