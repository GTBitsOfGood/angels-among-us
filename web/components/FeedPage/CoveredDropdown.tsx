import Select from "react-select";

const showingMap: Map<Array<boolean | undefined>, string> = new Map([
  [[undefined, undefined], "all posts"],
  [[true, undefined], "only covered posts"],
  [[false, undefined], "only uncovered posts"],
  [[undefined, true], "only draft posts"],
]);

const allDropdownOptions = Array.from(showingMap.entries()).map(([k, v]) => ({
  value: k,
  label: v,
}));

function FeedCoveredDropdown(props: {
  displayCovered: boolean | undefined;
  displayDraft: boolean | undefined;
  handleCoveredChange: (
    covered: boolean | undefined,
    draft: boolean | undefined
  ) => void;
}) {
  const { displayCovered, displayDraft, handleCoveredChange } = props;

  const displayOptions = [displayCovered, displayDraft];
  console.log(showingMap.keys());
  console.log(showingMap.get(displayOptions));
  const placeholder = `Showing ${showingMap.get(displayOptions)}`;

  return (
    <div>
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
          (option) => option.value !== displayOptions
        )}
        onChange={(event) => {
          handleCoveredChange(event!.value[0], event!.value[1]);
        }}
      />
    </div>
  );
}

export default FeedCoveredDropdown;
