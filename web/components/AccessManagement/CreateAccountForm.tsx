import { z } from "zod";
import { Dispatch, SetStateAction, useState } from "react";
import AddPermissionSelector from "./AddPermissionSelector";
import { ChangeEvent } from "react";
import { Role } from "../../utils/types/account";
import { IAccount } from "../../utils/types/account";
import { trpc } from "../../utils/trpc";

import {
  Input,
  Text,
  Flex,
  SimpleGrid,
  Box,
  Divider,
  FormControl,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

interface PropertyType {
  accountList: IAccount[];
  updateAccountList: Dispatch<SetStateAction<IAccount[]>>;
  updateSelectItems: Dispatch<SetStateAction<boolean>>;
}

export default function CreateAccountForm(props: PropertyType) {
  const { accountList, updateAccountList, updateSelectItems } = props;
  const [emailField, setEmailField] = useState("");
  const [role, setRole] = useState(Role.Volunteer);
  const [displayError, setDisplayError] = useState(false);

  const mutation = trpc.account.add.useMutation();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailField(event.target.value);
  }

  function validateEmail({ emailField }: { emailField: string }): boolean {
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(emailField);
    return result.success;
  }

  //TODO add a DB call here with trpc
  function updateState() {
    const isValid = validateEmail({ emailField });
    if (isValid) {
      setDisplayError(false);
      const newAccount = {
        email: emailField,
        role: role,
      };

      mutation.mutate(newAccount);
      if (mutation.data) {
        const temp = [...accountList];
        temp.unshift(newAccount);
        updateAccountList(temp);
        setEmailField("");
        setRole(Role.Volunteer);
        setDisplayError(false);
      }
    } else {
      setDisplayError(true);
    }
  }

  return (
    <Flex
      direction="column"
      bgColor="#FFFFFF"
      border="solid"
      borderRadius="30px"
      borderWidth="2px"
      borderColor="#BBBBBB"
      alignItems="center"
      paddingX={6}
      paddingTop={4}
      paddingBottom={4}
      margin={{ sm: "12px", lg: "40px" }}
      marginTop={{ sm: "6px", lg: "20px" }}
      onClick={() => {
        updateSelectItems(false);
      }}
    >
      <Text fontSize="md" fontWeight="regular" lineHeight="24px">
        Add New Account
      </Text>
      <Divider
        color="#000000"
        orientation="horizontal"
        height=".5px"
        marginBottom={3}
        marginTop={3}
      />
      <SimpleGrid columns={{ sm: 1, md: 2 }} gap={4} width="inherit">
        <FormControl>
          {displayError ? (
            <div>
              <Input
                isInvalid
                errorBorderColor="crimson"
                placeholder="Email"
                value={emailField}
                onChange={handleChange}
                borderRadius="16px"
                bgColor="#D9D9D9"
                height="36px"
              />
              <Alert status="error">
                <AlertIcon />
                Invalid Email Address
              </Alert>
            </div>
          ) : (
            <Input
              variant="filled"
              type="text"
              placeholder="Email"
              bgColor="#D9D9D9"
              value={emailField}
              onChange={handleChange}
              borderRadius="16px"
              height="36px"
            />
          )}
        </FormControl>
        <Flex flexDirection="column" alignItems="flex-end" gap={4}>
          <Flex direction={"row"} gap={2} alignItems="center" flexWrap="wrap">
            <Text lineHeight="22px" fontSize="md" fontWeight="400">
              Add Permission:
            </Text>
            <AddPermissionSelector
              role={role}
              setRole={setRole}
            ></AddPermissionSelector>
          </Flex>
          <Box
            as={"button"}
            width={{ sm: "130px", lg: "248px" }}
            height="35px"
            bgColor="#B0B0B0"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
            onClick={updateState}
            disabled={mutation.isLoading}
          >
            Add Account
          </Box>
        </Flex>
      </SimpleGrid>
    </Flex>
  );
}
