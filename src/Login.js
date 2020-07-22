import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import "./Login.css";
import { useHistory } from "react-router-dom";
export const auth = {
    isLoggedIn: false,
    token: ''
}

export default function Login() {
    const url = "http://localhost:4000/";
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        if(e.target.name == 'email') {
            setEmail(e.target.value);
        } else {
            setPassword(e.target.value)
        }
    }

    const submitForm = async () => {
        let error = validateForm({email, password});
        if(error && error.length) {
            return error
        }
        let response = await axios.post(`${url}login`, {email, password});
        if(response && response.data && response.data.success) {
            auth.isLoggedIn = true;
            auth.token = response.data.token;
            let encoded = window.btoa(response.data.user.email);
            let credentials = await axios.get(`${url}`);
            await axios.post(`${url}room`, {...credentials.data, email: response.data.user.email });
            history.push({ 
                pathname: `/room/${encoded}`,
                state: credentials.data
            });
        } else {
            console.log(response.data)
        }
    }

    return (
        <div className="Login">
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" onChange={e => onChange(e)}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={e => onChange(e)}/>
                </Form.Group>
                <Button variant="primary" type="button" onClick={submitForm}>Login</Button>
            </Form>
        </div>
    );
}