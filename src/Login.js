import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Logged in as:", userCredential.user);
            })
            .catch((error) => {
                console.error("Error logging in:", error);
            });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Registered and logged in as:", userCredential.user);
            })
            .catch((error) => {
                console.error("Error registering:", error);
            });
    };

    return (
        <div className="container">
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {isRegistering ? "Register" : "Login"}
                </button>
            </form>
            <button
                className="btn btn-link mt-3"
                onClick={() => setIsRegistering(!isRegistering)}
            >
                {isRegistering
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
            </button>
        </div>
    );
};

export default Login;
