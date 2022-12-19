
import { useMsal } from '@azure/msal-react';
import React, { useState } from 'react'
import { loginRequest } from '../config/authConfig';

export default function LogIn() {
    const { instance } = useMsal();

    const handleLogin = () => {
        // below API redirect user to Azure AD and ask user to provide credentials
        // optional to provide loginRequest param
        instance.loginRedirect(loginRequest);
    }

    return (
        <div style={{ padding: "24px" }}>
            <button onClick={handleLogin}>LogIn</button>
        </div>
    )
}
