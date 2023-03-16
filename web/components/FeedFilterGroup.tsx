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
import Select from "react-select";
import { FilterGroup } from "./Feed";

function FeedFilterGroup(props: { filterGroup: FilterGroup }) {
  const { filterGroup } = props;

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
            <AccordionPanel marginRight="40px">
              <Text>{f.description}</Text>
              <Flex
                direction="column"
                borderWidth="2px"
                borderColor="#D9D9D9"
                borderRadius="6px"
                gap="10px"
                padding="16px"
                marginTop="6px"
                minHeight={f.dropdown ? "300px" : "0px"}
              >
                {f.dropdown ? (
                  <Select
                    className="dropdown"
                    maxMenuHeight={200}
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
                    isMulti
                    closeMenuOnSelect={false}
                  />
                ) : (
                  f.options.map((val) => {
                    return <Checkbox>{val.label}</Checkbox>;
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
