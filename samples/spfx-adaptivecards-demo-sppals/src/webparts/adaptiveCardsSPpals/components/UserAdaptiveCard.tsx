import * as React from "react";
import AdaptiveCard from "react-adaptivecards";
import styles from "./UserAdaptiveCard.module.scss";
import {
  IUserAdaptiveCardState,
  ICurrentUser
} from "../models/IUserAdaptiveCardState";
import { Loader } from "./Loader";
import { getCurrentUser, InitialState } from "../services/UserProfileService";

export class UserAdaptiveCard extends React.Component<
  {},
  IUserAdaptiveCardState
> {
  constructor(props: {}) {
    super(props);
    this.state = InitialState;
  }
  public componentDidMount() {
    // get CurrentUserInfo
    getCurrentUser(
      this.state.currentUser,
      (user: ICurrentUser) => {
        this.setState({ currentUser: user, isCurrentUserFetched: true });
      },
      (error: string) => {
        console.error(error);
        this.setState({ isError: true });
      }
    );
  }

  public render(): JSX.Element {
    return (
      <div className={`${styles.userAdaptive}`}>
        {!this.state.isCurrentUserFetched ? (
          <Loader
            isFetched={this.state.isCurrentUserFetched}
            isError={this.state.isError}
          />
        ) : (
          <div>
            <AdaptiveCard
              payload={{
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                type: "AdaptiveCard",
                version: "1.0",
                body: [
                  {
                    type: "Container",
                    items: [
                      {
                        type: "Image",
                        horizontalAlignment: "Center",
                        spacing: "Large",
                        style: "Person",
                        url: `${
                          this.state.currentUser.imageURL
                            ? this.state.currentUser.imageURL
                            : "http://www.sharepointpals.com/image.axd?picture=/avatars/Authors/ahamed-fazil-buhari.png"
                        }`,
                        size: "Large"
                      },
                      {
                        type: "TextBlock",
                        size: "Large",
                        horizontalAlignment: "Center",
                        weight: "Lighter",
                        text: `${this.state.currentUser.fullName}`
                      },
                      {
                        type: "TextBlock",
                        horizontalAlignment: "Center",
                        weight: "Bolder",
                        text: `Email: ${this.state.currentUser.email}`,
                        wrap: true
                      }
                    ]
                  }
                ]
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
