import { IUser } from "../../utils/types/user";
import { Box, Flex, Text } from "@chakra-ui/react";
import ApproveSelector from "./ApproveSelector";
import { trpc } from "../../utils/trpc";

interface PropertyType {
  user: IUser;
}

function RequestedUserCard(props: PropertyType) {
  const { user } = props;

  const mutation = trpc.user.delete.useMutation();
  const utils = trpc.useUtils();

  const handleDecline = (requestedUser: IUser) => {
    mutation.mutate(requestedUser.uid, {
      onSuccess() {
        utils.user.invalidate();
      },
    });
  };

  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={2}
      h="100%"
    >
      <Flex flex={1} h="100%" alignItems="center">
        <Text fontWeight="medium" fontSize="md" wordBreak="break-all">
          {user.email}
        </Text>
      </Flex>
      <ApproveSelector requestedUser={user} />
      <Box
        as="button"
        bgColor="tag-primary-bg"
        borderRadius={8}
        paddingX={2}
        alignItems="center"
        justifyContent="center"
        onClick={() => handleDecline(user)}
      >
        Decline
      </Box>
    </Flex>
  );
}

export default RequestedUserCard;
