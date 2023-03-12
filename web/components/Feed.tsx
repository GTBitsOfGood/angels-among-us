import {
  Button,
  Flex,
  Stack,
  Text,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  AccordionIcon,
  Card,
  Checkbox,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

function Feed(props: {
  filterDisplayed: boolean;
  setFilterDisplayed: Dispatch<SetStateAction<boolean>>;
}) {
  let { filterDisplayed, setFilterDisplayed } = props;

  const mainContent = (
    <Flex
      className="feed"
      backgroundColor="#DFDFDF"
      justifyContent="center"
      height="fit-content"
      minHeight="100vh"
    >
      <Stack
        spacing={{ base: "0px", lg: "30px" }}
        marginTop={{
          base: document.getElementById("navbar")?.offsetHeight + "px",
          lg: "100px",
        }}
        marginBottom="50px"
        marginX={{ base: "0px", lg: "40px" }}
        direction={{ base: "column", lg: "row" }}
      >
        <Flex
          display={{ base: "flex", lg: "none" }}
          backgroundColor="#FFFFFF"
          padding="10px"
          direction="row"
          justifyContent="flex-end"
        >
          <Button
            onClick={() => {
              setFilterDisplayed(!filterDisplayed);
              console.log(filterDisplayed);
            }}
            backgroundColor="#8F9294"
            color="#FFFFFF"
            fontWeight="normal"
            height="36px"
            borderRadius="10px"
          >
            Filter By
          </Button>
        </Flex>
        <Flex
          width="30%"
          borderRadius="10px"
          backgroundColor="#FFFFFF"
          direction="column"
          height="fit-content"
          display={{ base: "none", lg: "flex" }}
        >
          <Text fontWeight="semibold" margin="16px">
            Filter By:
          </Text>
          <Flex justifyContent="flex-end" margin="12px" gap="8px">
            <Button
              backgroundColor="#FFFFFF"
              fontWeight="normal"
              color="#7D7E82"
              borderWidth="1px"
              borderColor="#7D7E82"
              borderRadius="12px"
            >
              Clear All
            </Button>
            <Button
              backgroundColor="#8F9294"
              fontWeight="normal"
              color="#FFFFFF"
              borderRadius="12px"
            >
              Use My Preferences
            </Button>
          </Flex>
          <Accordion allowMultiple={true}>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  <Text fontWeight="semibold">General Information</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} marginRight="40px">
                <Text>Which types of fosters can you help with?</Text>
                <Flex
                  direction="column"
                  borderWidth="2px"
                  borderColor="#D9D9D9"
                  borderRadius="6px"
                  gap="10px"
                  padding="16px"
                  marginTop="16px"
                >
                  <Checkbox>Return</Checkbox>
                  <Checkbox>Boarding</Checkbox>
                  <Checkbox>Temporary</Checkbox>
                  <Checkbox>Foster Move</Checkbox>
                  <Checkbox>Shelter</Checkbox>
                  <Checkbox>Owner Surrender</Checkbox>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Flex>
        <Flex
          width={{ base: "100%", lg: "70%" }}
          minHeight="full"
          borderRadius={{ base: "0px", lg: "10px" }}
          backgroundColor="#C1C1C1"
          direction="column"
          alignItems="center"
          height="fit-content"
          paddingY="20px"
        >
          <Text fontWeight="bold" fontSize="18px">
            Latest Posts
          </Text>
          <Card
            margin="20px"
            marginBottom="0px"
            width="95%"
            paddingX={{ base: "12px", lg: "16px" }}
            paddingY={{ base: "16px", lg: "20px" }}
            borderRadius="14px"
          >
            <Flex gap={{ base: "15px", lg: "20px" }}>
              <Image
                minWidth={{ base: "120px", lg: "150px" }}
                width={{ base: "120px", lg: "150px" }}
                height={{ base: "120px", lg: "150px" }}
                backgroundColor="#D9D9D9"
                borderRadius="14px"
              ></Image>
              <Flex
                direction="column"
                width="80%"
                marginTop={{ base: "0px", lg: "8px" }}
                marginRight="20px"
              >
                <Text fontSize="14px">MM/DD/YYYY XX:XX PM</Text>
                <Text
                  margin="0px"
                  paddingY="0px"
                  fontWeight="bold"
                  fontSize="18px"
                >
                  Pet Name
                </Text>
                <Text
                  margin="0px"
                  backgroundColor="#C6E3F9"
                  width="fit-content"
                  paddingX="16px"
                  paddingY="4px"
                  borderRadius="20px"
                  marginTop="5px"
                  marginBottom="10px"
                  fontSize="14px"
                  fontWeight="semibold"
                >
                  Foster Move
                </Text>
                <Text fontSize="14px" lineHeight="18px" color="#656565">
                  Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit
                  amet consectetur. Lorem ipsum dolor sit amet consectetur.
                </Text>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Stack>
    </Flex>
  );

  const filter = (
    <Flex
      className="filter"
      backgroundColor="#DFDFDF"
      height="fit-content"
      minHeight="100vh"
      width="inherit"
      direction="column"
    >
      <Flex
        backgroundColor="#FFFFFF"
        padding="10px"
        direction="row"
        justifyContent="flex-end"
        marginTop={document.getElementById("navbar")?.offsetHeight + "px"}
        borderBottomWidth="2px"
        borderBottomColor="#000000"
      >
        <Button
          onClick={() => {
            setFilterDisplayed(!filterDisplayed);
            console.log(filterDisplayed);
          }}
          backgroundColor="#FFFFFF"
          color="#7D7E82"
          borderWidth="1px"
          borderColor="#7D7E82"
          fontWeight="normal"
          height="36px"
          borderRadius="10px"
        >
          Close
        </Button>
      </Flex>
      <Flex
        backgroundColor="#FFFFFF"
        direction="column"
        height="fit-content"
        width="inherit"
      >
        <Text
          fontWeight="semibold"
          margin="16px"
          marginBottom="0px"
          marginLeft="30px"
          fontSize="20px"
        >
          Filter By:
        </Text>
        <Flex justifyContent="flex-end" margin="12px" gap="8px">
          <Button
            backgroundColor="#FFFFFF"
            fontWeight="normal"
            color="#7D7E82"
            borderWidth="1px"
            borderColor="#7D7E82"
            borderRadius="12px"
          >
            Clear All
          </Button>
          <Button
            backgroundColor="#8F9294"
            fontWeight="normal"
            color="#FFFFFF"
            borderRadius="12px"
          >
            Use My Preferences
          </Button>
        </Flex>
        <Accordion allowMultiple={true}>
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <Text fontWeight="semibold">General Information</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} marginRight="40px">
              <Text>Which types of fosters can you help with?</Text>
              <Flex
                direction="column"
                borderWidth="2px"
                borderColor="#D9D9D9"
                borderRadius="6px"
                gap="10px"
                padding="16px"
                marginTop="16px"
              >
                <Checkbox>Return</Checkbox>
                <Checkbox>Boarding</Checkbox>
                <Checkbox>Temporary</Checkbox>
                <Checkbox>Foster Move</Checkbox>
                <Checkbox>Shelter</Checkbox>
                <Checkbox>Owner Surrender</Checkbox>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Flex>
  );

  return filterDisplayed ? filter : mainContent;
}

export default Feed;
