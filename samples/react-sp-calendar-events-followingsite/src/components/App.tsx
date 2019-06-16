import * as React from "react";
import pnp from "@pnp/pnpjs";
import { initializeIcons } from "@uifabric/icons";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import "./App.scss";
import { pnpConfig } from "../utils/pnp.config";
import { getCurrentUser } from "../services/UserAPI";
import { IAppState } from "../models/IAppModel";
import { ICurrentUserState } from "../models/IUser";
import { InitialAppState } from "../containers/App";
import { getFollowedSiteUri } from "../services/SiteAPI";

class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = InitialAppState;
    initializeIcons(undefined, { disableWarnings: true });
    pnp.setup(pnpConfig);
  }
  async componentDidMount() {
    getCurrentUser(
      this.state.currentUser,
      (user: ICurrentUserState) => {
        this.setState({ currentUser: user, isFetched: true, error: null });
      },
      (error: string) => {
        console.error(error);
        this.setState({ isFetched: false, error: error });
      }
    );
    getFollowedSiteUri();
  }

  public render(): JSX.Element {
    return (
      <Fabric>
        <div className="ticket-App">
          {!this.state.isFetched ? (
            this.state.error ? (
              <div>Error while getting user - ${this.state.error}</div>
            ) : (
              <Spinner
                size={SpinnerSize.large}
                style={{ margin: "200px" }}
                label={"Getting current user info..."}
              />
            )
          ) : (
            <div className="ms-Grid">
              Hello, {this.state.currentUser.firstName}
            </div>
          )}
        </div>
      </Fabric>
    );
  }
}

export default App;
