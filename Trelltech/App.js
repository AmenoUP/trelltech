import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, RefreshControl, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GetMemberButton from '../Trelltech/src/components/MembersButton/get_members';
import getMember from '../Trelltech/api/members/GET_member';
import HomeScreen from './src/screens/HomeScreen';
import BoardScreen from './src/screens/BoardScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TableScreen from './src/screens/TableScreen';
import CreateWorkspaceScreen from './src/screens/CreateWorkspaceScreen';
import WorkspaceDetailsScreen from './src/screens/WorkspaceDetailsScreen';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
          />
          <Stack.Screen
            name="BoardScreen"
            component={BoardScreen}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="TableScreen"
            component={TableScreen}
          />
          <Stack.Screen
            name="CreateWorkspace"
            component={CreateWorkspaceScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WorkspaceDetails"
            component={WorkspaceDetailsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const GetMemberButtonWrapper = () => {
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchMemberData = async () => {
    try {
      const data = await getMember();
      let url = '';
      if (data.avatarUrl) {
        url = data.avatarUrl;
      } else {
        url = `https://trello-members.s3.amazonaws.com/${data.id}/${data.avatarHash}/50.png`;
      }
      console.log(data);
      console.log(url);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  return (
    <GetMemberButton
      onPress={fetchMemberData}
      avatarUrl={avatarUrl}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
