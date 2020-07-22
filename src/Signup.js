import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import "./Login.css";
import { useHistory } from "react-router-dom";

export default function Signup() {
    const url = "http://localhost:4000/";
    const [credentials, setCredentials] = useState({});
    const history = useHistory();

    function validateForm(params) {
        let error = [];
        for(let key in params) {
            if(params.hasOwnProperty(key) && params[key]) {
                
            } else {
                error.push(params[key])
            }
        }
        return error;
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const submitForm = async () => {
        let error = validateForm(credentials);
        if(error && error.length) {
            return error
        }
        // submit form
        let response = await axios.post(`${url}register`, credentials);
        if(response && response.data && response.data.success) {
            return history.push('/');
        }
        console.log(response)
    }

    return (
        <div className="Login">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" onChange={e => onChange(e)}/>
                </Form.Group>

                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" name="username" placeholder="Enter Username" onChange={e => onChange(e)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={e => onChange(e)}/>
                </Form.Group>
                <Button variant="primary" type="button" onClick={submitForm}>Signup</Button>
            </Form>
        </div>
    );
}