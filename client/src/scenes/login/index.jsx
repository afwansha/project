import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
const SERVER_URL = process.env.REACT_APP_SERVER_URL

const Login = () => {
const [data, setData] = useState({ email: "", password: "" });
const [error, setError] = useState("");

const handleChange = ({ currentTarget: input }) => {
setData({ ...data, [input.name]: input.value });
};

const handleSubmit = async (e) => {
	e.preventDefault();
	try {
		const formData = new FormData();
		formData.append("email", data.email);
		formData.append("password", data.password);
		const response = await axios.post(`${SERVER_URL}/adminlogin`, {
			method: 'POST',
			body: formData
		});
		const data = await response.json();

		const { token } = response.data;

		// Save the token to local storage
		localStorage.setItem("token", token);

		// Redirect the user to the home page
		window.location = "/";
	} catch (error) {
		if (error.response && error.response.status >= 400 && error.response.status <= 500) {
			setError(error.response.data.message);
		}
	}
};

return (
<div className={styles.login_container}>
<div className={styles.login_form_container}>
<div className={styles.left}>
<form className={styles.form_container} onSubmit={handleSubmit}>
<h1>Login to your account</h1>
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
<div className={styles.right}>
<h1>Admin Login</h1>
<Link to="/signup"></Link>
</div>
</div>
</div>
);
};

export default Login;