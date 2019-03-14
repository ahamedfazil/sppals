import * as React from "react";
import { initializeIcons } from "@uifabric/icons";
import styles from "./AdaptiveCardsSPpals.module.scss";
import { IAdaptiveCardsSPpalsProps } from "../models/IAdaptiveCardsSPpalsProps";
import { UserAdaptiveCard } from "./UserAdaptiveCard";
import pnp from "@pnp/pnpjs";
import { pnpConfig } from "../services/pnp.config";
export default class AdaptiveCardsSPpals extends React.Component<
  IAdaptiveCardsSPpalsProps,
  {}
> {
  constructor(props: IAdaptiveCardsSPpalsProps) {
    super(props);
    initializeIcons(undefined, { disableWarnings: true });
    pnp.setup(pnpConfig);
  }

  public render(): React.ReactElement<IAdaptiveCardsSPpalsProps> {
    return (
      <div className={`${styles.adaptiveCardsSPpals} ms-Grid`}>
        <div className="ms-Grid-row">
          <div
            className={`${
              styles.titleBar
            } ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-font-su`}
          >
            {this.props.description}
          </div>
          <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
            <div>
              <UserAdaptiveCard />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
