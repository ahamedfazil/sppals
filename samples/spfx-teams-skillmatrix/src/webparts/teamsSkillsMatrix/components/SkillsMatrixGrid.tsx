import * as React from "react";
import {
  IColumn,
  DetailsRow,
  SelectionMode,
  IDetailsFooterProps,
  IDetailsHeaderProps
} from "office-ui-fabric-react/lib/DetailsList";
import {
  Label,
  Link,
  Icon,
  ShimmeredDetailsList
} from "office-ui-fabric-react";
import { sp, CamlQuery } from "@pnp/sp";
import { CONST } from "../utils/Const";
import { isArray } from "@pnp/common";
import { ISkillMatrix } from "../models/ISkillMatrix";
import update from "immutability-helper";
import { ICapabilities } from "../models/IChapter";
import { CurrentUser } from "@pnp/sp/src/siteusers";
import { compareTwoArray } from "../utils/Utilities";
import SkillMatrixPanel from "./SkillMatrixPanel";
import {
  getAllSkillMatrixByChapter,
  skillMatixColumnUpdater
} from "../services/ListServices";

export interface ISkillMatrixItem {
  key: number;
  capability: string;
  value: number;
}

interface ISkillsMatrixGridProps {
  chapter: string;
  members: string[];
  isLead: boolean;
  currentUser: CurrentUser;
  capabilities: ICapabilities[];
}

export interface ISkillsMatrixGridState {
  items: any[];
  columns: IColumn[];
  isFetched: boolean;
  isEditPanelOpened?: boolean;
  error?: any;
}
let _currentUser: CurrentUser = null;
export class SkillsMatrixGrid extends React.Component<
  ISkillsMatrixGridProps,
  ISkillsMatrixGridState
