import React, { useState } from 'react'
import '../styles/LoginForm.css'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleLoginForm = async (e) => {
        e.preventDefault();
        
        try{
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }), 
            });
            const data = await response.json();
            if(response.ok){
                alert(data.message || "Login successful!")
            }else{
                alert(data.message || "Login failed. Try again.")
            }
        }catch(err){
            console.error(err);
        }
        setEmail('');
        setPassword('');
    }
    return (
        <div className='login-form'>
            <div className='main-heading'>
                <h2>Login here</h2>
            </div>
            <form onSubmit={handleLoginForm}>
                <input
                    type='text'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <input
                    type='text'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default LoginForm