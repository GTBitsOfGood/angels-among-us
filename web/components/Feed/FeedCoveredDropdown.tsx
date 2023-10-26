import { Dispatch, SetStateAction } from "react";
import Select from "react-select";

const showingMap: Map<boolean | undefined, string> = new Map([
  [undefined, "all posts"],
  [true, "only covered posts"],
  [false, "only uncovered posts"],
]);

const allDropdownOptions = Array.from(showingMap.entries()).map(([k, v]) => ({
  value: k,
  label: v,
}));

function FeedCoveredDropdown(props: {
  displayCovered: boolean | undefined;
  setDisplayCovered: Dispatch<SetStateAction<boolean | undefined>>;
}) {
  const { displayCovered, setDisplayCovered } = props;

  const placeholder = `Showing ${showingMap.get(displayCovered)}`;

  return (
    <Select
      controlShouldRenderValue={false}
      placeholder={placeholder}
      isSearchable={false}
      isClearable={false}
      menuPortalTarget={document.body}
      styles={{
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
        menuPortal: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
        control: (baseStyles) => ({
          ...baseStyles,
          minWidth: 200,
          border: "1px solid #D9D9D9",
          boxShadow: "none",
          "&:hover": { border: "1px solid gray" },
          borderRadius: "10px",
          padding: 0,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? "#57a0d5" : "white",
          "&:hover": { backgroundColor: "#c6e3f9" },
          fontSize: "14px",
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          fontSize: "14px",
        }),
      }}
      options={allDropdownOptions.filter(
        (option) => option.value !== displayCovered
      )}
      onChange={(event) => {
        setDisplayCovered(event!.value);
      }}
    />
  );
}

export default FeedCoveredDropdown;
