import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';
import '../styled/login.css'
import { Link, useNavigate } from "react-router-dom";

const RenderForm = () => {
  // State to hold username and password inputs

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // State to store login error
  const navigate = useNavigate()
  // Function to handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check the response from the server
        if (response.ok) {
            console.log('Login successful');
			// or perform any action upon successful login
            navigate(`/${username}/newpage`); // Redirect to another page upon successful login
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
            // Handle error states or show error messages to the user
            setLoginError(errorData.message); // Set error message based on server response
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle other error scenarios or log the error object
        setLoginError('An unexpected error occurred. Please try again.');
    }
};

  return (
    <div className="container h-100">
		<div className="d-flex justify-content-center h-100">
			<div className="user_card">

        <div className="d-flex justify-content-center mt-3">
                <h2 className="logo_heading">Play Dice</h2>
        </div>
				<div className="d-flex justify-content-center form_container">
					<form onSubmit={handleFormSubmit}>
						<div className="input-group mb-3">
							<div className="input-group-append">
								<span className="input-group-text"><i className="fas fa-user"></i></span>
							</div>

							<input type="text" name="username" className="form-control input_user" placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
						</div>
						<div className="input-group mb-2">
							<div className="input-group-append">
								<span className="input-group-text"><i className="fas fa-key"></i></span>
							</div>
							<input type="password" name="" className="form-control input_pass" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
						</div>

							<div className="d-flex justify-content-center mt-3 login_container">
				 				<button type="submit" name="button" className="btn login_btn">Login</button>
				   			</div>
						<div className="form-group">
						{/* Display the login error message */}
						{loginError && (
							<div className="alert alert-danger" role="alert">
							{loginError}
							</div>
							)}

						</div>
					</form>
				</div>

				<div className="mt-4">
					<div className="d-flex justify-content-center links">
						Don't have an account? <Link to="/Signup" className="ml-2">Sign Up</Link>
					</div>

				</div>
			</div>
		</div>
	</div>
  );
};

export default RenderForm;
