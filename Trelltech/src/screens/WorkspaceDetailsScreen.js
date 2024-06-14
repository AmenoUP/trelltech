// WorkspaceDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkspaceDetailsScreen = ({ route }) => {
  // Retrieve the workspaceId from the route params
  const { workspaceId } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workspace Details Screen</Text>
      <Text style={styles.text}>Workspace ID: {workspaceId}</Text>
      {/* Add other UI elements and functionality as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', // Set text color to black
  },
  text: {
    fontSize: 16,
    color: 'black', // Set text color to black
  },
});

export default WorkspaceDetailsScreen;
