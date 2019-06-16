import * as React from "react";
import pnp from "@pnp/pnpjs";
import "./App.scss";
import { initializeIcons } from "@uifabric/icons";
import { pnpConfig } from "../utils/pnp.config";
import { getCurrentUser } from "../services/UserAPI";
import { IAppState } from "../models/IAppModel";
import { ICurrentUserState } from "../models/IUser";
import { InitialAppState } from "../containers/App";

class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = InitialAppState;
    initializeIcons(undefined, { disableWarnings: true });
    pnp.setup(pnpConfig);
  }
  componentDidMount() {
    getCurrentUser(
      this.state.currentUser,
      (user: ICurrentUserState) => {
        this.setState({ currentUser: user });
      },
      (error: string) => {
        console.error(error);
      }
    );
  }

  public render(): JSX.Element {
    return (
      <div>
        Hello World
      </div>
    );
  }
}

export default App;
