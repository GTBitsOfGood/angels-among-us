import {
  Button,
  Flex,
  Stack,
  Text,
  IconButton,
  Input,
  Box,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";

import React from "react";
import Select from "react-select";

export default function Profile() {
  const [editing, setEditing] = React.useState(false);

  const options = [
    { value: "return", label: "Return" },
    { value: "boarding", label: "Boarding" },
    { value: "temporary", label: "Temporary" },
    { value: "foster move", label: "Foster Move" },
    { value: "shelter", label: "Shelter" },
  ];
  const options1 = [
    { value: "none", label: "None" },
    { value: "american eskimo", label: "American Eskimo" },
    { value: "whippet", label: "Whippet" },
  ];
  const options2 = [
    { value: "puppy", label: "Puppy" },
    { value: "young adult", label: "Young Adult" },
    { value: "adult", label: "Adult" },
    { value: "senior", label: "Senior" },
    { value: "mom & puppies", label: "Mom & Puppies" },
  ];
  const options3 = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
  ];
  const options4 = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "litter", label: "Litter" },
  ];
  const options5 = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "older children", label: "Older Children" },
    { value: "young children", label: "Young Children" },
    { value: "large dogs", label: "Large Dogs" },
    { value: "small dogs", label: "Small Dogs" },
    { value: "cats", label: "Cats" },
  ];
  const options6 = [
    { value: "separation anxiety", label: "Separation Anxiety" },
    { value: "barking", label: "Barking" },
    { value: "jumping", label: "Jumping" },
    { value: "flight risk", label: "Flight Risk" },
    { value: "bite risk", label: "Bite Risk" },
    { value: "pulls on leash", label: "Pulls on Leash" },
  ];
  const options7 = [
    { value: "friendly", label: "Friendly" },
    { value: "scared", label: "Scared" },
    { value: "active", label: "Active" },
    { value: "calm", label: "Calm" },
  ];
  const options8 = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  return (
    <>
      <Flex
        display={["none", "flex"]}
        minHeight="180vh"
        bgColor="#C9C9C9"
        justifyContent="center"
      >
        <Flex
          width="93%"
          marginTop="7%"
          justifyContent="center"
          alignItems="center"
          bgColor="white"
        >
          <Stack
            direction="column"
            position="absolute"
            top="150px"
            width="80%"
            spacing={5}
          >
            <Stack
              width="100%"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="2xl" fontWeight="semibold">
                Profile
              </Text>
              {editing == false && (
                <Button
                  bgColor="#BCBCBC"
                  width="6%"
                  borderRadius="16px"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )}
              {editing == true && (
                <Stack direction="row">
                  <Button
                    bgColor="#DAD8D8"
                    borderRadius="16px"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    bgColor="#BCBCBC"
                    borderRadius="16px"
                    onClick={() => setEditing(false)}
                  >
                    Save
                  </Button>
                </Stack>
              )}
            </Stack>
            <Stack direction="column">
              <Stack direction="row">
                <Text fontWeight="semibold">General Information</Text>
                {editing && (
                  <Text fontSize="larger" color="red" fontWeight="bold">
                    *
                  </Text>
                )}
              </Stack>

              <Flex border="1px solid black" padding={10}>
                <Stack
                  width="100%"
                  direction="row"
                  spacing={10}
                  alignItems="center"
                >
                  <Box bgColor="#C9C9C9" borderRadius="100%" boxSize={36}></Box>
                  {editing && (
                    <IconButton
                      icon={<EditIcon />}
                      position="absolute"
                      bgColor="white"
                      left="100px"
                      top="260px"
                      border="1px solid black"
                      borderRadius="100%"
                      boxSize={10}
                      aria-label={""}
                    ></IconButton>
                  )}
                  <Stack direction="column" width="85%" spacing={5}>
                    <Stack direction="row" spacing={5}>
                      <Stack direction="column" width="50%">
                        <Text fontWeight="medium">Name</Text>
                        {editing && (
                          <Input
                            placeholder="Firstname Lastname"
                            disabled={false}
                          ></Input>
                        )}
                        {!editing && (
                          <Input
                            placeholder="Firstname Lastname"
                            disabled={true}
                          ></Input>
                        )}
                      </Stack>
                      <Stack direction="column" width="50%">
                        <Text fontWeight="medium">Preferred Email</Text>
                        {editing && (
                          <Input
                            placeholder="example@domainname.com"
                            disabled={false}
                          ></Input>
                        )}
                        {!editing && (
                          <Input
                            placeholder="example@domainname.com"
                            disabled={true}
                          ></Input>
                        )}
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={5}>
                      <Stack direction="column" width="50%">
                        <Text fontWeight="medium">Email</Text>
                        {editing && (
                          <Input
                            placeholder="example@domainname.com"
                            disabled={false}
                          ></Input>
                        )}
                        {!editing && (
                          <Input
                            placeholder="example@domainname.com"
                            disabled={true}
                          ></Input>
                        )}
                      </Stack>
                      <Stack direction="column" width="50%">
                        <Text fontWeight="medium">
                          Which types of fosters can you help with?
                        </Text>
                        {editing && (
                          <Select
                            isDisabled={false}
                            isMulti
                            options={options}
                          />
                        )}
                        {!editing && (
                          <Select isDisabled={true} isMulti options={options} />
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
            </Stack>
            <Stack direction="column">
              <Text fontWeight="semibold">Physical Traits</Text>
              <Flex
                border="1px solid black"
                justifyContent="center"
                padding={5}
              >
                <Stack direction="column" width="90%" spacing={5}>
                  <Stack direction="row" spacing={5}>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Breed Restrictions</Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options1} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options1} />
                      )}
                    </Stack>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Age Preferences</Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options2} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options2} />
                      )}
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={5}>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Dog Size Preference</Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options3} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options3} />
                      )}
                    </Stack>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Gender Preference</Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options4} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options4} />
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
            </Stack>
            <Stack direction="column">
              <Text fontWeight="semibold">Behavioral Traits</Text>
              <Flex
                border="1px solid black"
                justifyContent="center"
                padding={5}
              >
                <Stack direction="column" width="90%" spacing={5}>
                  <Stack direction="row" spacing={5}>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs NOT good with:
                      </Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options5} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options5} />
                      )}
                    </Stack>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Able to foster dogs with:</Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options6} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options6} />
                      )}
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">Temperament Restrictions:</Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options7} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options7} />
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
            </Stack>
            <Stack direction="column">
              <Text fontWeight="semibold">Medical Information</Text>
              <Flex
                border="1px solid black"
                justifyContent="center"
                padding={5}
              >
                <Stack direction="column" width="90%" spacing={5}>
                  <Stack direction="row" spacing={5}>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs not house trained...
                      </Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options8} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options8} />
                      )}
                    </Stack>
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs not crate trained...
                      </Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options8} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options8} />
                      )}
                    </Stack>
                  </Stack>
                  <Stack direction="row">
                    <Stack direction="column" width="50%">
                      <Text fontWeight="medium">
                        Able to foster dogs not spayed or neutered...
                      </Text>
                      {editing && (
                        <Select isDisabled={false} isMulti options={options8} />
                      )}
                      {!editing && (
                        <Select isDisabled={true} isMulti options={options8} />
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
            </Stack>
          </Stack>
        </Flex>
      </Flex>
      <Flex height="100vh" display={["flex", "none"]} justifyContent="center">
        <Stack
          direction="column"
          position="absolute"
          top="100px"
          alignItems="center"
          spacing={5}
        >
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Stack direction="column">
              <Text fontWeight="bold" fontSize="2xl">
                Profile
              </Text>
              <Stack direction="row">
                <Text fontWeight="bold" fontSize="lg">
                  General Information
                </Text>
                {editing && (
                  <Text fontWeight="bold" fontSize="lg" color="red">
                    *
                  </Text>
                )}
              </Stack>
            </Stack>
            {editing && (
              <Stack direction="row">
                <Button
                  cursor="default"
                  bgColor="#DAD8D8"
                  borderRadius="16px"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>

                <Button
                  cursor="default"
                  bgColor="#C9C9C9"
                  borderRadius="16px"
                  onClick={() => setEditing(false)}
                >
                  Save
                </Button>
              </Stack>
            )}
            {!editing && (
              <Button
                cursor="default"
                bgColor="#C9C9C9"
                borderRadius="16px"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            )}
          </Stack>
          <Box bgColor="#C9C9C9" borderRadius="100%" boxSize={20}></Box>
          {editing && (
            <IconButton
              icon={<EditIcon />}
              aria-label={""}
              bgColor="white"
              borderRadius="100%"
              position="absolute"
              top="120px"
              left="170px"
            />
          )}
          <Stack direction="column" spacing={7}>
            <Stack direction="column" spacing={4}>
              <Stack direction="column">
                <Text fontWeight="medium">Name</Text>
                {editing && (
                  <Input
                    border="1px solid #D9D9D9"
                    placeholder="Firstname Lastname"
                    disabled={false}
                  ></Input>
                )}
                {!editing && (
                  <Input
                    placeholder="Firstname Lastname"
                    disabled={true}
                    border="1px solid gray"
                  ></Input>
                )}
              </Stack>
              <Stack direction="column">
                <Text fontWeight="medium">Email</Text>
                {editing && (
                  <Input
                    border="1px solid #D9D9D9"
                    placeholder="example@domainname.com"
                    disabled={false}
                  ></Input>
                )}
                {!editing && (
                  <Input
                    border="1px solid gray"
                    placeholder="example@domainname.com"
                    disabled={true}
                  ></Input>
                )}
              </Stack>
              <Stack direction="column">
                <Text fontWeight="medium">Preferred Email</Text>
                {editing && (
                  <Input
                    border="1px solid #D9D9D9"
                    placeholder="example@domainname.com"
                    disabled={false}
                  ></Input>
                )}
                {!editing && (
                  <Input
                    border="1px solid gray"
                    placeholder="example@domainname.com"
                    disabled={true}
                  ></Input>
                )}
              </Stack>
              <Stack direction="column">
                <Text fontWeight="medium">
                  Which types of fosters can you NOT help with?
                </Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options} />
                )}
              </Stack>
            </Stack>
            <Text fontSize="lg" fontWeight="bold">
              Physical Traits
            </Text>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Breed Restrictions</Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options1} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options1} />
                )}
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Dog Sizes you do NOT Prefer</Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options3} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options3} />
                )}
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Ages NOT Preferred</Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options2} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options2} />
                )}
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Genders you do NOT Prefer</Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options4} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options4} />
                )}
              </Stack>
            </Stack>
            <Text fontSize="lg" fontWeight="bold">
              Behavioral Traits
            </Text>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs NOT good with:
                </Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options5} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options5} />
                )}
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Temperament Restrictions:</Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options7} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options7} />
                )}
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">Able to foster dogs with:</Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options6} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options6} />
                )}
              </Stack>
            </Stack>
            <Text fontSize="lg" fontWeight="bold">
              Medical Information
            </Text>
            <Stack direction="column" spacing={4}>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs not house trained...
                </Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options8} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options8} />
                )}
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs not spayed or neutered...
                </Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options8} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options8} />
                )}
              </Stack>
              <Stack direction="column" width="100%">
                <Text fontWeight="medium">
                  Able to foster dogs not crate trained...
                </Text>
                {editing && (
                  <Select isDisabled={false} isMulti options={options8} />
                )}
                {!editing && (
                  <Select isDisabled={true} isMulti options={options8} />
                )}
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" paddingBottom={10}>
              {editing && (
                <>
                  <Button
                    cursor="default"
                    bgColor="#DAD8D8"
                    borderRadius="16px"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    cursor="default"
                    bgColor="#C9C9C9"
                    borderRadius="16px"
                    onClick={() => setEditing(false)}
                  >
                    Save
                  </Button>
                </>
              )}
              {!editing && (
                <Button
                  bgColor="#C9C9C9"
                  cursor="default"
                  borderRadius="16px"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
