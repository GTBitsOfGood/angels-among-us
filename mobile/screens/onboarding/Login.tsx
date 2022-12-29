import React, { FC, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { auth } from "../../utils/firebase";
import DismissKeyboardView from "../../components/DismissKeyboardView";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ZodError, z } from "zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigatorParamList } from "../../navigation/types";
import { Screens } from "../../utils/consts";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<
  StackNavigatorParamList,
  Screens.LOGIN_SCREEN
>;

const Login: FC<Props> = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      z.string({ required_error: "Email is required" }).email().parse(email);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      if (e instanceof ZodError) {
        alert(e.issues[0].message);
      } else {
        console.error(e);
        alert("Invalid email and/or password");
      }
    }
  };

  return (
    <DismissKeyboardView>
      <KeyboardAvoidingView behavior="padding">
        <SafeAreaView style={styles.content}>
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
          </View>
          <TouchableOpacity style={styles.clickableText} onPress={() => {}}>
            <Text style={styles.primaryText}>Forgot your password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(Screens.REGISTER_SCREEN)}
          >
            <Text style={styles.ghostText}>
              Don't have an account?{" "}
              <Text style={styles.innerText}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 10,
  },
  imageContainer: {
    width: "80%",
    height: 180,
    marginBottom: 20,
  },
  logo: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    marginBottom: 5,
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
  clickableText: {
    marginBottom: 20,
  },
  primaryText: {
    color: "#50A0D5",
  },
  ghostText: {
    color: "#696A6C",
  },
  innerText: {
    color: "#50A0D5",
  },
});

export default Login;
