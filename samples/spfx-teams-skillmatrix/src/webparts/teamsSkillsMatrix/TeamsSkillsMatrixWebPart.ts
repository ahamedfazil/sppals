import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-webpart-base";
import * as microsoftTeams from "@microsoft/teams-js";
import * as strings from "TeamsSkillsMatrixWebPartStrings";
import TeamsSkillsMatrix, { ITeamsSkillsMatrixProps } from "./components/TeamsSkillsMatrix";
import { sp } from "@pnp/sp";

export interface ITeamsSkillsMatrixWebPartProps {
  description: string;
}

export default class TeamsSkillsMatrixWebPart extends BaseClientSideWebPart<
  ITeamsSkillsMatrixWebPartProps
> {
  private _teamsContext: microsoftTeams.Context;
  protected onInit(): Promise<any> {
    let retVal: Promise<any> = Promise.resolve();
    if (this.context.microsoftTeams) {
      retVal = new Promise((resolve, reject) => {
        this.context.microsoftTeams.getContext(context => {
          this._teamsContext = context;
          resolve();
        });
      });
    }
    sp.setup({
      spfxContext: this.context
    });
    return retVal;
  }
  public render(): void {
    let title: string = "";
    let subTitle: string = "";
    let siteTabTitle: string = "";

    if (this._teamsContext) {
      // We have teams context for the web part
      title = "Welcome to Teams!";
      subTitle = "Building custom enterprise tabs for your business.";
      siteTabTitle =
        "We are in the context of following Team: " +
        this._teamsContext.teamName;
    } else {
      // We are rendered in normal SharePoint context
      title = "Welcome to SharePoint!";
      subTitle = "Customize SharePoint experiences using Web Parts.";
      siteTabTitle =
        "We are in the context of following site: " +
        this.context.pageContext.web.title;
    }
    let element: React.ReactElement<ITeamsSkillsMatrixProps> = React.createElement(
      TeamsSkillsMatrix,
      {
        title: title,
        subTitle: subTitle,
        siteTabTitle: siteTabTitle,
        description: this.properties.description
      }
    );
    if (this._teamsContext) {
    }
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
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
                PropertyPaneTextField("description", {
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
