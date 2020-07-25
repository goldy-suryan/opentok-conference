import React from 'react';
import { NavItem, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function MenuBar() {
    return (
        <Navbar bg="light" expand="lg">
            <Link to="/"><Navbar.Brand>Conference</Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <NavItem style={{'marginRight': '10px'}}>
                        <Link to="/">Login</Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/signup">Sign up</Link>
                    </NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}