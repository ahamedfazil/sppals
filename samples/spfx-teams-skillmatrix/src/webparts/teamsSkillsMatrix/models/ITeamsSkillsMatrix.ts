import { IChapter } from "./IChapter";
import { CurrentUser } from "@pnp/sp/src/siteusers";

export interface ITeamsSkillsMatrixProps {
  title: string;
  subTitle: string;
  siteTabTitle: string;
  description: string;
}

export interface ITeamsSkillsMatrixState {
  isFetched: boolean;
  chapterInfo : IChapter[];
  isError: any;
  currentUser: CurrentUser;
}