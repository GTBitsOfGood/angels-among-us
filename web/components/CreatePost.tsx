import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
// import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormik } from "formik";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useFormState } from "react-use-form-state";
import {
  Age,
  FosterType,
  Gender,
  Size,
  Temperament,
} from "../utils/types/post";

// const defaultValues: FormValues = {
//   name: "",
//   description: "",
// };

export default function CreatePost() {
  const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    petKind: z.string(),
    gender: z.string(),
    age: z.string(),
    fosterType: z.string(),
    size: z.string(),
    breed: z.string(),
    temperament: z.string(),
    goodWith: z.string(),
    medical: z.string(),
    behavioral: z.string(),
    houseTrained: z.string(),
    crateTrained: z.string(),
    spayNeuterStatus: z.string(),
  });

  type FormState = z.infer<typeof formSchema>;

  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
    petKind: "",
    gender: "",
    age: "",
    fosterType: "",
    size: "",
    breed: "",
    temperament: "",
    goodWith: "",
    medical: "",
    behavioral: "",
    houseTrained: "",
    crateTrained: "",
    spayNeuterStatus: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data);
    console.log("condole");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Add a new pet</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="1000px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add A New Pet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* if it doesnt get fixed then just bring formik into return :  onSubmit={formik.handleSubmit}*/}
              <Stack>
                <FormControl>
                  <FormLabel>Name of the Pet</FormLabel>
                  <Input
                    // name="name"
                    type="name"
                    // onChange={(event) => setName(event.target.value)}
                    {...register("name")}
                  />
                </FormControl>
                <FormControl className="descriptionForm">
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="description"
                    placeholder="Type here..."
                    {...register("description")}
                  />
                </FormControl>
                <Stack direction={"row"} spacing={10}>
                  <FormControl className="petKindForm" maxW="450px">
                    <FormLabel>What kind of pet?</FormLabel>
                    <Select placeholder=" " {...register("petKind")}>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                    </Select>
                  </FormControl>
                  <FormControl className="genderForm" maxW="450px">
                    <FormLabel>Gender</FormLabel>
                    <Select placeholder=" " {...register("gender")}>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="litter">Litter</option>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction={"row"} spacing={10}>
                  <FormControl className="ageForm" maxW="450px">
                    <FormLabel>Age</FormLabel>
                    <Select placeholder=" " {...register("age")}>
                      <option value="puppy">Puppy</option>
                      <option value="young">Young</option>
                      <option value="adult">Adult</option>
                      <option value="senior">Senior</option>
                      <option value="momAndPuppies">Mom & Puppies</option>
                    </Select>
                  </FormControl>
                  <FormControl className="fosterTypeForm" maxW="450px">
                    <FormLabel>Types of Foster</FormLabel>
                    <Select placeholder=" " {...register("fosterType")}>
                      <option value="return">Return</option>
                      <option value="boarding">Boarding</option>
                      <option value="temporary">Temporary</option>
                      <option value="fosterMove">Foster Move</option>
                      <option value="shelter">Shelter</option>
                      <option value="newIntake">Owner Surrender</option>
                    </Select>
                  </FormControl>
                </Stack>
                <FormControl className="sizeForm" maxW="450px">
                  <FormLabel>Size</FormLabel>
                  <Select placeholder=" " {...register("size")}>
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                  </Select>
                </FormControl>
                <FormControl className="breedForm">
                  <FormLabel>Breed</FormLabel>
                  <Select placeholder=" " {...register("breed")}>
                    <option value="americanEskimo">American Eskimo</option>
                    <option value="australianShepherd">
                      Australian Shepherd
                    </option>
                    <option value="...">...</option>
                    <option value="whippet">Whippet</option>
                    <option value="other">Other</option>
                  </Select>
                </FormControl>
              </Stack>
              <Stack direction={"row"} spacing={10}>
                <FormControl className="temperamentForm" maxW="450px">
                  <FormLabel>Temperament</FormLabel>
                  <Select placeholder=" " {...register("temperament")}>
                    <option value="friendly">Friendly</option>
                    <option value="scared">Scared</option>
                    <option value="active">Active</option>
                    <option value="calm">Calm</option>
                  </Select>
                </FormControl>
                <FormControl className="goodWithForm" maxW="450px">
                  <FormLabel>Good with...</FormLabel>
                  <Select placeholder=" " {...register("goodWith")}>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="olderChildren">Older Children</option>
                    <option value="youngChildren">Young Children</option>
                    <option value="largeDogs">Large Dogs</option>
                    <option value="smallDogs">Small Dogs</option>
                    <option value="cats">Cats</option>
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={"row"} spacing={10}>
                <FormControl className="medicalForm" maxW="450px">
                  <FormLabel>Medical (Optional)</FormLabel>
                  <Select placeholder=" " {...register("medical")}>
                    <option value="illness">Illness</option>
                    <option value="injury">Injury</option>
                    <option value="heartworms">Heartworms</option>
                    <option value="parvo">Parvo</option>
                    <option value="chronicCondition">Chronic Condition</option>
                    <option value="pregnant">Pregnant</option>
                    <option value="nursing">Nursing</option>
                    <option value="bottleFeeding">Bottle Feeding</option>
                    <option value="hospice">Hospice</option>
                  </Select>
                </FormControl>
                <FormControl className="behavioralForm" maxW="450px">
                  <FormLabel>Behavioral</FormLabel>
                  <Select placeholder=" " {...register("behavioral")}>
                    <option value="separationAnxiety">
                      Separation Anxiety
                    </option>
                    <option value="barking">Barking</option>
                    <option value="jumping">Jumping</option>
                    <option value="flightRisk">Flight Risk</option>
                    <option value="biteRisk">Bite Risk</option>
                    <option value="pullsOnLeash">Pulls On Leash</option>
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction={"row"} spacing={10}>
                <FormControl className="houseTrainedForm" maxW="300px">
                  <FormLabel>House Trained</FormLabel>
                  <Select placeholder=" " {...register("houseTrained")}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                </FormControl>
                <FormControl className="crateTrainedForm" maxW="300px">
                  <FormLabel>Crate Trained</FormLabel>
                  <Select placeholder=" " {...register("crateTrained")}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unknown">Unknown</option>
                  </Select>
                </FormControl>
                <FormControl className="spayneuterForm" maxW="300px">
                  <FormLabel>Spay/Neuter status</FormLabel>
                  <Select placeholder=" " {...register("spayNeuterStatus")}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Next
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
