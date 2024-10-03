import React, { useEffect, useState } from "react";
import { app, db } from "../pages/firebase"
import { doc, getDoc } from "firebase/firestore";
import Newpage from "../pages/Newpage";
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";


const auth = getAuth(app);
function Profile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    try {
      const unscubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Hi");
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log(docSnap.data());
        } else {
          console.log("User is not logged in");
        }
      });
    }catch(error){
      console.log(error.message);
    }

  }

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
  return (
    <div>
      {userDetails ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
          </div>
          <h3 id="try">Welcome {userDetails.username} 🙏🙏</h3>
          <div>
            <p id="try">Email: {userDetails.email}</p>

          </div>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p><Newpage /></p>
      )}
    </div>
  );
}
export default Profile;
