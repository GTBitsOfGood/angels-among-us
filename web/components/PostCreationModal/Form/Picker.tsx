import React, { useState } from "react";
import {
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Box,
  Center,
  Circle,
} from "@chakra-ui/react";
import { Action, FormState } from "../PostCreationModal";
import { Trained } from "../../../utils/types/post";

type Props<
  T extends Extract<
    keyof FormState,
    | "houseTrained"
    | "crateTrained"
    | "spayNeuterStatus"
    | "getsAlongWithMen"
    | "getsAlongWithWomen"
    | "getsAlongWithOlderKids"
    | "getsAlongWithYoungKids"
    | "getsAlongWithLargeDogs"
    | "getsAlongWithSmallDogs"
    | "getsAlongWithCats"
  >
> = {
  field: T;
  val: FormState[T];
  // val: Trained;
  dispatchFormState: React.Dispatch<Action<T, FormState[T]>>;
};

function convertStep(num: number) {
  switch (num) {
    case 0:
      return Trained.No;
    case 1:
      return Trained.Unknown;
    case 2:
      return Trained.Yes;
  }
}

function Picker<
  T extends Extract<
    keyof FormState,
    | "houseTrained"
    | "crateTrained"
    | "spayNeuterStatus"
    | "getsAlongWithMen"
    | "getsAlongWithWomen"
    | "getsAlongWithOlderKids"
    | "getsAlongWithYoungKids"
    | "getsAlongWithLargeDogs"
    | "getsAlongWithSmallDogs"
    | "getsAlongWithCats"
  >
>(props: Props<T>) {
  const { field, val, dispatchFormState } = props;

  return (
    <Center ml={2} mr={3.5} mt={2}>
      <Slider
        defaultValue={1}
        min={0}
        max={2}
        step={1}
        onChange={(value) => {
          dispatchFormState({
            type: "setField",
            key: field,
            data: convertStep(value) as FormState[T],
          });
        }}
      >
        <SliderMark value={0}>
          <Box position="absolute" top="-1.5px" left="0.5px" zIndex={2}>
            <Circle size="3px" bg="#57A0D5" />
            <Text
              fontSize="xs"
              mt={1.5}
              position="relative"
              left={-1}
              color={val === Trained.No ? "black" : "gray"}
            >
              no
            </Text>
          </Box>
        </SliderMark>
        <SliderMark value={1}>
          <Box position="absolute" top="-1.5px" left="-1.5px" zIndex={2}>
            <Circle size="3px" bg="#57A0D5" />
            <Text
              fontSize="xs"
              mt={1.5}
              position="relative"
              left={-5}
              color={val === Trained.Unknown ? "black" : "gray"}
            >
              unknown
            </Text>
          </Box>
        </SliderMark>
        <SliderMark value={2}>
          <Box position="absolute" top="-1.5px" left="-3.75px" zIndex={2}>
            <Circle size="3px" bg="#57A0D5" />
            <Text
              fontSize="xs"
              mt={1.5}
              position="relative"
              left={-1.5}
              color={val === Trained.Yes ? "black" : "gray"}
            >
              yes
            </Text>
          </Box>
        </SliderMark>
        <SliderTrack bg="#D5E7F5" zIndex={1}>
          <SliderFilledTrack bg="#D5E7F5" />
        </SliderTrack>
        <SliderThumb bg="#57A0D5" />
      </Slider>
    </Center>
  );
}

export default Picker;
