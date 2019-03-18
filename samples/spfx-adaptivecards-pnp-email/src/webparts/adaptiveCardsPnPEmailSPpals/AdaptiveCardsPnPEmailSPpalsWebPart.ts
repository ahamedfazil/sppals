import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'AdaptiveCardsPnPEmailSPpalsWebPartStrings';
import AdaptiveCardsPnPEmailSPpals from './components/AdaptiveCardsPnPEmailSPpals';
import { IAdaptiveCardsPnPEmailSPpalsProps } from './components/IAdaptiveCardsPnPEmailSPpalsProps';

export interface IAdaptiveCardsPnPEmailSPpalsWebPartProps {
  description: string;
}

export default class AdaptiveCardsPnPEmailSPpalsWebPart extends BaseClientSideWebPart<IAdaptiveCardsPnPEmailSPpalsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAdaptiveCardsPnPEmailSPpalsProps > = React.createElement(
      AdaptiveCardsPnPEmailSPpals,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
