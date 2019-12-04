import * as React from "react";
import {
  IColumn,
  DetailsRow,
  SelectionMode,
  IDetailsFooterProps
} from "office-ui-fabric-react/lib/DetailsList";
import {
  Label,
  Link,
  Icon,
  ShimmeredDetailsList
} from "office-ui-fabric-react";
import update from "immutability-helper";
import { CurrentUser } from "@pnp/sp/src/siteusers";
import { compareTwoArray } from "../utils/Utilities";
import SkillMatrixPanel from "./SkillMatrixPanel";
import { getAllSkillMatrixByChapter } from "../services/ListServices";
import {
  skillMatixInitialColumnSetter,
  skillMatixColumnSetter,
  skillMatrixItemSetterByCapability
} from "../services/GetterSetter";
import { ICapability } from "../models/ISkillMatrix";

interface ISkillsMatrixGridProps {
  chapter: string;
  members: string[];
  isLead: boolean;
  currentUser: CurrentUser;
  capabilities: ICapability[];
}

export interface ISkillsMatrixGridState {
  items: any[];
  columns: IColumn[];
  isFetched: boolean;
  isEditPanelOpened?: boolean;
  error?: any;
}

export class SkillsMatrixGrid extends React.Component<
  ISkillsMatrixGridProps,
  ISkillsMatrixGridState
> {
  constructor(props: ISkillsMatrixGridProps) {
    super(props);
    this.state = {
      items: [],
      isFetched: false,
      columns: skillMatixInitialColumnSetter(this.props.members)
    };
  }

  public async componentDidMount() {
    // Get skill matrix - Fetch SkillMatrix list based on Chapter
    let availableSkillMatrixItems: any[] = [];
    let updatedState: any = null;
    if (this.props.capabilities) {
      this.props.capabilities.map(capbility => {
        availableSkillMatrixItems.push({
          key: capbility.key,
          capability: capbility.name
        });
      });
    }
    const responseSkillsMatrixItems = await getAllSkillMatrixByChapter(
      this.props.chapter,
      this.props.capabilities
    );
    if (responseSkillsMatrixItems) {
      availableSkillMatrixItems = skillMatrixItemSetterByCapability(
        responseSkillsMatrixItems,
        availableSkillMatrixItems
      );
      const updateColumns = skillMatixColumnSetter(
        this.state.columns,
        responseSkillsMatrixItems
      );
      console.log("Faz-Log: componentDidMount -> availableSkillMatrixItems", availableSkillMatrixItems);
      console.log("Faz-Log: componentDidMount -> updateColumns", updateColumns);
      updatedState = update(this.state, {
        items: { $set: availableSkillMatrixItems },
        isFetched: { $set: true },
        columns: { $set: updateColumns }
      });
    } else {
      console.log("Faz-Log: componentDidMount -> No Items found");
      updatedState = update(this.state, {
        isFetched: { $set: true }
      });
    }
    this.setState(updatedState);
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
          onRenderDetailsFooter={this._onRenderSkillsMatrixFooter}
        />
        <SkillMatrixPanel
          isOpen={this.state.isEditPanelOpened}
          isCapability={false}
          values={null}
        />
      </div>
    );
  }

  private _onRenderSkillsMatrixFooter = (
    detailsHeaderProps: IDetailsFooterProps
  ): JSX.Element => {
    detailsHeaderProps.columns.map(col => (col.isResizable = true));
    return (
      <DetailsRow
        {...detailsHeaderProps}
        columns={detailsHeaderProps.columns}
        item={{}}
        itemIndex={
          detailsHeaderProps.columns ? detailsHeaderProps.columns.length : null
        }
        onRenderItemColumn={this._renderDetailsFooterItemColumn}
      />
    );
  };

  private _renderDetailsFooterItemColumn = (
    item: any,
    index: number,
    column: IColumn
  ) => {
    return (
      <div>
        {(this._canUserEdit(column.fieldName) || this.props.isLead) && (
          <Link
            onClick={() => {
              console.log(column.key);
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
  };

  private _canUserEdit = (key: string): boolean => {
    if (this.props.currentUser && this.props.currentUser["Title"]) {
      const isLead: boolean = compareTwoArray(
        [this.props.currentUser["Title"]],
        [key]
      );
      const isCurrentMemeber: boolean = compareTwoArray(
        [this.props.currentUser["Title"]],
        [key]
      );
      if (isLead || isCurrentMemeber) {
        return true;
      }
    }
    return false;
  };
}
