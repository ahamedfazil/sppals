import * as React from 'react';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import styles from './DynamicComponent.module.scss';
import * as strings from 'ListFormStrings';


export interface IDynamicComponentProps {
  index: number;
  removeField(index: number): void;
}

export default class DynamicComponent extends React.Component<IDynamicComponentProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    const { children, } = this.props;

    return (
      <div className={css('ard-dynamicComponent', styles.dynamicComponent)}>
        {children}
        <div className={css(styles.toolbar)}>
          <button type='button' className={css('ard-dynamicComponent', styles.button)} title={strings.RemoveField}
            onClick={() => this.props.removeField(this.props.index)}><i className='ms-Icon ms-Icon--Delete'></i></button>
        </div>
      </div>);
  }
}
