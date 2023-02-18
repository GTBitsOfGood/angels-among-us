import styles from "./AccessManagementPage.module.css";
import { Role } from "../../utils/types/account";
import { ButtonGroup, Button, Text } from "@chakra-ui/react";

interface PropertyType {
  role: Role;
  setRole: Function;
}

export default function PermissionSelector(props: PropertyType) {
  const { role, setRole } = props;
  const styleUnselected = styles.unselectedPermission.toString();
  const styleSelected = styles.selectedPermission.toString();
  const tstyleUnselected = styles.tunselectedPermission.toString();
  const tstyleSelected = styles.tselectedPermission.toString();

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Button
        className={`${role == Role.Admin ? styleSelected : styleUnselected}`}
        onClick={() => setRole(Role.Admin)}
        borderRadius="12px 0px 0px 12px"
        border="1px solid black"
      >
        <Text
          className={`${
            role == Role.Admin ? tstyleSelected : tstyleUnselected
          }`}
        >
          Administrator
        </Text>
      </Button>
      <Button
        className={`${
          role == Role.ContentCreator ? styleSelected : styleUnselected
        }`}
        onClick={() => setRole(Role.ContentCreator)}
        border="1px solid black"
      >
        <Text
          className={`${
            role == Role.ContentCreator ? tstyleSelected : tstyleUnselected
          }`}
        >
          Content Creator
        </Text>
      </Button>
      <Button
        className={`${
          role == Role.Volunteer ? styleSelected : styleUnselected
        }`}
        onClick={() => setRole(Role.Volunteer)}
        borderRadius="0px 12px 12px 0px"
        border="1px solid black"
      >
        <Text
          className={`${
            role == Role.Volunteer ? tstyleSelected : tstyleUnselected
          }`}
        >
          Volunteer
        </Text>
      </Button>
    </ButtonGroup>
  );
}
