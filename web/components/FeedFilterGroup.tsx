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
import { Dispatch, SetStateAction } from "react";
import Select from "react-select";
import { PossibleTypes } from "../pages/onboarding";
import { Filter, FilterGroup, SelectedFilters } from "./Feed";

function FeedFilterGroup(props: {
  key: string;
  filterGroup: FilterGroup;
  selectedFilters: SelectedFilters<Filter>;
  setSelectedFilters: Dispatch<SetStateAction<SelectedFilters<Filter>>>;
}) {
  const { filterGroup, selectedFilters, setSelectedFilters } = props;

  function updateFilters(filter: Filter, ind: number) {
    let tempState = { ...selectedFilters };
    if (tempState[filter.key].includes(filter.options[ind])) {
      tempState[filter.key].splice(
        tempState[filter.key].indexOf(filter.options[ind]),
        1
      );
    } else {
      tempState[filter.key].push(filter.options[ind]);
    }
    setSelectedFilters(tempState);
    console.log(selectedFilters);
  }

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
                paddingBottom={f.dropdown ? "200px" : "16px"}
              >
                {f.dropdown ? (
                  <Flex>
                    <Select
                      className="dropdown"
                      placeholder="Type here..."
                      maxMenuHeight={180}
                      styles={{
                        control: (baseStyles: any) => ({
                          ...baseStyles,
                          minWidth: 200,
                          border: "1px solid #D9D9D9",
                          boxShadow: "none",
                          "&:hover": {
                            border: "1px solid gray",
                          },
                        }),
                      }}
                      options={f.options}
                      value={f.options.reduce(
                        (
                          arr: { value: PossibleTypes; label: string }[],
                          val
                        ) => {
                          if (selectedFilters[f.key].includes(val)) {
                            arr.push(val);
                          }
                          return arr;
                        },
                        []
                      )}
                      isMulti
                      closeMenuOnSelect={false}
                      onChange={(event: any) => {
                        let tempState = { ...selectedFilters };
                        tempState[f.key] = [];
                        event.forEach((o: any) => {
                          tempState[f.key].push(o);
                        });
                        setSelectedFilters(tempState);
                      }}
                    />
                  </Flex>
                ) : (
                  f.options.map((val, ind) => {
                    return (
                      <Checkbox
                        key={val.label}
                        color="#3F3F3F"
                        isChecked={selectedFilters[f.key].includes(
                          f.options[ind]
                        )}
                        onChange={() => {
                          updateFilters(f, ind);
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
                    let tempState = { ...selectedFilters };
                    tempState[f.key] = [];
                    setSelectedFilters(tempState);
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
                    let tempState = { ...selectedFilters };
                    tempState[f.key] = f.options.map((val) => val);
                    setSelectedFilters(tempState);
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
