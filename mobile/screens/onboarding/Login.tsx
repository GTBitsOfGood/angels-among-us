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
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UserSchema } from "../../utils/types";
import { ZodError } from "zod";

const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      UserSchema.shape.email.parse(email);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
    } catch (e) {
      if (e instanceof ZodError) {
        alert(e.issues[0].message);
      } else {
        alert("Invalid email and/or password");
      }
    }
  };

  return (
    <View style={styles.container}>
      <DismissKeyboardView>
        <KeyboardAvoidingView behavior="padding" style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.logo}
              source={require("../../assets/aau.png")}
            />
          </View>
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
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.ghostText}>
              Don't have an account?{" "}
              <Text style={styles.innerText}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </DismissKeyboardView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 140,
    marginBottom: 50,
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
