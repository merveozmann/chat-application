import React, { useEffect ,useState} from 'react'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { loginRoute } from '../../utils/APIRoutes';
import "./login.css";
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const notify = (message) => {
  toast(message)
}
const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  })
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate('/')
    }
  }, [])
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username, } = values;
      const { data } = await axios.post(loginRoute, {
        username, password
      })
      if (data.status == false) {
        notify(data.msg)
      }
      if (data.status == true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  }
  const handleValidation = () => {
    const { password, username } = values;
    if (password === "") {
      notify("Password is not null")
      return false;
    } else if (username === "") {
      notify("Username is not null")
      return false;
    }
    return true;
  }
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })

  }
  return (
    <div className='login__container'>

      <form onSubmit={(event) => handleSubmit(event)} className="login__form">
        <div className="title">
          <h3>Chat App</h3>
        </div>
        <input type="text" name="username" id="" placeholder='username' onChange={(e) => handleChange(e)} />
        <input type="password" name="password" id="" placeholder='password' onChange={(e) => handleChange(e)} />
        <button type='submit'>Log In</button>
        <span>
          Don't have an account ? <Link to="/register">Create One.</Link>
        </span>

      </form>

    </div>
  )
}

export default Login