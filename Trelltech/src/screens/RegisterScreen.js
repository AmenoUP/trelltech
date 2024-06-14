import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="First name"
        value={surname}
        onChangeText={setSurname}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={passwordVisibility}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        onPress={() => setPasswordVisibility(!passwordVisibility)}
        style={styles.visibilityToggle}
      >
        <Text style={styles.hideShowPasswordText}>{passwordVisibility ? "Show" : "Hide"} password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BoardScreen')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('LoginScreen')}
      >
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 55,
    color: '#607058',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  visibilityToggle: {
    marginBottom: 20,
  },
  hideShowPasswordText: {
    color: '#004d4d',
    marginBottom: 15,
  }, 
  link: {
    marginTop: 20,
    color: '#454787',
  },
  button: {
    width: '60%',
    backgroundColor: '#004d4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 10, 
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
});

export default RegisterScreen;