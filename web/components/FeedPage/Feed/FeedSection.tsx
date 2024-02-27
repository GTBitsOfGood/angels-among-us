import { AddIcon } from "@chakra-ui/icons";
import {
  Flex,
  Button,
  Text,
  Stack,
  Spinner,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "../../../context/auth";
import { Role } from "../../../utils/types/account";
import { IFeedPost } from "../../../utils/types/post";
import FeedCoveredDropdown from "../CoveredDropdown";
import FeedPostCard from "./FeedPostCard";

interface Props {
  coveredState: boolean | undefined;
  draftState: boolean | undefined;
  handleCoveredChange: (
    covered: boolean | undefined,
    draft: boolean | undefined
  ) => void;
  onPostCreationOpen: () => void;
  isLoading: boolean;
  feedPosts: IFeedPost[] | undefined;
}
function FeedSection(props: Props) {
  const {
    coveredState,
    draftState,
    handleCoveredChange,
    onPostCreationOpen,
    isLoading,
    feedPosts,
  } = props;

  console.log(feedPosts);

  const { userData } = useAuth();
  const role = userData?.role;

  return (
    <Grid
      w="100%"
      h="100%"
      templateRows={{ base: "1fr 60px", lg: "40px 1fr" }}
      borderRadius={{ base: "0px", lg: "10px" }}
      bgColor={{ base: "white", lg: "#F9F8F8" }}
      alignItems="center"
      paddingX={{ base: 0, lg: 4 }}
      py={4}
      gap={4}
    >
      <GridItem
        display={{ base: "none", lg: "flex" }}
        flexDir="row"
        w="100%"
        h="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center" w="100%" direction="row">
          <Text fontWeight="bold" fontSize="20px" pr={3}>
            Latest Posts
          </Text>
          <Flex
            display={{
              base: "none",
              md:
                role === Role.Admin || role === Role.ContentCreator
                  ? "flex"
                  : "none",
            }}
          >
            <FeedCoveredDropdown
              displayCovered={coveredState}
              displayDraft={draftState}
              handleCoveredChange={handleCoveredChange}
            />
          </Flex>
        </Flex>
        {(role === Role.Admin || role === Role.ContentCreator) && (
          <Flex display={{ base: "none", lg: "flex" }} zIndex={1} w="auto">
            <Button
              variant="solid-primary"
              leftIcon={<AddIcon />}
              onClick={onPostCreationOpen}
              w="100%"
            >
              Add new post
            </Button>
          </Flex>
        )}
      </GridItem>
      <GridItem
        w="100%"
        h="100%"
        display="flex"
        justifyContent="center"
        overflowY="auto"
      >
        {isLoading ? (
          <Spinner mt={5} size="xl" />
        ) : (
          <>
            {feedPosts!.length === 0 ? (
              <Text pt={5} w="100%" textAlign="center">
                No results found.
              </Text>
            ) : (
              <Stack overflowY="auto" spacing={4} w="100%">
                {feedPosts!.map((p) => {
                  return (
                    <Link
                      key={p._id.toString()}
                      href={`/post/${p._id.toString()}`}
                    >
                      <FeedPostCard post={p} />
                    </Link>
                  );
                })}
              </Stack>
            )}
          </>
        )}
      </GridItem>
      <GridItem w="100%" h="100%" display={{ base: "flex", lg: "none" }}>
        <Flex pt={4} w="100%">
          <Button
            variant="solid-primary"
            leftIcon={<AddIcon />}
            onClick={onPostCreationOpen}
            w="100%"
          >
            Add new post
          </Button>
        </Flex>
      </GridItem>
    </Grid>
  );
}

export default FeedSection;
