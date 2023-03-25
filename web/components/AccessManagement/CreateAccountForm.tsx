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
  FormControl,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { HydratedDocument } from "mongoose";

interface PropertyType {
  accountList: HydratedDocument<IAccount>[];
  updateAccountList: Dispatch<SetStateAction<HydratedDocument<IAccount>[]>>;
  updateSelectItems: Dispatch<SetStateAction<boolean>>;
}

export default function CreateAccountForm(props: PropertyType) {
  const { accountList, updateAccountList, updateSelectItems } = props;
  const [emailField, setEmailField] = useState("");
  const [role, setRole] = useState(Role.Volunteer);
  const [displayError, setDisplayError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = trpc.account.add.useMutation();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setEmailField(event.target.value);
  }

  function validateEmail({ emailField }: { emailField: string }): boolean {
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(emailField);
    return result.success;
  }

  const updateAccountsHandler = () => {
    const isValid = validateEmail({ emailField });
    if (!isValid) {
      setDisplayError(true);
      setErrorMessage("Invalid email address");
      return;
    }

    const newAccount = {
      email: emailField,
      role: role,
    } as HydratedDocument<IAccount>;

    mutation.mutate(newAccount, {
      onSuccess: () => {
        setDisplayError(false);
        const temp = [...accountList];
        temp.unshift(newAccount);
        updateAccountList(temp);
        setEmailField("");
        setRole(Role.Volunteer);
        setDisplayError(false);
      },
      onError: (error) => {
        setDisplayError(true);
        setErrorMessage(error.message);
      },
    });
  };

  return (
    <>
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
        <Text
          fontSize="20"
          fontWeight="500"
          lineHeight="24px"
          paddingBottom={4}
        >
          Add New Account
        </Text>
        <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} gap={4} width="inherit">
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
                  maxW={"379px"}
                />
                <Alert status="error">
                  <AlertIcon />
                  {errorMessage}
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
                maxW={"379px"}
              />
            )}
          </FormControl>
          <Flex flexDirection="column" alignItems="flex-end" gap={4}>
            <Flex direction={"row"} gap={2} alignItems="center" flexWrap="wrap">
              <Text lineHeight="22px" fontSize="18px" fontWeight="400">
                Add Permission:
              </Text>
              <AddPermissionSelector
                role={role}
                setRole={setRole}
              ></AddPermissionSelector>
            </Flex>
            <Box
              as={"button"}
              width={{ sm: "133px", lg: "250px" }}
              height="35px"
              bgColor="#B0B0B0"
              boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
              borderRadius="16px"
              onClick={updateAccountsHandler}
              disabled={mutation.isLoading}
            >
              <Text fontWeight="500" fontSize={"16px"} lineHeight={"19px"}>
                Add Account
              </Text>
            </Box>
          </Flex>
        </SimpleGrid>
      </Flex>
    </>
  );
}
