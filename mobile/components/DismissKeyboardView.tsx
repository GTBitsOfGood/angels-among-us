import React, { FC, ReactNode, PropsWithChildren } from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";

const DismissKeyboardView: FC<PropsWithChildren> = (props) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View {...props}>{props.children as ReactNode}</View>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;
