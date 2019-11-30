export const CONST = {
  Lists: {
    Chapters: {
      ListName: "Chapters",
      Columns: {
        Title: { Internal_Name: "Title" },
        Capabilities: { Internal_Name: "Capabilities" },
        Members: {
          pnpFieldId: "MembersId",
          pnpFieldExpandID: "Members/ID",
          pnpFieldTitle: "Members/Title",
          pnpFieldEmail: "Members/EMail",
          pnpFieldAccount: "Members/Name",
          Internal_Name: "Members"
        },
        Leads: {
          pnpFieldId: "LeadsId",
          pnpFieldExpandID: "Leads/ID",
          pnpFieldTitle: "Leads/Title",
          pnpFieldEmail: "Leads/EMail",
          pnpFieldAccount: "Leads/Name",
          Internal_Name: "Leads"
        }
      }
    },
    SkillsMatrix: {
      ListName: "SkillsMatrix",
      Columns: {
        Title: { Internal_Name: "Title" },
        Chapter: { Internal_Name: "Chapter" },
        Member: {
          Internal_Name: "Member",
          pnpFieldId: "MemberId",
          pnpFieldExpandID: "Member/ID",
          pnpFieldTitle: "Member/Title",
          pnpFieldEmail: "Member/EMail",
          pnpFieldAccount: "Member/Name",
        },
        Capability: { Internal_Name: "Capability" },
        Squad: { Internal_Name: "Squad" }
      }
    }
  }
};
