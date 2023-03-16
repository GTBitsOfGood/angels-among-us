import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
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
    if (filter.singleAnswer && tempState[filter.key].length == 1) {
      tempState[filter.key] = [];
    }
    if (tempState[filter.key].includes(filter.options[ind].value)) {
      tempState[filter.key].splice(
        tempState[filter.key].indexOf(filter.options[ind].value),
        1
      );
    } else {
      tempState[filter.key].push(filter.options[ind].value);
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
        {filterGroup.filters.map((f, groupInd) => {
          return (
            <AccordionPanel key={f.description} marginRight="40px">
              <Text>{f.description}</Text>
              <Flex
                direction="column"
                borderWidth="2px"
                borderColor="#D9D9D9"
                borderRadius="6px"
                gap="10px"
                padding="16px"
                marginTop="6px"
                paddingBottom={f.dropdown ? "320px" : "16px"}
              >
                {f.dropdown ? (
                  <Select
                    className="dropdown"
                    placeholder="Type here..."
                    styles={{
                      control: (baseStyles: any) => ({
                        ...baseStyles,
                        width: "260px",
                        fontSize: "18px",
                        border: "1px solid gray",
                        boxShadow: "none",
                        "&:hover": {
                          border: "1px solid gray",
                        },
                      }),
                    }}
                    options={f.options}
                    value={f.options.reduce(
                      (arr: { value: PossibleTypes; label: string }[], val) => {
                        if (selectedFilters[f.key].includes(val.value)) {
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
                        tempState[f.key].push(o.value);
                      });
                      setSelectedFilters(tempState);
                    }}
                  />
                ) : (
                  f.options.map((val, ind) => {
                    return (
                      <Checkbox
                        key={val.label}
                        isChecked={selectedFilters[f.key].includes(
                          f.options[ind].value
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
            </AccordionPanel>
          );
        })}
      </AccordionItem>
    </Accordion>
  );
}

export default FeedFilterGroup;
