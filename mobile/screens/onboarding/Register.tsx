import React, { FC, useState } from "react";
import DismissKeyboardView from "../../components/DismissKeyboardView";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ZodError, z } from "zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigatorParamList } from "../../navigation/types";
import { Screens } from "../../utils/consts";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";

type Props = NativeStackScreenProps<
  StackNavigatorParamList,
  Screens.REGISTER_SCREEN
>;

const registerForm = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z.string({ required_error: "Password is required" }).refine(
      (val) => {
        const match = val.match(
          `^[A-Za-z0-9~\`!@#$%^&*()-_+={}[\]|;:"<>,./?]+$`
        );
        return match && match.length > 0 && val.length >= 6;
      },
      {
        message:
          "Password must have at least 6 characters and must not include spaces",
      }
    ),
    confirm: z.string({ required_error: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const Register: FC<Props> = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirmation, setPassConfirmation] = useState("");

  const handleSignUp = async () => {
    try {
      registerForm.parse({ email, password, confirm: passConfirmation });
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (e instanceof ZodError) {
        const flattened = e.flatten().fieldErrors;
        if (flattened.email) {
          alert(flattened.email[0]);
        } else if (flattened.password) {
          alert(flattened.password[0]);
        } else {
          alert(flattened.confirm?.[0]);
        }
      } else {
        console.error(e);
        alert("An error occured");
      }
    }
  };

  return (
    <DismissKeyboardView>
      <KeyboardAvoidingView behavior="padding">
        <SafeAreaView style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            ></TextInput>
            <TextInput
              autoCorrect={false}
              secureTextEntry
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            ></TextInput>
            <TextInput
              autoCorrect={false}
              secureTextEntry
              style={styles.input}
              placeholder="Confirm your password"
              value={passConfirmation}
              onChangeText={(text) => setPassConfirmation(text)}
            ></TextInput>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(Screens.LOGIN_SCREEN)}
          >
            <Text style={styles.ghostText}>
              Have an account? <Text style={styles.innerText}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 50,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#E5E5EA",
    minWidth: "80%",
    padding: 10,
    borderRadius: 8,
    margin: 2,
  },
  button: {
    margin: 2,
    minWidth: "60%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#50A0D5",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  outlineButton: {
    backgroundColor: "white",
    borderColor: "#50A0D5",
    borderWidth: 2,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  ghostText: {
    color: "#696A6C",
  },
  innerText: {
    color: "#50A0D5",
  },
});

export default Register;
