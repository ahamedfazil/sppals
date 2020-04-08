import { IColumn } from "office-ui-fabric-react";
import { ISkillMatrix } from "../models/ISkillMatrix";
import { CONST } from "../utils/Const";
import { isArray } from "@pnp/common";

export const skillMatixColumnSetter = (
  availableColumn: IColumn[],
  responseSkillsItems: any[]
): IColumn[] => {
  let updatedColumn: IColumn[] = availableColumn;
  let localSkillsMatrix: ISkillMatrix[] = skillMatrixSetter(responseSkillsItems);
  localSkillsMatrix.map(skillMatrix => {
    updatedColumn.some(col => {
      if (col.name === skillMatrix.member) {
        col.key = skillMatrix.itemID;
        return true;
      }
    });
  });
  return updatedColumn;
};

export const skillMatixInitialColumnSetter = (
  members: string[]
): IColumn[] => {
  let initialColumn: IColumn[] = [
    {
      key: CONST.SkillMatrixColumn.Capabilities.key,
      name: CONST.SkillMatrixColumn.Capabilities.name,
      fieldName: CONST.SkillMatrixColumn.Capabilities.fieldName,
      minWidth: 100,
      currentWidth: 100,
      isResizable: true
    }
  ];

  initialColumn = initialColumn.concat(
    members.map(member => {
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
  return initialColumn;
};

export const skillMatrixItemSetterByCapability = (responseSkillsItems: any[], skillsMatrixItems: any[]) => {
  if (responseSkillsItems && isArray(responseSkillsItems)) {
    // Loop through each user and filter by capabitity and push it to Items state
    let localSkillsMatrix: ISkillMatrix[] = skillMatrixSetter(responseSkillsItems);
    localSkillsMatrix.map(skillMatrix => {
      if (skillMatrix.capability) {
        skillMatrix.capability.map(singleCapability => {
          let _singleItem = skillsMatrixItems.filter(
            item => item["key"] === singleCapability.key
          );
          _singleItem[0][skillMatrix.member] = singleCapability.value;
          skillsMatrixItems.some(item => {
            if (item["key"] === singleCapability.key) {
              item[skillMatrix.member] = singleCapability.value;
              return true;
            }
          });
        });
      }
    });
    return skillsMatrixItems;
  }
}

export const skillMatrixSetter = (
  responseSkillsMatrix: any[]
): ISkillMatrix[] => {
  try {
    let localSkillsMatrix: ISkillMatrix[] = [];
    responseSkillsMatrix.map((skillsItem: any) => {
      let skillMatrix: ISkillMatrix = {
        member: null,
        title: "",
        capability: [],
        squad: "",
        chapter: "",
        itemID: null
      };
      skillMatrix.itemID = skillsItem["ID"].toString();
      skillMatrix.member =
        skillsItem["FieldValuesAsText"][
          CONST.Lists.SkillsMatrix.Columns.Member.Internal_Name
        ];
      skillMatrix.capability = JSON.parse(
        skillsItem[CONST.Lists.SkillsMatrix.Columns.Capability.Internal_Name]
      );
      skillMatrix.chapter =
        skillsItem["FieldValuesAsText"][
          CONST.Lists.SkillsMatrix.Columns.Chapter.Internal_Name
        ];
      skillMatrix.squad =
        skillsItem[CONST.Lists.SkillsMatrix.Columns.Squad.Internal_Name];
      skillMatrix.title =
        skillsItem[CONST.Lists.SkillsMatrix.Columns.Title.Internal_Name];
      localSkillsMatrix.push(skillMatrix);
    });
    return localSkillsMatrix;
  } catch (error) {
    return null;
  }
};
