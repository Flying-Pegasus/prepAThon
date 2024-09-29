import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate,Link } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import {setDoc,doc} from "firebase/firestore"
import {app, db} from "./firebase"
import logo from "./logo.png"

const auth = getAuth(app);


const RegisterPage = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (firebase.isLoggedIn) {
      // navigate to home
      navigate("/profile");
    }
  }, [firebase, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      await  createUserWithEmailAndPassword(auth,email,password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db,"Users", user.uid),{
          email : user.email,
          username: username,
        });
      }
      console.log("User registered Successfully!");
      alert(`${username} registered Successfully!`);
      setUsername("");setEmail("");setPassword("");
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      setUsername("");setEmail("");setPassword("");
    }
  };


  return (
    <>
      <body>
        <section> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>

          <div className="signin">

            <div className="content">

              <img className="eyeLogo" src={logo} alt="Logo" />

              <h2>Sign Up</h2>

              <div className="form">

                <div className="inputBox">

                  <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" required /> <i>Username</i>

                </div>

                <div className="inputBox">

                  <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" required /> <i>Email Id</i>

                </div>

                <div className="inputBox">

                  <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" required /> <i>Password</i>

                </div>


                <div className="links"> <Link to="/login">Login</Link></div>

                <div className="inputBox">

                  <input onClick={handleSubmit} type="submit" value="Create Account" />

                </div>

              </div>

            </div>

          </div>

        </section>
      </body>
    </>
  )
}

export default RegisterPage;