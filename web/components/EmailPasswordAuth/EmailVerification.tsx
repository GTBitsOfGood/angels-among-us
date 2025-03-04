import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "../../context/auth";
import { useRouter } from "next/router";
import { Pages } from "../../utils/consts";
import { auth } from "../../utils/firebase/firebaseClient";

interface EmailVerificationProps {
  onVerificationComplete?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  onVerificationComplete,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // If user is verified, trigger completion callback or redirect
    if (!loading && user?.emailVerified) {
      if (onVerificationComplete) {
        onVerificationComplete();
      } else {
        router.replace(Pages.FEED);
      }
    }
  }, [user, loading, router, onVerificationComplete]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCheckVerification = async () => {
    if (user) {
      try {
        // Force token refresh to get latest emailVerified status
        await user.reload();
        const currentUser = auth.currentUser;

        if (currentUser?.emailVerified) {
          // Force a token refresh to update the ID token with the new emailVerified status
          await currentUser.getIdToken(true);

          toast({
            title: "Email verified!",
            description: "Redirecting you to the application...",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          if (onVerificationComplete) {
            onVerificationComplete();
          } else {
            router.replace(Pages.FEED);
          }
        } else {
          toast({
            title: "Email not verified",
            description: "Please check your inbox and verify your email",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error: any) {
        toast({
          title: "Error checking verification status",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;

    setIsResending(true);
    try {
      await sendEmailVerification(user);
      setCountdown(60); // 60 second cooldown

      toast({
        title: "Verification email sent",
        description: "Please check your inbox and spam folder",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error sending verification email",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsResending(false);
    }
  };

  if (loading) {
    return (
      <Container centerContent maxW="container.md" py={10}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container centerContent maxW="container.md" py={10}>
      <Flex direction="column" align="center" w="full">
        <Box p={8} shadow="lg" borderRadius="lg" bg="white" w="full" maxW="md">
          <VStack spacing={6} align="center">
            <Heading size="lg" textAlign="center">
              Verify Your Email
            </Heading>

            <Text textAlign="center">
              We&apos;ve sent a verification email to{" "}
              <strong>{user?.email}</strong>. Please check your inbox and click
              the verification link to continue.
            </Text>

            <Text fontSize="sm" color="gray.600" textAlign="center">
              If you don&apos;t see the email, check your spam folder or request
              a new verification email.
            </Text>

            <VStack spacing={4} w="full">
              <Button
                colorScheme="blue"
                w="full"
                onClick={handleCheckVerification}
              >
                I&apos;ve Verified My Email
              </Button>

              <Button
                variant="outline"
                colorScheme="blue"
                w="full"
                onClick={handleResendVerification}
                isLoading={isResending}
                isDisabled={countdown > 0}
              >
                {countdown > 0
                  ? `Resend Email (${countdown}s)`
                  : "Resend Verification Email"}
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

export default EmailVerification;
