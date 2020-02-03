import * as React from "react";
import { Link } from "office-ui-fabric-react/lib/Link";
import update from "immutability-helper";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { IFileField } from "../../../../common/services/datatypes/RenderListData";

interface ISPFieldFilesListProps {
  defaultFiles?: IFileField[];
  removeFile?: (fileVal: any) => void;
  showRemoveButton?: boolean;
  error: string;
}

export default class SPFieldFilesList extends React.Component<
  ISPFieldFilesListProps,
  {}
> {
  constructor(props: ISPFieldFilesListProps) {
    super(props);
  }
  public render(): JSX.Element {
    let fileItems: any = "";
    if (this.props.defaultFiles) {
      return (
        <div>
          {this.props.defaultFiles.map((file, index) => {
            if (!file.isRemove) {
              return (
                <div key={index}>
                  <Icon iconName="Attach" />
                  {file.isExistsInSP ? (
                    <Link href={file.rawData} target={"_blank"}>
                      {file.name}
                    </Link>
                  ) : (
                    file.name
                  )}
                  &nbsp;
                  {this.props.showRemoveButton ? (
                    <Link onClick={() => this._onFileRemoved(index)}>
                      <Icon style={{ color: "#E56081" }} iconName="Delete" />
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              );
            }
          })}
        </div>
      );
    }
    return <div>{fileItems}</div>;
  }
  private _onFileRemoved = (indexItem: any): void => {
    let existingFiles = update(this.props.defaultFiles, {
      [indexItem]: {
        isRemove: { $set: true }
      }
    });
    this.props.removeFile(existingFiles);
  }
}
