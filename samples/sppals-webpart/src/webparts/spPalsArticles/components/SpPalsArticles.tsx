import * as React from 'react';
import styles from './SpPalsArticles.module.scss';
import { ISpPalsArticlesProps } from './ISpPalsArticlesProps';
import EmailForm from './form/EmailForm';

export default class SpPalsArticles extends React.Component<ISpPalsArticlesProps, {}> {
  public render(): React.ReactElement<ISpPalsArticlesProps> {
    return (
      <div className={styles.spPalsArticles}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to My Article WebPart!</span>
              <div className={styles.articleContent}>
                <p className={styles.subTitle}>Send Email From User Account Using Graph API.</p>
                <EmailForm sppalsService={this.props.sppalService} />
                <a className={styles.learnMore} href="https://www.sharepointpals.com/post/how-to-send-an-email-using-graph-api-with-attachments-in-spfx-webpart/">
                  <span>Learn more</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
