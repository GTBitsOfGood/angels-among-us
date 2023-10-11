import pageAccessHOC from "../components/HOC/PageAccess";
import Panel from "../components/Users/Panel";
import Search from "../components/Users/Search";

function Users() {
  return (
    <Panel width="80%">
      <Search />
    </Panel>
  );
}

export default pageAccessHOC(Users);
