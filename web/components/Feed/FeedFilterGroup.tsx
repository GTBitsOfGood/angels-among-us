import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Flex,
  Text,
} from "@chakra-ui/react";
import Select from "react-select";
import { Breed, breedLabels } from "../../utils/types/post";
import { HandleFilterChangeActions, QueryFilter } from "./Feed";
import { FilterGroup, FilterKeys, FilterKeyTypeMap } from "./filterConsts";

function FeedFilterGroup(props: {
  key: string;
  filterGroup: FilterGroup;
  selectedFilters: QueryFilter;
  handleFilterChange: (action: HandleFilterChangeActions) => void;
}) {
  const { filterGroup, selectedFilters, handleFilterChange } = props;

  return (
    <Accordion allowMultiple={true}>
      <AccordionItem>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            <Text fontWeight="semibold">{filterGroup.title}</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>
        {filterGroup.filters.map((f) => {
          return (
            <AccordionPanel key={f.description} marginRight="40px">
              <Text color="#3F3F3F">{f.description}</Text>
              <Flex
                id="filterBox"
                direction="column"
                borderWidth="2px"
                borderColor="#D9D9D9"
                borderRadius="6px"
                gap="10px"
                padding="16px"
                marginTop="6px"
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
                  f.options.map((val) => {
                    return (
                      <Checkbox
                        key={val.label}
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
                  })
                )}
              </Flex>
              <Flex
                display={f.dropdown ? "flex" : "none"}
                marginTop="10px"
                gap="10px"
                width="100%"
                justifyContent="right"
              >
                <Button
                  backgroundColor="#FFFFFF"
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
                  backgroundColor="#FFFFFF"
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
            </AccordionPanel>
          );
        })}
      </AccordionItem>
    </Accordion>
  );
}

export default FeedFilterGroup;
