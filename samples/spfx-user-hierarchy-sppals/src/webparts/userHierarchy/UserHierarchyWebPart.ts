import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'UserHierarchyWebPartStrings';
import UserHierarchy from './components/UserHierarchy';
import { IUserHierarchyProps } from './components/IUserHierarchyProps';

export interface IUserHierarchyWebPartProps {
  description: string;
}

export default class UserHierarchyWebPart extends BaseClientSideWebPart<IUserHierarchyWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IUserHierarchyProps > = React.createElement(
      UserHierarchy,
      {
        description: this.properties.description,
        context: this.context
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
