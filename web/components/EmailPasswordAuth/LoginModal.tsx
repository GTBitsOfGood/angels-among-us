import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Divider,
  Flex,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../utils/firebase/firebaseClient";
import ForgotPasswordModal from "./ForgotPasswordModal";

interface EmailPasswordAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailPasswordAuthModal: React.FC<EmailPasswordAuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen: isForgotPasswordOpen,
    onOpen: openForgotPassword,
    onClose: closeForgotPassword,
  } = useDisclosure();
  const toast = useToast();
  // const router = useRouter();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Send verification email for new users
        await sendEmailVerification(user);

        toast({
          title: "Account created successfully!",
          description:
            "A verification email has been sent to your email address. Please verify your email before signing in.",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // The auth context will handle redirection if email is not verified
      }
      handleClose();
    } catch (error: any) {
      setIsLoading(false);
      toast({
        title: "Authentication Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isSignUp ? "Sign Up" : "Sign In"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                  />
                </FormControl>
                {!isSignUp && (
                  <Flex justifyContent="flex-end">
                    <Link
                      color="blue.500"
                      fontSize="sm"
                      onClick={openForgotPassword}
                    >
                      Forgot Password?
                    </Link>
                  </Flex>
                )}
                {isSignUp && (
                  <FormControl id="confirmPassword" isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="********"
                    />
                  </FormControl>
                )}
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  loadingText="Submitting"
                  width="100%"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
              </Stack>
            </form>
            <Flex align="center" my={4}>
              <Divider flex="1" />
              <Text px={3} color="gray.500" fontSize="sm">
                OR
              </Text>
              <Divider flex="1" />
            </Flex>
            <Button variant="outline" width="100%" onClick={toggleAuthMode}>
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={closeForgotPassword}
        onBackToLogin={closeForgotPassword}
      />
    </>
  );
};

export default EmailPasswordAuthModal;
