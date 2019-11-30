import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
  DetailsRow
} from "office-ui-fabric-react/lib/DetailsList";
import { Label } from "office-ui-fabric-react/lib/Label";
import { sp, CamlQuery } from "@pnp/sp";
import { CONST } from "../utils/const";
import { isArray } from "@pnp/common";
import { ISkillMatrix } from "../models/ISkillMatrix";
import update from "immutability-helper";

export interface ISkillMatrixItem {
  key: number;
  name: string;
  value: number;
}

interface ISkillsMatrixGridProps {
  label: string;
  members: string[];
}

export interface ISkillsMatrixGridState {
  items: ISkillMatrixItem[];
}

export class SkillsMatrixGrid extends React.Component<
  ISkillsMatrixGridProps,
  ISkillsMatrixGridState
> {
  private _selection: Selection;
  private _allItems: ISkillMatrixItem[];
  private _columns: IColumn[];

  constructor(props: ISkillsMatrixGridProps) {
    super(props);

    this.state = {
      items: []
    };

    // Populate with items for demos.
    this._allItems = [];
    for (let i = 0; i < 5; i++) {
      this._allItems.push({
        key: i,
        name: "Item " + i,
        value: i
      });
    }
    this._columns = [
      {
        key: "capabilities",
        name: "Capabilities",
        fieldName: "Capabilities",
        minWidth: 200,
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
          maxWidth: 200,
          isResizable: true
        };
      })
    );

    this.state = {
      items: this._allItems
    };
  }

  public async componentDidMount() {
    // Get skill matrix - Fetch SkillMatrix list based on Chapter

    let queryCondition: CamlQuery = {
      ViewXml: `<View><Query><Where>
      <Eq>
                          <FieldRef Name='${CONST.Lists.SkillsMatrix.Columns.Chapter.Internal_Name}' />
                          <Value Type='Text'>${this.props.label}</Value>
                        </Eq>
      </Where></Query></View>`
    };
    const skillsItems = await sp.web.lists
      .getByTitle(CONST.Lists.SkillsMatrix.ListName)
      .getItemsByCAMLQuery(queryCondition, "FieldValuesAsText");
    // .items.select(CONST.Lists.SkillsMatrix.Columns.Member.Internal_Name).expand("FieldValuesAsText")
    // .get();

    if (skillsItems && isArray(skillsItems)) {
      console.log("Faz-Log: componentDidMount -> skillsItems", skillsItems);
      let localSkillsMatrix: ISkillMatrix[] = [];
      skillsItems.map(item => {
        let skillMatrix: ISkillMatrix = {
          member: null,
          title: "",
          capability: [],
          squad: "",
          chapter: ""
        };
        skillMatrix.member =
          item["FieldValuesAsText"][
            CONST.Lists.SkillsMatrix.Columns.Member.Internal_Name
          ];
        skillMatrix.capability =
          item[CONST.Lists.SkillsMatrix.Columns.Capability.Internal_Name];
        skillMatrix.chapter =
          item["FieldValuesAsText"][
            CONST.Lists.SkillsMatrix.Columns.Chapter.Internal_Name
          ];
        skillMatrix.squad =
          item[CONST.Lists.SkillsMatrix.Columns.Squad.Internal_Name];
        skillMatrix.title =
          item[CONST.Lists.SkillsMatrix.Columns.Title.Internal_Name];
        localSkillsMatrix.push(skillMatrix);
      });
      console.log(
        "Faz-Log: componentDidMount -> localSkillsMatrix",
        localSkillsMatrix
      );
      const fetchedState = update(this.state, {
        items: { $push: localSkillsMatrix }
      });
      this.setState(fetchedState);
    }
  }

  public render(): JSX.Element {
    const { items } = this.state;

    return (
      <div>
        <Label>{this.props.label}</Label>
        <DetailsList
          items={items}
          columns={this._columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selection={this._selection}
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="Row checkbox"
          onItemInvoked={this._onItemInvoked}
          onRenderDetailsFooter={this._onRenderSkillsMatrixFooter}
        />
      </div>
    );
  }

  private _onRenderSkillsMatrixFooter(detailsFooterProps: any): JSX.Element {
    return (
      <DetailsRow
        {...detailsFooterProps}
        columns={detailsFooterProps.columns}
        item={{}}
        itemIndex={-1}
        onRenderItemColumn={_renderDetailsFooterItemColumn}
      />
    );
  }

  private _onItemInvoked = (item: ISkillMatrixItem): void => {
    alert(`Item invoked: ${item.name}`);
  };
}

function _renderDetailsFooterItemColumn(
  item: any,
  index: number,
  column: IColumn
) {
  return <div>{column.name}</div>;
}
