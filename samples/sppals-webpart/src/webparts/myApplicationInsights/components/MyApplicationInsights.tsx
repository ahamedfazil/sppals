import * as React from 'react';
import {
  Logger,
  LogLevel
} from "@pnp/logging";
import styles from './MyApplicationInsights.module.scss';
import { IMyApplicationInsightsProps } from './IMyApplicationInsightsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class MyApplicationInsights extends React.Component<IMyApplicationInsightsProps, {}> {
  public componentDidMount() {
    try {
      Logger.log({
        message: "Inside MyApplicationInsights - componentDidMount()",
        level: LogLevel.Info,
        data: "fetching of data initialized"
      });
      // any api calls
    } catch (error) {
      Logger.log({
        message: "Error MyApplicationInsights - componentDidMount()",
        level: LogLevel.Error,
        data: error
      });
    }
  }
  public render(): React.ReactElement<IMyApplicationInsightsProps> {
    return (
      <div className={styles.myApplicationInsights}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to Application Insight Logging WebPart!</span>
              <p className={styles.subTitle}>Find logs of your webpart in azure app insights.</p>
              <p className={styles.description}>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
