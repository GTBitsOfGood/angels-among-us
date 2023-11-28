import { Accordion, Button, Text, Flex } from "@chakra-ui/react";
import { HandleFilterChangeActions, QueryFilter } from "../FeedPage";
import FeedFilterGroup from "./FilterGroup";
import { filterGroups } from "./filterConsts";

interface Props {
  isMobileFilterDisplayed: boolean;
  handleFilterChange: (action: HandleFilterChangeActions) => void;
  postFilterState: QueryFilter;
}
function FilterSection(props: Props) {
  const { isMobileFilterDisplayed, handleFilterChange, postFilterState } =
    props;

  return (
    <Flex
      display={{ base: isMobileFilterDisplayed ? "flex" : "none", lg: "flex" }}
      direction="column"
      w={{ base: "100%", lg: "30dvw" }}
      bgColor="white"
      borderRadius={12}
      pb={{ base: 4, lg: 0 }}
    >
      <Flex direction="column" gap={2} p={{ base: 0, lg: 4 }} pb={4}>
        <Text display={{ base: "none", lg: "block" }} fontWeight="semibold">
          Filter By:
        </Text>
        <Flex
          w="100%"
          direction={{ base: "row", lg: "column" }}
          gap={{ base: 8, lg: 2 }}
          justifyContent="space-between"
        >
          <Button
            w="100%"
            variant="outline-secondary"
            onClick={() => {
              handleFilterChange({
                type: "reset",
              });
            }}
          >
            Reset
          </Button>
          <Button
            w="100%"
            onClick={() => {
              handleFilterChange({
                type: "profileFill",
              });
            }}
            variant="solid-primary"
          >
            Fill From Profile
          </Button>
        </Flex>
      </Flex>
      <Accordion
        overflowY="auto"
        allowMultiple={true}
        defaultIndex={filterGroups.map((_, i) => i)}
      >
        {filterGroups.map((group) => {
          return (
            <FeedFilterGroup
              key={group.title}
              filterGroup={group}
              selectedFilters={postFilterState}
              handleFilterChange={handleFilterChange}
            />
          );
        })}
      </Accordion>
    </Flex>
  );
}

export default FilterSection;
