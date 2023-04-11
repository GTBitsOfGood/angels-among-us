import React, { useState } from "react";
import {
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
} from "@chakra-ui/react";

interface Props<T> {
  // val: T;
  setVal: React.Dispatch<React.SetStateAction<T>>;
}

function Picker<T>(props: Props<T>) {
  // const { val, setVal } = props;
  const { setVal } = props;
  return (
    <Slider
      defaultValue={1}
      min={0}
      max={2}
      step={1}
      onChangeEnd={(value) => {
        setVal(value as T);
      }}
    >
      <SliderMark value={0} mt="2" ml="-1" fontSize="xs">
        {/* <Text color={val === 0 ? "black" : "gray"}>no</Text> */}
        no
      </SliderMark>
      <SliderMark value={1} mt="2" ml="-1.5rem" fontSize="xs">
        {/* <Text color={val === 1 ? "black" : "gray"}>unknown</Text> */}
        unknown
      </SliderMark>
      <SliderMark value={2} mt="2" ml="-2" fontSize="xs">
        {/* <Text color={val === 2 ? "black" : "gray"}>yes</Text> */}
        yes
      </SliderMark>
      <SliderTrack bg="#D5E7F5">
        <SliderFilledTrack bg="#D5E7F5" />
      </SliderTrack>
      <SliderThumb bg="#57A0D5" />
    </Slider>
  );
}

export default Picker;
