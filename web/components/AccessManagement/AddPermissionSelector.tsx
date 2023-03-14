import { Role } from "../../utils/types/account";
import { ButtonGroup, Button, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PropertyType {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
}

export default function PermissionSelector(props: PropertyType) {
  const { role, setRole } = props;

  let buttonSelected = {
    bgColor: "#a9a8a8",
  };

  let buttonUnselected = {
    bgColor: "#ffffff",
  };

  let textSelected = {
    color: "#ffffff",
  };

  let textUnselected = {
    color: "#000000",
  };

  let a = role === Role.Admin;
  let c = role === Role.ContentCreator;
  let v = role === Role.Volunteer;

  let textStyle = {
    lineHeight: "19px",
    fontSize: "16px",
    fontWeight: "400",
  };

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Button
        bgColor={a ? buttonSelected.bgColor : buttonUnselected.bgColor}
        onClick={() => setRole(Role.Admin)}
        borderRadius="12px 0px 0px 12px"
        border="1px solid black"
      >
        <Text
          lineHeight={textStyle.lineHeight}
          fontSize={textStyle.fontSize}
          fontWeight={textStyle.fontWeight}
          color={a ? textSelected.color : textUnselected.color}
        >
          Administrator
        </Text>
      </Button>
      <Button
        bgColor={c ? buttonSelected.bgColor : buttonUnselected.bgColor}
        onClick={() => setRole(Role.ContentCreator)}
        border="1px solid black"
      >
        <Text
          lineHeight={textStyle.lineHeight}
          fontSize={textStyle.fontSize}
          fontWeight={textStyle.fontWeight}
          color={c ? textSelected.color : textUnselected.color}
        >
          Content Creator
        </Text>
      </Button>
      <Button
        bgColor={v ? buttonSelected.bgColor : buttonUnselected.bgColor}
        onClick={() => setRole(Role.Volunteer)}
        borderRadius="0px 12px 12px 0px"
        border="1px solid black"
      >
        <Text
          lineHeight={textStyle.lineHeight}
          fontSize={textStyle.fontSize}
          fontWeight={textStyle.fontWeight}
          color={v ? textSelected.color : textUnselected.color}
        >
          Volunteer
        </Text>
      </Button>
    </ButtonGroup>
  );
}
