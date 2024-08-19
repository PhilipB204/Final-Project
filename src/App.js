// src/App.js
import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import Notes from "./Notes";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                console.log("User is signed in:", user);
            } else {
                setUser(null);
                console.log("No user is signed in.");
            }
        });

        return () => unsubscribe();
    }, []);

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

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("Logged out successfully");
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {!user ? (
                        <div className="card mt-5">
                            <div className="card-body">
                                <h3 className="card-title text-center">
                                    {isRegistering ? "Register" : "Login"}
                                </h3>
                                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">
                                        {isRegistering ? "Register" : "Login"}
                                    </button>
                                </form>
                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-link"
                                        onClick={() => setIsRegistering(!isRegistering)}
                                    >
                                        {isRegistering
                                            ? "Already have an account? Login"
                                            : "Don't have an account? Register"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Notes />
                            <div className="text-center mt-3">
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
