import { Flex, Input, Button } from "@chakra-ui/react";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import DeletePopup from "./DeletePopup";

interface PropertyType {
  isSelecting: boolean;
  setIsSelecting: Dispatch<SetStateAction<boolean>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  selectedAccounts: MutableRefObject<Set<string>>;
}
function TableHeader(props: PropertyType) {
  const { isSelecting, setIsSelecting, search, setSearch, selectedAccounts } =
    props;

  function toggleSelect() {
    selectedAccounts.current.clear();
    setIsSelecting((current) => !current);
  }

  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-between"
      bgColor="btn-solid-primary-bg"
      paddingY={3}
      paddingX={{ base: 4, lg: 6 }}
      borderRadius={{ base: 0, lg: "12px 12px 0 0" }}
      width="100%"
      gap={2}
    >
      <Input
        size="sm"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder="Search by email..."
        bg="white"
        borderRadius={8}
        focusBorderColor="#c6e3f9"
        w="100%"
      />
      <Flex w="100%" justifyContent="flex-end">
        {isSelecting ? (
          <Flex direction="row" gap={2}>
            <Button size="sm" variant="solid-secondary" onClick={toggleSelect}>
              Cancel
            </Button>
            <DeletePopup
              selectedAccounts={selectedAccounts}
              setIsSelecting={setIsSelecting}
            />
          </Flex>
        ) : (
          <Button
            size="sm"
            borderWidth={2}
            variant="outline-primary-inverted"
            onClick={toggleSelect}
          >
            Select Accounts
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

export default TableHeader;
