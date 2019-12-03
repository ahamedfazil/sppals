import * as React from "react";
import { sp } from "@pnp/sp";
import styles from "./TeamsSkillsMatrix.module.scss";
import update from "immutability-helper";
import {
  ITeamsSkillsMatrixProps,
  ITeamsSkillsMatrixState
} from "../models/ITeamsSkillsMatrix";
import ChapterNavigation from "./ChapterNavigation";
import { isArray } from "@pnp/common";
import { IChapter } from "../models/IChapter";
import { CONST } from "../utils/Const";

export default class TeamsSkillsMatrix extends React.Component<
  ITeamsSkillsMatrixProps,
  ITeamsSkillsMatrixState
> {
  constructor(props: ITeamsSkillsMatrixProps) {
    super(props);
    this.state = {
      isFetched: false,
      isError: null,
      chapterInfo: [],
      currentUser: null
    };
  }

  public async componentDidMount() {
    // Fetch Chapters Info
    const currentUser = await sp.web.currentUser.get();

    const chapterItems = await sp.web.lists
      .getByTitle(CONST.Lists.Chapters.ListName)
      .items.expand("FieldValuesAsText")
      .get();

    if (chapterItems && isArray(chapterItems)) {
      console.log("Faz-Log: componentDidMount -> chapterItems", chapterItems);
      let localChapters: IChapter[] = [];
      chapterItems.map(item => {
        let localChapter: IChapter = {
          members: [],
          leads: [],
          title: "",
          capabilities: []
        };
        localChapter.members = item["FieldValuesAsText"][
          CONST.Lists.Chapters.Columns.Members.Internal_Name
        ].split(";");
        localChapter.leads = item["FieldValuesAsText"][
          CONST.Lists.Chapters.Columns.Leads.Internal_Name
        ].split(";");
        localChapter.title =
          item[CONST.Lists.Chapters.Columns.Title.Internal_Name];
        localChapter.capabilities = JSON.parse(
          item[CONST.Lists.Chapters.Columns.Capabilities.Internal_Name]
        );
        localChapters.push(localChapter);
      });
      const fetchedState = update(this.state, {
        chapterInfo: { $push: localChapters },
        isFetched: { $set: true },
        currentUser: { $set: currentUser }
      });
      this.setState(fetchedState);
    }
  }

  public render(): React.ReactElement<ITeamsSkillsMatrixProps> {
    return (
      <div>
        {this.state.isFetched && "Welcome " + this.state.currentUser["Title"]}
        {this.state.isFetched && (
          <ChapterNavigation
            chapters={this.state.chapterInfo}
            currentUser={this.state.currentUser}
          />
        )}
      </div>
    );
  }
}
