// components/SideMenuContent.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const SideMenuContent = ({ navigation }) => {
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View>
      <Text>Side Menu Content</Text>
      <Button title="Home" onPress={() => navigateToScreen('Home')} />
      {/* Add more buttons for other screens */}
    </View>
  );
};

export default SideMenuContent;
