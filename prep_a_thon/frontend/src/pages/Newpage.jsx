import React, { useEffect, useState } from "react";


const Newpage = () => {
    const [data,setData] = useState({});

    return (
        <div>
            <h1 id="try">Please Wait!!</h1>
            {/* <button onClick={() => { firebase.signout();  navigate("/login");}}>LogOut</button> */}
        </div>
    )
}

export default Newpage;