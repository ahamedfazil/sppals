import * as React from "react";
import styles from "./UserHierarchy.module.scss";
import { IUserHierarchyProps } from "./IUserHierarchyProps";
import App from "./App";

export default class UserHierarchy extends React.Component<
  IUserHierarchyProps,
  {}
> {
  public render(): React.ReactElement<IUserHierarchyProps> {
    return (
      <div className={styles.userHierarchy}>
        <div className={styles.container}>
          <div className={styles.row}>
            <App webpartContext={this.props.context} />
          </div>
        </div>
      </div>
    );
  }
}
