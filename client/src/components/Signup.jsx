import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';
import '../styled/login.css'
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  // State to hold username and password inputs

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signUpError, setSignUpError] = useState(null);
  const navigate = useNavigate()
  // Function to handle form submission

  const handleFormSubmit = async (e) => {
	e.preventDefault();
  
	try {
	  const response = await fetch('http://localhost:3000/Signup', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, password }),
	  });
  
	  const data = await response.json();
  
	  if (response.ok) {
		console.log(data); // Log the response data if successful
		// Perform any other actions upon successful response
		navigate('/'); // Navigate to the specified location upon success
	  } else {
		const errorData = await response.json();
            console.error('Error:', errorData); // Log the error data received from the server
            // Handle errors or perform appropriate actions based on the error response
            setSignUpError(errorData.message);
	  }
	} catch (error) {
        console.error('Error occurred during fetch:', error);
        // Handle any errors that might occur during the fetch process
        setSignUpError('An unexpected error occurred. Please try again.'); // Set signup error message
    }
  };
 

  return (
    <div className="container h-100">
		<div className="d-flex justify-content-center h-100">
			<div className="user_card">
				<div className="d-flex justify-content-center">
					<div className="brand_logo_container">
						<img src="images\dices.svg" className="brand_logo" alt="Logo"/>
					</div>
				</div>
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
						<div className="form-group">
			
						</div>
							<div className="d-flex justify-content-center mt-3 login_container">
				 	<button type="submit" name="button" className="btn login_btn">Sign Up</button>
				   </div>
				   <div className="form-group">
						{/* Display the login error message */}
						{signUpError && (
							<div className="alert alert-danger" role="alert">
							{signUpError}
							</div>
							)}
	
						</div>
					</form>
				</div>
		
				<div className="mt-4">
					<div className="d-flex justify-content-center links">
						Already have an account? <Link to="/" className="ml-2">Login</Link>
					</div>
		
				</div>
			</div>
		</div>
	</div>
  );
};

export default SignupForm;

