import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
const SERVER_URL = process.env.REACT_APP_SERVER_URL

const Login = () => {
const [data, setData] = useState({ email: "", password: "" });
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);

const handleChange = (e) => {
setData({ ...data, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
	setIsLoading(true);
	e.preventDefault();
	try {	
		console.log(data)
		axios.post(`${SERVER_URL}/adminlogin`, data)
			.then((data) => {
			  localStorage.setItem('token', data.data.token);
			  localStorage.setItem('name', data.data.admin.name);
			  localStorage.setItem('email', data.data.admin.email);
			  window.location = '/';
			})
			.catch((error) => {
				alert("Enter valid credentials")
			  console.error('Error:', error);
		});
	} catch (error) {
		alert(error)
		if (error.response && error.response.status >= 400 && error.response.status <= 500) {
			alert(error.response.data.message);
			setError(error.response.data.message);
		}
	}finally{
		setIsLoading(false); 
	}
};

return (
<div className={styles.login_container}>
<div className={styles.login_form_container}>
<div className={styles.left}>
<form className={styles.form_container} onSubmit={handleSubmit}>
<div className={styles.right}>
<h1>Login to your account</h1>
</div>
<input
           type="email"
           placeholder="Email"
           name="email"
           onChange={handleChange}
           value={data.email}
           required
           className={styles.input}
         />
<input
           type="password"
           placeholder="Password"
           name="password"
           onChange={handleChange}
           value={data.password}
           required
           className={styles.input}
         />
{error && <div className={styles.error_msg}>{error}</div>}
<button type="submit" className={styles.green_btn}>
Sign In
</button>
</form>
</div>
{/* <div className={styles.right}>
<h1>Admin Login</h1>
<Link to="/signup"></Link>
</div> */}
</div>
</div>
);
};

export default Login;