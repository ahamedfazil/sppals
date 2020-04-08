import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { MSGraphClientFactory } from '@microsoft/sp-http';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpPalsArticlesWebPartStrings';
import SpPalsArticles from './components/SpPalsArticles';
import { ISpPalsArticlesProps } from './components/ISpPalsArticlesProps';
import { SPPalsService } from '../../common/services/SPPalsService';

export interface ISpPalsArticlesWebPartProps {
  description: string;
}

export default class SpPalsArticlesWebPart extends BaseClientSideWebPart<ISpPalsArticlesWebPartProps> {

  private _graphServiceSPPals: SPPalsService;

  protected onInit(): Promise<void> {

    return super.onInit().then(_ => {
      this._graphServiceSPPals = new SPPalsService(this.context.serviceScope.consume(MSGraphClientFactory.serviceKey));
    });
  }

  public render(): void {
    const element: React.ReactElement<ISpPalsArticlesProps> = React.createElement(
      SpPalsArticles,
      {
        sppalService: this._graphServiceSPPals
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
