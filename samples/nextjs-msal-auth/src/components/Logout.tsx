
import React from 'react'
import { useMsal } from '@azure/msal-react';

export default function Logout() {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect();
    }

    return (
        <div style={{ padding: "24px" }}>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
