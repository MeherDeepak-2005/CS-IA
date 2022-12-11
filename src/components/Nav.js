import React from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


function Nav() {
    const [cookie, setCookie] = useCookies(['user'])

    const navigate = useNavigate();
    return (
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
                    products
                </ul>
                <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
                    navigate("/contact")
                }}>
                    Contact us
                </ul>
            </ol>
            <ol style={{ display: 'flex', flexDirection: 'row' }}>
                {
                    (cookie.login === 'true') ? <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
                        navigate("/cart")
                    }}>
                        Cart
                    </ul> : <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
                        navigate("/login/customer")
                    }}>
                        Customer
                    </ul>
                }

                <ul style={{ marginRight: '15px', cursor: 'pointer' }} onClick={() => {
                    navigate("/employee")
                }}>
                    Employee
                </ul>
            </ol>
        </nav>
    )
}

export default Nav