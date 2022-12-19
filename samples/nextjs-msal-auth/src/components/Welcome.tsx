
import { useMsal } from '@azure/msal-react';
import React, { useEffect, useState } from 'react'

export default function Welcome() {
    const [userName, setUserName] = useState<string>("");
    const { instance } = useMsal();

    const activeAccount = instance.getActiveAccount();
    useEffect(() => {
        if (activeAccount) {
            setUserName(activeAccount.username);
        } else {
            setUserName("");
        }
    }, [activeAccount]);

    return (
        <div>{userName ? <>
            Welcome, {userName}
        </> : <>
            User not found. Maybe not loggedin
        </>}</div>
    )
}
