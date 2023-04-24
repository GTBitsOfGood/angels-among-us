import { Role } from "../../utils/types/account";
import { ButtonGroup, Button, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface PropertyType {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
}

export default function PermissionSelector(props: PropertyType) {
  const { role, setRole } = props;

  const a = role === Role.Admin;
  const c = role === Role.ContentCreator;
  const v = role === Role.Volunteer;

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Button
        bgColor={a ? "#529FD4" : "white"}
        onClick={() => setRole(Role.Admin)}
        borderRadius="12px 0px 0px 12px"
        border="1px solid #BBBBBB"
      >
        <Text fontSize={16} fontWeight={400} color={a ? "white" : "black"}>
          Administrator
        </Text>
      </Button>
      <Button
        bgColor={c ? "#529FD4" : "white"}
        onClick={() => setRole(Role.ContentCreator)}
        border="1px solid #BBBBBB"
      >
        <Text fontSize={16} fontWeight={400} color={c ? "white" : "black"}>
          Content Creator
        </Text>
      </Button>
      <Button
        bgColor={v ? "#529FD4" : "white"}
        onClick={() => setRole(Role.Volunteer)}
        borderRadius="0px 12px 12px 0px"
        border="1px solid #BBBBBB"
      >
        <Text fontSize={16} fontWeight={400} color={v ? "white" : "black"}>
          Volunteer
        </Text>
      </Button>
    </ButtonGroup>
  );
}
