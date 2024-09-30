import React from "react";
import { useFirebase } from "../context/Firebase";
import { useNavigate} from "react-router-dom";


const Newpage = () => {

    const firebase = useFirebase();
    const navigate = useNavigate();

    return (
        <div>
            <h1 id="try">Your Page</h1>1
            <button onClick={() => { firebase.signout();  navigate("/login");}}>LogOut</button>
        </div>
    )
}

export default Newpage;