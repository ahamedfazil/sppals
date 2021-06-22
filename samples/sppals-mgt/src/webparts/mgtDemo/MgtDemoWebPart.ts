import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { Providers, SharePointProvider } from '@microsoft/mgt';
import * as strings from 'MgtDemoWebPartStrings';
import { AppProps } from './components/App';
import App from './components/App';

export interface IMgtDemoWebPartProps {
  description: string;
}

export default class MgtDemoWebPart extends BaseClientSideWebPart<IMgtDemoWebPartProps> {

  protected async onInit(): Promise<void> {
    Providers.globalProvider = new SharePointProvider(this.context);
  }

  public render(): void {
    const element: React.ReactElement<AppProps> = React.createElement(
      App,
      {
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
