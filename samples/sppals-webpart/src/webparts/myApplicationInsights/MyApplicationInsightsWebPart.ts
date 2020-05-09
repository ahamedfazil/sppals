import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, Log } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  Logger,
  LogLevel,
  ConsoleListener
} from "@pnp/logging";

import * as strings from 'MyApplicationInsightsWebPartStrings';
import MyApplicationInsights from './components/MyApplicationInsights';
import { IMyApplicationInsightsProps } from './components/IMyApplicationInsightsProps';
import { AILogListenerService } from '../../common/services/AILogListenerService';

export interface IMyApplicationInsightsWebPartProps {
  description: string;
}

export default class MyApplicationInsightsWebPart extends BaseClientSideWebPart<IMyApplicationInsightsWebPartProps> {

  public onInit(): Promise<void> {
    Logger.subscribe(new AILogListenerService(this.context.pageContext.user.email));
    if (DEBUG)
      Logger.activeLogLevel = LogLevel.Verbose;
    return Promise.resolve<void>();
  }

  public render(): void {
    Logger.log({
      message: "Inside MyApplicationInsightsWebPart - render()",
      level: LogLevel.Info,
      data: "No Issue Found"
    });
    const element: React.ReactElement<IMyApplicationInsightsProps> = React.createElement(
      MyApplicationInsights,
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
