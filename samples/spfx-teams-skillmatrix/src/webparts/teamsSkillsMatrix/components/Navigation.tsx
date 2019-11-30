import * as React from "react";
import { Label, ILabelStyles } from "office-ui-fabric-react/lib/Label";
import { Pivot, PivotItem } from "office-ui-fabric-react/lib/Pivot";
import { IStyleSet } from "office-ui-fabric-react/lib/Styling";
import { IChapter } from "../models/IChapter";
import { SkillsMatrixGrid } from "./SkillsMatrixGrid";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 }
};

interface IChapterNavigationProps {
  chapters: IChapter[];
}

export default class ChapterNavigation extends React.Component<
  IChapterNavigationProps,
  {}
> {
  public render(): React.ReactElement<IChapterNavigationProps> {
    console.log(this.props.chapters);
    return (
      <Pivot>
        {this.props.chapters.map(chap => {
          return (
            <PivotItem headerText={chap.title}>
              <div>
                <SkillsMatrixGrid label={chap.title} members={chap.members} />
              </div>
            </PivotItem>
          );
        })}
        {/* <PivotItem
          headerText="My Files"
          headerButtonProps={{
            "data-order": 1,
            "data-title": "My Files Title"
          }}
        >
          <Label styles={labelStyles}>Pivot #1</Label>
        </PivotItem>
        <PivotItem headerText="Recent">
          <Label styles={labelStyles}>Pivot #2</Label>
        </PivotItem>
        <PivotItem headerText="Shared with me">
          <Label styles={labelStyles}>Pivot #3</Label>
        </PivotItem> */}
      </Pivot>
    );
  }
}