> {
  private _allItems: any[];
  private _columns: IColumn[];

  constructor(props: ISkillsMatrixGridProps) {
    super(props);
    // Populate Capabilities.
    this._allItems = [];
    _currentUser = this.props.currentUser;
    if (this.props.capabilities) {
      this.props.capabilities.map(capbility => {
        this._allItems.push({
          key: capbility.key,
          capability: capbility.name
        });
      });
    }

    // #region Setting Columns
    this._columns = [
      {
        key: CONST.SkillMatrixColumn.Capabilities.key,
        name: CONST.SkillMatrixColumn.Capabilities.name,
        fieldName: CONST.SkillMatrixColumn.Capabilities.fieldName,
        minWidth: 100,
        currentWidth: 100,
        isResizable: true
      }
    ];

    this._columns = this._columns.concat(
      this.props.members.map(member => {
        return {
          key: member,
          name: member,
          fieldName: member,
          minWidth: 100,
          maxWidth: 120,
          isResizable: true
        };
      })
    );
    // #endregion
    // this.state = {
    //   items: [],
    //   isFetched: false,
    //   error: null,
    //   isEditPanelOpened: false
    // };
    this.state = {
      items: [],
      isFetched: false,
      columns: this._columns
    };
  }

  public async componentDidMount() {
    // Get skill matrix - Fetch SkillMatrix list based on Chapter
    // Get skill matrix - Fetch SkillMatrix list based on Chapter
    const fetchedSkillsMatrixItems = await getAllSkillMatrixByChapter(
      this.props.chapter,
      this.props.capabilities
    );
    const updateColumns = skillMatixColumnUpdater(
      this._columns,
      fetchedSkillsMatrixItems
    );
    console.log(
      "Faz-Log: componentDidMount -> fetchedSkillsMatrixItems",
      fetchedSkillsMatrixItems
    );
    const updatedState = update(this.state, {
      items: { $set: fetchedSkillsMatrixItems },
      isFetched: { $set: true },
      columns: { $set: updateColumns }
    });
    this.setState(updatedState);

    // console.log("Faz-Log: componentDidMount -> allITems", fetchedSkillsMatrixItems);
    // let queryCondition: CamlQuery = {
    //   ViewXml: `<View><Query><Where>
    //   <Eq>
    //                       <FieldRef Name='${CONST.Lists.SkillsMatrix.Columns.Chapter.Internal_Name}' />
    //                       <Value Type='Text'>${this.props.chapter}</Value>
    //                     </Eq>
    //   </Where></Query></View>`
    // };
    // const skillsItems = await sp.web.lists
    //   .getByTitle(CONST.Lists.SkillsMatrix.ListName)
    //   .getItemsByCAMLQuery(queryCondition, "FieldValuesAsText");

    // if (skillsItems && isArray(skillsItems)) {
    //   console.log("Faz-Log: componentDidMount -> skillsItems", skillsItems);
    //   let localSkillsMatrix: ISkillMatrix[] = [];
    //   skillsItems.map(item => {
    //     let skillMatrix: ISkillMatrix = {
    //       member: null,
    //       title: "",
    //       capability: [],
    //       squad: "",
    //       chapter: "",
    //       itemID: null
    //     };
    //     skillMatrix.itemID = item["ID"].toString();
    //     skillMatrix.member =
    //       item["FieldValuesAsText"][
    //         CONST.Lists.SkillsMatrix.Columns.Member.Internal_Name
    //       ];
    //     skillMatrix.capability = JSON.parse(
    //       item[CONST.Lists.SkillsMatrix.Columns.Capability.Internal_Name]
    //     );
    //     skillMatrix.chapter =
    //       item["FieldValuesAsText"][
    //         CONST.Lists.SkillsMatrix.Columns.Chapter.Internal_Name
    //       ];
    //     skillMatrix.squad =
    //       item[CONST.Lists.SkillsMatrix.Columns.Squad.Internal_Name];
    //     skillMatrix.title =
    //       item[CONST.Lists.SkillsMatrix.Columns.Title.Internal_Name];
    //     localSkillsMatrix.push(skillMatrix);
    //   });
    //   // Loop through each user and filter by capabitity and push it to Items state
    //   localSkillsMatrix.map(skillMatrix => {
    //     if (skillMatrix.capability) {
    //       skillMatrix.capability.map(singleCapability => {
    //         let _singleItem = this._allItems.filter(
    //           item => item["key"] === singleCapability.key
    //         );
    //         _singleItem[0][skillMatrix.member] = singleCapability.value;
    //         this._allItems.some(item => {
    //           if (item["key"] === singleCapability.key) {
    //             item[skillMatrix.member] = singleCapability.value;
    //             return true;
    //           }
    //         });
    //         this._columns.some(item => {
    //           if (item.name === skillMatrix.member) {
    //             item.key = skillMatrix.itemID;
    //             return true;
    //           }
    //         });
    //       });
    //     }
    //   });
    //   console.log("Faz-Log: componentDidMount -> this._allItems", this._allItems);
    // }
    // const fetchedState = update(this.state, {
    //   items: { $set: this._allItems },
    //   isFetched: { $set: true },
    //   columns: { $set: this._columns }
    // });
    // this.setState(fetchedState);
  }

  public render(): JSX.Element {
    return (
      <div>
        <Label>{this.props.chapter}</Label>
        <ShimmeredDetailsList
          selectionMode={SelectionMode.none}
          items={this.state.items}
          columns={this.state.columns}
          shimmerLines={5}
          enableShimmer={!this.state.isFetched}
          onRenderDetailsFooter={footerProps =>
            this._onRenderSkillsMatrixFooter(footerProps)
          }
        />
        <SkillMatrixPanel
          isOpen={this.state.isEditPanelOpened}
          isCapability={false}
          values={null}
        />
      </div>
    );
  }

  private _onRenderSkillsMatrixFooter(
    detailsHeaderProps: IDetailsFooterProps
  ): JSX.Element {
    detailsHeaderProps.columns.map(col => (col.isResizable = true));
    return (
      <DetailsRow
        {...detailsHeaderProps}
        columns={detailsHeaderProps.columns}
        item={{}}
        itemIndex={
          detailsHeaderProps.columns ? detailsHeaderProps.columns.length : null
        }
        onRenderItemColumn={(item, index, column) =>
          this._renderDetailsFooterItemColumn(item, index, column)
        }
      />
    );
  }

  private _renderDetailsFooterItemColumn(
    item: any,
    index: number,
    column: IColumn
  ) {
    return (
      <div>
        {(_canUserEdit(column.key) || this.props.isLead) && (
          <Link
            onClick={() => {
              this.setState({
                isEditPanelOpened: false
              });
            }}
          >
            <Icon iconName="Edit" className="grid-icon" />
            <br />
            {column.name + " "}
          </Link>
        )}
      </div>
    );
  }
}

function _canUserEdit(key: string): boolean {
  if (_currentUser && _currentUser["Title"]) {
    const isLead: boolean = compareTwoArray([_currentUser["Title"]], [key]);
    const isCurrentMemeber: boolean = compareTwoArray(
      [_currentUser["Title"]],
      [key]
    );
    if (isLead || isCurrentMemeber) {
      return true;
    }
  }
  return false;
}
