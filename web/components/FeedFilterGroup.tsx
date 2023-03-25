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
import { Dispatch } from "react";
import Select from "react-select";
import { Filter, FilterGroup, Option, SelectedFilters } from "./Feed";

function FeedFilterGroup(props: {
  key: string;
  filterGroup: FilterGroup;
  selectedFilters: SelectedFilters<Filter>;
  setSelectedFilters: Dispatch<{
    type: string;
    filter: Filter;
    ind: number;
    event: Option[];
  }>;
}) {
  const { filterGroup, selectedFilters, setSelectedFilters } = props;

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
                      options={f.options}
                      value={f.options.reduce((arr: Option[], val) => {
                        if (selectedFilters[f.key].includes(val)) {
                          arr.push(val);
                        }
                        return arr;
                      }, [])}
                      isMulti
                      closeMenuOnSelect={false}
                      onChange={(event: any) => {
                        setSelectedFilters({
                          type: "dropdown",
                          filter: f,
                          ind: 0,
                          event: event,
                        });
                      }}
                    />
                  </Flex>
                ) : (
                  f.options.map((val, ind) => {
                    return (
                      <Checkbox
                        key={val.label}
                        color="#3F3F3F"
                        isChecked={selectedFilters[f.key].some(
                          (e: Option) =>
                            e.value == f.options[ind].value &&
                            e.label == f.options[ind].label
                        )}
                        onChange={() => {
                          setSelectedFilters({
                            type: "checkbox",
                            filter: f,
                            ind: ind,
                            event: [],
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
                    setSelectedFilters({
                      type: "dropdown",
                      filter: f,
                      ind: 0,
                      event: [],
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
                    setSelectedFilters({
                      type: "dropdown",
                      filter: f,
                      ind: 0,
                      event: f.options.map((val) => val),
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
