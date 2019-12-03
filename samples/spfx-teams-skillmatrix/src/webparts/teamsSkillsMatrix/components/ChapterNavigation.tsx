import * as React from "react";
import { Pivot, PivotItem } from "office-ui-fabric-react/lib/Pivot";
import { IChapter } from "../models/IChapter";
import { SkillsMatrixGrid } from "./SkillsMatrixGrid";
import { compareTwoArray } from "../utils/Utilities";
import { CurrentUser } from "@pnp/sp/src/siteusers";

interface IChapterNavigationProps {
  chapters: IChapter[];
  currentUser: CurrentUser;
}

export default class ChapterNavigation extends React.Component<
  IChapterNavigationProps,
  {}
> {
  public render(): React.ReactElement<IChapterNavigationProps> {
    return (
      <Pivot>
        {this.props.chapters.map(chap => {
          return (
            <PivotItem headerText={chap.title}>
              <div>
                <SkillsMatrixGrid
                  isLead={compareTwoArray([this.props.currentUser["Title"]], chap.leads)}
                  chapter={chap.title}
                  members={chap.members}
                  capabilities={chap.capabilities}
                  currentUser={this.props.currentUser}
                />
              </div>
            </PivotItem>
          );
        })}
      </Pivot>
    );
  }
}
