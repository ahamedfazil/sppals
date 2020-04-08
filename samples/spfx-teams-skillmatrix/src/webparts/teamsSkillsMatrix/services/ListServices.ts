import { sp, CamlQuery } from "@pnp/sp";
import { CONST } from "../utils/Const";
import { isArray } from "@pnp/common";
import { ISkillMatrix, ICapability } from "../models/ISkillMatrix";
import { skillMatrixSetter } from "./GetterSetter";

export const getAllSkillMatrixByChapter = async (
  chapter: string,
  capabilities: ICapability[]
): Promise<any[]> => {
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

    return skillsItems;
    if (skillsItems && isArray(skillsItems)) {
      // Loop through each user and filter by capabitity and push it to Items state
      let localSkillsMatrix: ISkillMatrix[] = skillMatrixSetter(skillsItems);
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



