import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";
import { registerRoute } from '../../utils/APIRoutes';
import "./register.css"
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const notify = (message) => {
    toast(message)
}

const Register = () => {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    useEffect(() => {
        if (localStorage.getItem("chat-app-user")) {
            navigate('/')
        }
    }, [])
    const handleSubmit = async (event) => {

        event.preventDefault();
        if (handleValidation()) {
            const { password, username, email } = values;
            const { data } = await axios.post(registerRoute, {
                username, email, password
            })
            if (data.status == false) {
                notify(data.msg)
            }
            if (data.status == true) {
                // localStorage.setItem("chat-app-user", JSON.stringify(data.user));
                navigate("/login")
            }
        }
    }
    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;

        if (password !== confirmPassword) {
            notify("password and confirm password should be same")
            return false;
        } else if (password == "" && confirmPassword == "") {
            notify("Password is not null")
            return false;
        } else if (email == "") {
            notify("Email is not null")
            return false;
        } else if (username == "") {
            notify("Username is not null")
            return false;
        }
        return true;
    }
    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })

    }
    return (
        <div className="register__container">
            <form onSubmit={(event) => handleSubmit(event)} className="register__form">
                <div className="title">
                    <h3>Chat App</h3>
                </div>
                <input type="text" name="username" id="" placeholder='username' onChange={(e) => handleChange(e)} />
                <input type="text" name="email" id="" placeholder='email' onChange={(e) => handleChange(e)} />
                <input type="password" name="password" id="" placeholder='password' onChange={(e) => handleChange(e)} />
                <input type="password" name="confirmPassword" id="" placeholder='confirm password' onChange={(e) => handleChange(e)} />
                <button type="submit">Create User</button>
                <span>
                    Already have an account ? <Link to="/login">Login.</Link>
                </span>
            </form>
        </div>
    )
}

export default Register