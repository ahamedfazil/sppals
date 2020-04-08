import * as React from "react";
import { ParentUserNode } from "./ParentNode";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import Tree from "react-hierarchy-tree-graph";
import { IUserData } from "../types/UserData";

export interface IAppProps {
  webpartContext: WebPartContext;
}
interface IAppState {
  parentUser: any[];
  userTreeData: IUserData[];
}

export default class App extends React.Component<IAppProps, IAppState> {
  public constructor(props: IAppProps) {
    super(props);
    this.state = {
      parentUser: [],
      userTreeData: [
        {
          name: "Top Level",
          attributes: {
            Department: "val A",
            Email: "val B"
          },
          children: [
            {
              name: "Level 2: A",
              attributes: {
                Department: "val A",
                Email: "val B"
              }
            },
            {
              name: "Level 2: B",
              children: [
                {
                  name: "Top Level",
                  attributes: {
                    Department: "val A",
                    Email: "val B"
                  },
                  children: [
                    {
                      name: "Level 2: A",
                      attributes: {
                        Department: "val A",
                        Email: "val B"
                      }
                    },
                    {
                      name: "Level 2: B"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  public render(): JSX.Element {
    return (
      <div>
        <ParentUserNode
          context={this.props.webpartContext}
          getParentUserValue={val => this._getChildUsers(val)}
        />
        <div>
          <Tree data={this.state.userTreeData} />
        </div>
      </div>
    );
  }

  private _getChildUsers(parentUser: any[]) {
    console.clear();
    console.log(parentUser);
    this.setState({ parentUser: parentUser });
    //Getting all child users
  }
}
