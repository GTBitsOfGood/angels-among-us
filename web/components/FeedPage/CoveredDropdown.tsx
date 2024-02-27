import Select from "react-select";

interface PostOptions {
  covered?: boolean | undefined;
  draft?: boolean | undefined;
}

// TODO: there is probably a better way to do this than to stringify this.
const showingMap: Map<string, string> = new Map([
  [JSON.stringify({ covered: undefined, draft: undefined }), "all posts"],
  [JSON.stringify({ covered: true, draft: undefined }), "only covered posts"],
  [
    JSON.stringify({ covered: false, draft: undefined }),
    "only uncovered posts",
  ],
  [JSON.stringify({ covered: undefined, draft: true }), "only draft posts"],
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
  console.log(displayDraft);
  const displayOptions: PostOptions = {
    covered: displayCovered,
    draft: displayDraft,
  };
  console.log(JSON.stringify(displayOptions));
  const placeholder = `Showing ${showingMap.get(
    JSON.stringify(displayOptions)
  )}`;

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
          handleCoveredChange(
            JSON.parse(event!.value).covered,
            JSON.parse(event!.value).draft
          );
        }}
      />
    </div>
  );
}

export default FeedCoveredDropdown;
