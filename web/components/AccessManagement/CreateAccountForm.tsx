import { z } from "zod";
import { useRef, useState } from "react";
import PermissionSelector from "./PermissionSelector";
import { Role } from "../../utils/types/account";
import { IAccount } from "../../utils/types/account";
import { trpc } from "../../utils/trpc";

import {
  Flex,
  Button,
  Stack,
  useMediaQuery,
  useToast,
  Textarea,
  Text,
} from "@chakra-ui/react";
import { HydratedDocument } from "mongoose";

export default function CreateAccountForm() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [role, setRole] = useState(Role.Volunteer);
  const [isSmallerThanLg] = useMediaQuery("(max-width: 62em)");

  const toast = useToast();

  const utils = trpc.useUtils();
  const mutation = trpc.account.add.useMutation();

  function validateEmail(email: string) {
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(email);
    return result.success;
  }

  const updateAccountsHandler = () => {
    if(inputRef!.current!.value === "") {
      return;
    }
    const emails = inputRef!.current!.value.split(",");

    let errorList = [] as string[];
    //console.log("test "+ errorList.length);
    let failedList = [];
    for (let i = 0; i < emails.length; i++) {
      const isValid = validateEmail(emails[i]);
      


      if (!isValid) {
        failedList.push(emails[i]);
      } else {
        const newAccount = {
          email: emails[i],
          role: role,
        } as HydratedDocument<IAccount>;
        mutation.mutate(newAccount, {
          onSuccess: () => {
            utils.account.invalidate();
            setRole(Role.Volunteer);
          },
          onError: () => {
            errorList.push(emails[i]);
            //console.log("push " + errorList);
            //console.log(errorList.length);
          },
        });
      }

    }
    // console.log(errorList);
    
    // console.log(errorList.length);
    inputRef!.current!.value = "";

    if (failedList.length !== 0 && errorList.length !== 0) {
      let message =  "Invalid emails: ";
      for(let j = 0; j < failedList.length - 1; j++) {
        message += (failedList[j]) + ", ";
      }
      message += failedList[failedList.length - 1];
      
      message += "\nError adding emails: "
      for(let j = 0; j < errorList.length - 1; j++) {
        message += (errorList[j]) + ", ";
      }
      message += errorList[errorList.length - 1];
      
      toast({
          title: "Error",
          description: message,
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
    } else if (failedList.length !== 0) {
      let message =  "Invalid emails: ";
      for(let j = 0; j < failedList.length - 1; j++) {
        message += (failedList[j]) + ", ";
      }
      message += failedList[failedList.length - 1];
        
        toast({
            title: "Error",
            description: message,
            position: "top",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
      } else if (errorList.length !== 0) {
        let message = "Error adding emails: "
        for(let j = 0; j < errorList.length - 1; j++) {
          message += (errorList[j]) + ", ";
        }
        message += errorList[errorList.length - 1];
        
        toast({
            title: "Error",
            description: message,
            position: "top",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
      } else {
          toast({
            title: "Success",
            position: "top",
            description: "All accounts added succesfully!",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
      }
  };

  return (
    <Stack dir="column" w="100%">
      <Flex
        direction={{ base: "column", lg: "row" }}
        w="100%"
        alignItems="center"
        justifyContent="space-between"
        p={0}
        pt={4}
      >
        <Stack dir="column" w="50%">
          <Flex
            direction={{ base: "column", lg: "column" }}
            w="100%"
            alignItems="flex-start"
            justifyContent="space-between"
            p={0}
            pt={2}
          >
            <Flex pb={4}>
              <Text fontSize="sm">
                Enter one or more emails separated by commas...
              </Text>
            </Flex>
            <Textarea
              ref={inputRef}
              placeholder="Email"
              size="md"
              focusBorderColor="#57a0d5"
              maxW={{ base: "100%", lg: "80%" }}
              resize="vertical"
            />
          </Flex>
        </Stack>
        {!isSmallerThanLg && <PermissionSelector setRole={setRole} />}
      </Flex>
      <Flex
        justifyContent={{ base: "space-between", lg: "right" }}
        alignItems={{ base: "flex-end", md: "center" }}
      >
        {isSmallerThanLg && <PermissionSelector setRole={setRole} />}
        <Button variant="solid-primary" onClick={updateAccountsHandler}>
          Add Account
        </Button>
      </Flex>
    </Stack>
  );
}
