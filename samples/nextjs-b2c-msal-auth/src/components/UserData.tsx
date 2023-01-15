'use client';
import { AccountInfo } from '@azure/msal-browser';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Button, Grid } from '@nextui-org/react';
import React from 'react';


export default function UserData() {
    const { instance, accounts } = useMsal();
    let activeAccount: AccountInfo;

    if (instance) {
        activeAccount = accounts[0];
    }

    const handleLoginRedirect = () => {
        instance.loginRedirect().catch((error) => console.log(error));
    };

    const handleLogoutRedirect = () => {
        instance.logoutRedirect();
    };

    return (
        <div>

            <h2>User</h2>
            <AuthenticatedTemplate>

                <Grid.Container gap={2}>
                    <Grid xs={12}>
                        <p>Welcome! You are authenticated.</p>
                    </Grid>
                    <Grid xs={12}>
                        <p>Your name is -
                            {/* @ts-ignore */}
                            <code>{activeAccount?.name}</code>
                        </p>
                    </Grid>
                    <Grid xs={4}>
                        <Button color="error" auto onClick={handleLogoutRedirect}>
                            Logout
                        </Button>
                    </Grid>
                </Grid.Container>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Grid.Container gap={2}>
                    <Grid xs={12}>
                        <p>Not Authenticated, Please sign in to continue.</p>
                    </Grid>
                    <Grid xs={4}>
                        <Button color="gradient" auto onClick={handleLoginRedirect}>
                            Sign In/Sign Up
                        </Button>
                    </Grid>
                </Grid.Container>
            </UnauthenticatedTemplate>
        </div>
    )
}
