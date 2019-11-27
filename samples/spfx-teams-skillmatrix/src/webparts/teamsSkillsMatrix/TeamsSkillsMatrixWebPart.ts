import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TeamsSkillsMatrixWebPartStrings';
import TeamsSkillsMatrix from './components/TeamsSkillsMatrix';
import { ITeamsSkillsMatrixProps } from './components/ITeamsSkillsMatrixProps';

export interface ITeamsSkillsMatrixWebPartProps {
  description: string;
}

export default class TeamsSkillsMatrixWebPart extends BaseClientSideWebPart<ITeamsSkillsMatrixWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITeamsSkillsMatrixProps > = React.createElement(
      TeamsSkillsMatrix,
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
