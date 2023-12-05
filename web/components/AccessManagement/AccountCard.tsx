import { IAccount, roleLabels } from "../../utils/types/account";
import RoleSelector from "./RoleSelector";
import { Box, Checkbox, Flex, Text } from "@chakra-ui/react";
import { MutableRefObject } from "react";

interface PropertyType {
  account: IAccount;
  isSelecting: boolean;
  selectedAccounts: MutableRefObject<Set<string>>;
}

function AccountCard(props: PropertyType) {
  const { account, isSelecting, selectedAccounts } = props;

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={2}
      h="100%"
    >
      <Flex flex={1} h="100%" alignItems="center">
        {isSelecting ? (
          <Checkbox
            onChange={(event) => {
              if (event.target.checked) {
                selectedAccounts.current.add(account.email);
              } else {
                selectedAccounts.current.delete(account.email);
              }
            }}
          >
            <Text fontWeight="medium" fontSize="md" wordBreak="break-all">
              {account.email}
            </Text>
          </Checkbox>
        ) : (
          <Text fontWeight="medium" fontSize="md" wordBreak="break-all">
            {account.email}
          </Text>
        )}
      </Flex>
      {isSelecting ? (
        <Box
          as="button"
          bgColor="tag-primary-bg"
          borderRadius={8}
          paddingX={2}
          alignItems="center"
          justifyContent="center"
        >
          {roleLabels[account.role]}
        </Box>
      ) : (
        <RoleSelector account={account} />
      )}
    </Flex>
  );
}

export default AccountCard;
