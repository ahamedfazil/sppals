import { sp, CamlQuery } from "@pnp/sp";
import { CONST } from "../utils/Const";
import { isArray } from "@pnp/common";
import { ISkillMatrix } from "../models/ISkillMatrix";
import { ICapabilities } from "../models/IChapter";
import { IColumn } from "office-ui-fabric-react";

export const getAllSkillMatrixByChapter = async (
  chapter: string,
  capabilities: ICapabilities[]
): Promise<ISkillMatrix[]> => {
  try {
    // Get skill matrix - Fetch SkillMatrix list based on Chapter
    let availableSkillMatrixItems: any[] = [];
    if (capabilities) {
      capabilities.map(capbility => {
        availableSkillMatrixItems.push({
          key: capbility.key,
          capability: capbility.name
        });
      });
    }

    const queryCondition: CamlQuery = {
      ViewXml: `<View><Query><Where>
                <Eq>
                    <FieldRef Name='${CONST.Lists.SkillsMatrix.Columns.Chapter.Internal_Name}' />
                    <Value Type='Text'>${chapter}</Value>
                </Eq>
            </Where></Query></View>`
    };
    const skillsItems = await sp.web.lists
      .getByTitle(CONST.Lists.SkillsMatrix.ListName)
      .getItemsByCAMLQuery(queryCondition, "FieldValuesAsText");

    if (skillsItems && isArray(skillsItems)) {
      // Loop through each user and filter by capabitity and push it to Items state
      let localSkillsMatrix: ISkillMatrix[] = skillMatrixMapper(skillsItems);
      localSkillsMatrix.map(skillMatrix => {
        if (skillMatrix.capability) {
          skillMatrix.capability.map(singleCapability => {
            let _singleItem = availableSkillMatrixItems.filter(
              item => item["key"] === singleCapability.key
            );
            _singleItem[0][skillMatrix.member] = singleCapability.value;
            availableSkillMatrixItems.some(item => {
              if (item["key"] === singleCapability.key) {
                item[skillMatrix.member] = singleCapability.value;
                return true;
              }
            });
          });
        }
      });
      return availableSkillMatrixItems;
    }
  } catch (error) {
    return null;
  }
};

const skillMatrixMapper = (skillMatrixResponse: any[]): ISkillMatrix[] => {
  try {
    let localSkillsMatrix: ISkillMatrix[] = [];
    skillMatrixResponse.map((skillsItem: any) => {
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

export const skillMatixColumnUpdater = (
  availableColumn: IColumn[],
  availableSkillMatrix: ISkillMatrix[]
): IColumn[] => {
  availableSkillMatrix.map(skillMatrix => {
    availableColumn.some(item => {
      if (item.name === skillMatrix.member) {
        item.key = skillMatrix.itemID;
        return true;
      }
    });
  });
  return availableColumn;
};
