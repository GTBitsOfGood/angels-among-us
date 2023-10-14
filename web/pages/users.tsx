import pageAccessHOC from "../components/HOC/PageAccess";
import Panel from "../components/Users/Panel";
import Search from "../components/Users/Search";
import { useReducer, useState } from "react";
import Results from "../components/Users/Results";
import { SearchUsersParams } from "../db/actions/User";

export type ReducerAction = {
  type: "setField" | "clear";
  key?: keyof SearchUsersParams;
  data?: SearchUsersParams[keyof SearchUsersParams];
};

function Users() {
  const initState: SearchUsersParams = {
    // role:
    type: [],
    size: [],
    preferredBreeds: [],
    gender: [],
    age: [],
    dogsNotGoodWith: [],
    medical: [],
    behavioral: [],
  };

  const [searched, setSearched] = useState(false);
  const [filters, dispatch] = useReducer(
    (state: SearchUsersParams, action: ReducerAction) => {
      switch (action.type) {
        case "setField":
          return {
            ...state,
            [action.key!]: action.data!,
          };
        case "clear":
          return initState;
        default:
          throw Error("Unknown action.");
      }
    },
    initState
  );

  return (
    <Panel width="80%">
      {searched ? (
        <Results filters={filters} setSearched={setSearched} />
      ) : (
        <Search
          filters={filters}
          dispatch={dispatch}
          setSearched={setSearched}
        />
      )}
    </Panel>
  );
}

export default pageAccessHOC(Users);
