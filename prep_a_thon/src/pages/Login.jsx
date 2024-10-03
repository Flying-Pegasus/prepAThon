import React, {  useState } from "react";
import { getAuth, sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app, db } from "./firebase"
import { setDoc, doc } from "firebase/firestore"
import { useNavigate, Link } from "react-router-dom";
// import { useFirebase } from "../context/Firebase";
import logo from "./logo.png"

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user)
      setEmail(""); setPassword("");
      if (user.emailVerified) {
        console.log("User LoggedIn Successfully!");
        alert(`LoggedIn Successfully!`);
        navigate("/profile");
      }
      else {
        alert("Please verify email");
        console.log("Pleeese");
        setError('Email not verified. Please verify your email.');
        await signOut(auth);
        navigate("/login");

      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      setEmail(""); setPassword("");
      setError(`Error: ${error.message}`);
    }
  };

  const signupwithGoogle = () => {
    signInWithPopup(auth, googleProvider).then(async (result) => {
      console.log(result);
      const user = result.user;
      if (result.user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          username: user.displayName,
        });
        alert("User logged in Successfully");

      }
    }).catch((error) => {
        console.log(error.message);
        console.log(error.customData.email);
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential);
      });
  };


  const signupwithGithub = () => {
    signInWithPopup(auth, githubProvider)
      .then(async (result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        // const credential = GithubAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        const user = result.user;
        if (result.user) {
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName: user.displayName,
          });
          alert("User logged in Successfully");
        }

      }).catch((error) => {
        console.log(error.message);
        console.log(error.customData.email);
      });
  }

  const forgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("A password reset link has been sent to your email if it is registered")
      })
      .catch((error) => {
        console.log(error.message)
        alert(error.message);
      })
  }



  return (
    <>
      <body>
        <section> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>

          <div className="signin">

            <div className="content">

              <img className="eyeLogo" src={logo} alt="Logo" />

              <h2>Sign In</h2>

              <div className="form">

                <div className="inputBox">

                  <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" required /> <i>Email</i>

                </div>

                <div className="inputBox">

                  <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" required />  <i>Password</i>

                </div>

                <div className="links"> <div className="forpass" onClick={forgotPassword}>Forgot Password</div> <Link to="/register">Sign Up</Link>

                </div>


                <div className="inputBox">

                  <input onClick={handleSubmit} type="submit" value="Login" />

                </div>

              </div>
              <button onClick={signupwithGoogle} type="button" class="login-with-google-btn" >
                Signin with Google
              </button>
              <button onClick={signupwithGithub} type="button" class="login-with-github-btn" >
                Signin with GitHub
              </button>

            </div>

          </div>

        </section>
        {error && <p id="try">{error}</p>}
      </body>
    </>
  )
}

export default LoginPage;