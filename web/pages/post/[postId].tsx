import {
  ArrowBackIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Text,
  Spinner,
  useDisclosure,
  GridItem,
} from "@chakra-ui/react";
import { Types } from "mongoose";
import { useRouter } from "next/router";
import PageNotFoundError from "../../components/404";
import DeletePostModal from "../../components/PetPostModal/DeletePostModal";
import EditPostModal from "../../components/PetPostModal/EditPostModal";
import ImageSlider from "../../components/PetPostModal/ImageSlider";
import MarkCoveredModal from "../../components/PetPostModal/MarkCoveredModal";
import { useAuth } from "../../context/auth";
import { trpc } from "../../utils/trpc";
import { Role } from "../../utils/types/account";
import pageAccessHOC from "../../components/HOC/PageAccess";
import Head from "next/head";
import {
  fosterTypeLabels,
  fosterTypeDescriptions,
  ageLabels,
  breedLabels,
  genderLabels,
  sizeLabels,
  behavioralLabels,
  GoodWith,
  goodWithLabels,
  medicalLabels,
  Trained,
  temperamentLabels,
  trainedLabels,
} from "../../utils/types/post";
import FosterQuestionnaire from "../../components/PetPostModal/FosterQuestionnaire";

function PostPage() {
  const router = useRouter();
  const paramPostId = router.query.postId;

  const { userData } = useAuth();
  const role = userData?.role;

  const { data: postData, isLoading } = trpc.post.get.useQuery({
    _id: new Types.ObjectId(paramPostId as string),
  });

  const {
    isOpen: isFormViewOpen,
    onOpen: onFormViewOpen,
    onClose: onFormViewClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onDeleteConfirmationOpen,
    onClose: onDeleteConfirmationClose,
  } = useDisclosure();

  const {
    isOpen: isEditFormOpen,
    onOpen: onEditFormOpen,
    onClose: onEditFormClose,
  } = useDisclosure();

  const {
    isOpen: isCoveredConfirmationOpen,
    onOpen: onCoveredConfirmationOpen,
    onClose: onCoveredConfirmationClose,
  } = useDisclosure();

  if (isLoading) {
    return (
      <Center w="100%" h="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (
    (!paramPostId && router.isReady) ||
    !postData ||
    (role === Role.Volunteer && postData?.covered)
  ) {
    return <PageNotFoundError />;
  }

  const postId = new Types.ObjectId(postData._id);
  const {
    name,
    description,
    type,
    size,
    age,
    spayNeuterStatus,
    behavioral,
    temperament,
    medical,
    gender,
    breed,
    getsAlongWithOlderKids,
    getsAlongWithYoungKids,
    getsAlongWithLargeDogs,
    getsAlongWithSmallDogs,
    getsAlongWithWomen,
    getsAlongWithMen,
    getsAlongWithCats,
    attachments,
    crateTrained,
    houseTrained,
  } = postData;
  const coveredButtonColor = postData.covered
    ? "text-primary"
    : "text-secondary";

  const goodWithLabelMap = {
    getsAlongWithMen: GoodWith.Men,
    getsAlongWithWomen: GoodWith.Women,
    getsAlongWithOlderKids: GoodWith.OlderChildren,
    getsAlongWithYoungKids: GoodWith.YoungChildren,
    getsAlongWithLargeDogs: GoodWith.LargeDogs,
    getsAlongWithSmallDogs: GoodWith.SmallDogs,
    getsAlongWithCats: GoodWith.Cats,
  };

  const goodWithValueMap = {
    getsAlongWithMen,
    getsAlongWithWomen,
    getsAlongWithOlderKids,
    getsAlongWithYoungKids,
    getsAlongWithLargeDogs,
    getsAlongWithSmallDogs,
    getsAlongWithCats,
  };

  const getsAlongWithFields = [
    "getsAlongWithMen",
    "getsAlongWithWomen",
    "getsAlongWithOlderKids",
    "getsAlongWithYoungKids",
    "getsAlongWithLargeDogs",
    "getsAlongWithSmallDogs",
    "getsAlongWithCats",
  ];

  const goodWithFields: string[] = getsAlongWithFields
    .filter(
      (field: string) =>
        goodWithValueMap[field as keyof typeof goodWithLabelMap] === Trained.Yes
    )
    .map(
      (field) =>
        goodWithLabels[goodWithLabelMap[field as keyof typeof goodWithValueMap]]
    );

  const notGoodWithFields = getsAlongWithFields
    .filter(
      (field) =>
        goodWithValueMap[field as keyof typeof goodWithLabelMap] === Trained.No
    )
    .map(
      (field) =>
        goodWithLabels[goodWithLabelMap[field as keyof typeof goodWithValueMap]]
    );

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <Grid
        w="100%"
        h="100%"
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        templateRows={{ base: "75px 1fr 1fr 50px", md: "50px 1fr 50px" }}
        p={8}
        gap={{ base: 4, md: 8 }}
        overflow="hidden"
      >
        <GridItem
          display="flex"
          flexDir={{ base: "column", md: "row" }}
          justifyContent="space-between"
          colSpan={{ base: 1, md: 2 }}
        >
          <Button
            h={8}
            w="fit-content"
            bgColor="tag-primary-bg"
            color="text-primary"
            _hover={{ bgColor: "tag-primary-bg" }}
            leftIcon={<ArrowBackIcon />}
            id="backToFeedButton"
            onClick={() => router.back()}
          >
            Back to feed
          </Button>
          <Flex gap={5} justifyContent={{ base: "start", md: "end" }}>
            {(role === Role.Admin || role === Role.ContentCreator) && (
              <>
                <Button
                  variant="link"
                  h={8}
                  onClick={onEditFormOpen}
                  leftIcon={<EditIcon color="text-secondary" />}
                >
                  <Text textDecoration="underline" color="text-secondary">
                    Edit
                  </Text>
                </Button>
                <EditPostModal
                  isOpen={isEditFormOpen}
                  onClose={onEditFormClose}
                  postData={postData}
                  attachments={attachments}
                />
                <Button
                  variant="link"
                  h={8}
                  onClick={onCoveredConfirmationOpen}
                  leftIcon={
                    postData.covered ? (
                      <ViewIcon color={coveredButtonColor} />
                    ) : (
                      <ViewOffIcon color={coveredButtonColor} />
                    )
                  }
                >
                  <Text textDecoration="underline" color={coveredButtonColor}>
                    {postData.covered ? "Uncover Post" : "Mark as Covered"}
                  </Text>
                  <MarkCoveredModal
                    isCoveredConfirmationOpen={isCoveredConfirmationOpen}
                    onCoveredConfirmationClose={onCoveredConfirmationClose}
                    postId={postId}
                    isCovered={postData.covered}
                  />
                </Button>
                <Button
                  variant="link"
                  h={8}
                  onClick={onDeleteConfirmationOpen}
                  leftIcon={<DeleteIcon color="text-secondary" />}
                >
                  <Text textDecoration="underline" color="text-secondary">
                    Delete
                  </Text>
                </Button>
                <DeletePostModal
                  isDeleteConfirmationOpen={isDeleteConfirmationOpen}
                  onDeleteConfirmationClose={onDeleteConfirmationClose}
                  postId={postId}
                />
              </>
            )}
          </Flex>
        </GridItem>

        <GridItem
          display="flex"
          flexDir="column"
          justifyContent="center"
          alignContent="center"
          w="100%"
          bgColor="#DDDDDD"
          colSpan={1}
          borderRadius={12}
        >
          <ImageSlider attachments={attachments} />
        </GridItem>
        <GridItem
          display="flex"
          w="100%"
          maxH="100%"
          flexDir="column"
          gap={{ base: 2, md: 8 }}
          overflowY="scroll"
          colSpan={1}
        >
          <Text fontWeight="black" fontSize="4xl" letterSpacing="wide">
            {name}
          </Text>
          <Box>
            <Text fontWeight="extrabold" fontSize="xl" letterSpacing="wide">
              About
            </Text>
            <Text>{description}</Text>
            <Text>
              I am a <b>{fosterTypeLabels[type].toLowerCase()}</b> dog.{" "}
              {fosterTypeDescriptions[type]}
            </Text>
          </Box>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
            <GridItem>
              <Text fontWeight="extrabold" fontSize="xl" letterSpacing="wide">
                Main Characteristics
              </Text>
              <Text>
                <b>Gender: </b>
                {genderLabels[gender]}
              </Text>
              <Text>
                <b>Breed: </b>
                {breed.map((breed) => breedLabels[breed]).join(", ")}
              </Text>
              <Text>
                <b>Size: </b>
                {sizeLabels[size]}
              </Text>
              <Text>
                <b>Age: </b>
                {ageLabels[age]}
              </Text>
            </GridItem>
            {(behavioral.length > 0 ||
              temperament.length > 0 ||
              houseTrained !== Trained.Unknown ||
              crateTrained !== Trained.Unknown) && (
              <GridItem>
                <Text fontWeight="extrabold" fontSize="xl" letterSpacing="wide">
                  Known Behavioral Information
                </Text>
                {behavioral.length > 0 && (
                  <Text>
                    <b>Traits: </b>
                    {behavioral.map((b) => behavioralLabels[b]).join(", ")}
                  </Text>
                )}
                {temperament.length > 0 && (
                  <Text>
                    <b>Temperament: </b>
                    {temperament.map((t) => temperamentLabels[t]).join(", ")}
                  </Text>
                )}
                {houseTrained !== Trained.Unknown && (
                  <Text>
                    <b>House-trained: </b>
                    {trainedLabels[houseTrained]}
                  </Text>
                )}
                {crateTrained !== Trained.Unknown && (
                  <Text>
                    <b>Crate-trained: </b>
                    {trainedLabels[crateTrained]}
                  </Text>
                )}
              </GridItem>
            )}
            {(medical.length > 0 || spayNeuterStatus !== Trained.Unknown) && (
              <GridItem>
                <Text fontWeight="extrabold" fontSize="xl" letterSpacing="wide">
                  Known Medical Information
                </Text>
                {medical.length > 0 && (
                  <Text>
                    <b>Conditions: </b>
                    {medical.map((m) => medicalLabels[m]).join(", ")}
                  </Text>
                )}
                {spayNeuterStatus !== Trained.Unknown && (
                  <Text>
                    <b>Spayed/neutered: </b>
                    {trainedLabels[spayNeuterStatus]}
                  </Text>
                )}
              </GridItem>
            )}
            {goodWithFields.length > 0 && (
              <GridItem>
                <Text fontWeight="extrabold" fontSize="xl" letterSpacing="wide">
                  Good With
                </Text>
                {goodWithFields.map((field) => (
                  <Text key={field}>{field}</Text>
                ))}
              </GridItem>
            )}
            {notGoodWithFields.length > 0 && (
              <GridItem>
                <Text fontWeight="extrabold" fontSize="xl" letterSpacing="wide">
                  Not Good With
                </Text>
                {notGoodWithFields.map((field) => (
                  <Text key={field}>{field}</Text>
                ))}
              </GridItem>
            )}
          </Grid>
        </GridItem>

        <GridItem
          display="flex"
          flexDir="row"
          w="100%"
          justifyContent="flex-end"
          alignItems={{ base: "center", md: "flex-end" }}
          colSpan={{ base: 1, md: 2 }}
        >
          <Button
            isDisabled={postData.userAppliedTo}
            variant={
              postData.userAppliedTo ? "solid-secondary" : "solid-primary"
            }
            width={{ base: "100%", md: 200 }}
            h={12}
            fontSize="lg"
            borderRadius={12}
            onClick={onFormViewOpen}
            _hover={
              postData.userAppliedTo
                ? {}
                : {
                    borderColor: "btn-outline-primary-border",
                    color: "text-primary",
                    backgroundColor: "white",
                  }
            }
          >
            {postData.userAppliedTo ? "Applied" : "Foster Me!"}
          </Button>
        </GridItem>
      </Grid>
      <FosterQuestionnaire
        fosterType={type}
        postId={postId}
        isFormViewOpen={isFormViewOpen}
        onFormViewClose={onFormViewClose}
      />
    </>
  );
}

export default pageAccessHOC(PostPage);
