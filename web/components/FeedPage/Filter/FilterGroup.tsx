import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Checkbox,
  Flex,
  Text,
} from "@chakra-ui/react";
import Select from "react-select";
import { Breed, breedLabels } from "../../../utils/types/post";
import { HandleFilterChangeActions, QueryFilter } from "../FeedPage";
import { FilterGroup, FilterKeys, FilterKeyTypeMap } from "./filterConsts";

function FeedFilterGroup(props: {
  filterGroup: FilterGroup;
  selectedFilters: QueryFilter;
  handleFilterChange: (action: HandleFilterChangeActions) => void;
}) {
  const { filterGroup, selectedFilters, handleFilterChange } = props;

  return (
    <AccordionItem w="100%">
      <AccordionButton>
        <Text fontWeight="semibold">{filterGroup.title}</Text>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel w="100%" display="flex" gap={4} flexDir="column">
        {filterGroup.filters.map((f) => {
          return (
            <Flex key={f.key} direction="column" w="100%" gap={2}>
              <Text color="#3F3F3F">{f.description}</Text>
              <Flex
                id="filterBox"
                direction="column"
                borderWidth="2px"
                borderColor="#D9D9D9"
                borderRadius="6px"
                gap={2}
                padding={4}
                paddingBottom="16px"
              >
                {f.dropdown ? (
                  <Flex>
                    <Select
                      className="dropdown"
                      controlShouldRenderValue={false}
                      placeholder={`${
                        selectedFilters[f.key].length
                      } breeds selected`} //TODO: Display # of breeds selected
                      hideSelectedOptions={false}
                      isClearable={false}
                      maxMenuHeight={180}
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
                          "&:hover": {
                            border: "1px solid gray",
                          },
                        }),
                      }}
                      options={f.options as any}
                      //TODO: Refactor to allow dropdown to not be hard-coded as Breed[]
                      value={(selectedFilters[f.key] as Breed[]).map(
                        (selected) => ({
                          value: selected,
                          label: breedLabels[selected],
                        })
                      )}
                      isMulti
                      closeMenuOnSelect={false}
                      onChange={(options) => {
                        handleFilterChange({
                          type: "dropdownChange",
                          key: f.key,
                          value: options.map((option) => option.value),
                        });
                      }}
                    />
                  </Flex>
                ) : (
                  <Flex direction="column" gap={2} maxW="100%">
                    {f.options.map((val) => {
                      return (
                        <Checkbox
                          key={val.value}
                          color="#3F3F3F"
                          isChecked={(
                            selectedFilters[
                              f.key
                            ] as FilterKeyTypeMap[FilterKeys][]
                          ).includes(val.value)}
                          onChange={(e) => {
                            handleFilterChange({
                              type: "checkboxChange",
                              key: f.key,
                              value: val.value,
                              operation: e.target.checked ? "push" : "pull",
                            });
                          }}
                        >
                          {val.label}
                        </Checkbox>
                      );
                    })}
                  </Flex>
                )}
              </Flex>
              <Flex
                display={f.dropdown ? "flex" : "none"}
                gap={2}
                width="100%"
                justifyContent="right"
              >
                <Button
                  backgroundColor="white"
                  fontWeight="normal"
                  color="#7D7E82"
                  borderWidth="1px"
                  borderColor="#D9D9D9"
                  borderRadius="4px"
                  onClick={() => {
                    handleFilterChange({
                      type: "dropdownChange",
                      key: f.key,
                      value: "",
                    });
                  }}
                >
                  Deselect All
                </Button>
                <Button
                  backgroundColor="white"
                  fontWeight="normal"
                  color="#7D7E82"
                  borderWidth="1px"
                  borderColor="#D9D9D9"
                  borderRadius="4px"
                  onClick={() => {
                    handleFilterChange({
                      type: "dropdownChange",
                      key: f.key,
                      value: f.options.map((option) => option.value),
                    });
                  }}
                >
                  Select All
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </AccordionPanel>
    </AccordionItem>
  );
}

export default FeedFilterGroup;
