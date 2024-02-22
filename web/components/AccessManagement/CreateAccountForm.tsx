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
  const inputRef = useRef<HTMLInputElement>(null);
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
    const isValid = validateEmail(inputRef!.current!.value);
    if (!isValid) {
      toast({
        title: "Error",
        description: "Invalid email address.",
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const newAccount = {
      email: inputRef.current?.value,
      role: role,
    } as HydratedDocument<IAccount>;

    mutation.mutate(newAccount, {
      onSuccess: () => {
        utils.account.invalidate();
        inputRef!.current!.value = "";
        setRole(Role.Volunteer);
        toast({
          title: "Success",
          position: "top",
          description: "Account added succesfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      },
      onError: (error) => {
        const message =
          error.data?.code === "UNAUTHORIZED"
            ? error.message
            : "Unable to add account. Please try again later.";
        toast({
          title: "Error",
          position: "top",
          description: message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  // const updateAccountsHandler = () => {
  //   // const emails = inputRef!.current!.value.split(",");
  //   // const emails = inputRef!.current!.value.split(",");

  //   // //let successList = [];
  //   // let failedList = [];

  //   // for (let i = 0; i < emails.length; i++) {
  //   //   const isValid = validateEmail(emails[i]);
      


  //     if (!isValid) {
  //     //   failedList.push(emails[i]);
  //       toast({
  //         title: "Error",
  //         description: "Invalid email address.",
  //         position: "top",
  //         status: "error",
  //         duration: 5000,
  //         isClosable: true,
  //       });
  //       return;
  //     }

  //     const newAccount = {
  //       email: emails[i],
  //       role: role,
  //     } as HydratedDocument<IAccount>;

  //     mutation.mutate(newAccount, {
  //       onSuccess: () => {
  //         utils.account.invalidate();
  //         inputRef!.current!.value = "";
  //         setRole(Role.Volunteer);
  //         toast({
  //           title: "Success",
  //           position: "top",
  //           description: "Account added succesfully.",
  //           status: "success",
  //           duration: 2000,
  //           isClosable: true,
  //         });
  //       },
  //       onError: (error) => {
  //         const message =
  //           error.data?.code === "UNAUTHORIZED"
  //             ? error.message
  //             : "Unable to add account. Please try again later.";
  //         toast({
  //           title: "Error",
  //           position: "top",
  //           description: message,
  //           status: "error",
  //           duration: 5000,
  //           isClosable: true,
  //         });
  //       },
  //     });
  //   }
  // };

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
