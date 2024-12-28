import GroupCards from "../components/GroupCards";
import { groupList } from "../assets/groupsData.js";

export default function Groups() {
  return <GroupCards groups={groupList} />;
}
