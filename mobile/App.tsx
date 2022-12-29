import Login from "./screens/onboarding/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Screens } from "./utils/consts";
import Register from "./screens/onboarding/Register";
import { StackNavigatorParamList } from "./navigation/types";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { auth } from "./utils/firebase";
import Posts from "./screens/posts/Posts";
import Settings from "./screens/settings/Settings";
import DevDashboard from "./screens/DevDashboard";

const Stack = createNativeStackNavigator<StackNavigatorParamList>();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isSignedIn ? (
            <>
              <Stack.Screen
                name={Screens.DEV_DASHBOARD_SCREEN}
                component={DevDashboard}
              />
              <Stack.Screen name={Screens.POSTS_SCREEN} component={Posts} />
              <Stack.Screen
                name={Screens.SETTINGS_SCREEN}
                component={Settings}
              />
            </>
          ) : (
            <>
              <Stack.Screen name={Screens.LOGIN_SCREEN} component={Login} />
              <Stack.Screen
                name={Screens.REGISTER_SCREEN}
                component={Register}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
