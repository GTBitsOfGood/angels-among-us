import React, { FC, useEffect, useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Screens } from "../utils/consts";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigatorParamList } from "../navigation/types";
import { auth } from "../utils/firebase";
import axios from "axios";
import { urls } from "../utils/urls";

type Props = NativeStackScreenProps<
  StackNavigatorParamList,
  Screens.DEV_DASHBOARD_SCREEN
>;

const DevDashboard: FC<Props> = ({ navigation }: Props) => {
  const [test, setTest] = useState<string>("");

  const handleSignOut = async () => {
    await auth.signOut();
  };

  useEffect(() => {
    setTest(urls.baseUrl);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Dev Dashboard</Text>
      <Text>{test ?? "test.name is undefined!"}</Text>
      <View>
        {Object.entries(Screens)
          .filter(
            ([key, val]) =>
              val !== Screens.LOGIN_SCREEN &&
              val !== Screens.REGISTER_SCREEN &&
              val !== Screens.DEV_DASHBOARD_SCREEN
          )
          .map(([key, val]) => (
            <TouchableOpacity
              key={key}
              style={styles.button}
              onPress={() => navigation.navigate(val)}
            >
              <Text style={styles.buttonText}>{val}</Text>
            </TouchableOpacity>
          ))}
      </View>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 40,
    fontWeight: "600",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "lightgray",
    borderRadius: 8,
    minWidth: "60%",
    marginBottom: 12,
    padding: 4,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default DevDashboard;
