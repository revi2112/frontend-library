import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const LoginPage = () => {
    const {loginWithRedirect} = useAuth0();

    return(
        <div>
            <button onClick={() => loginWithRedirect()}> Login In</button>
        </div>
    )
}
