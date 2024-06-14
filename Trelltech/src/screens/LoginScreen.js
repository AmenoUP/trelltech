import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={hidePassword}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.hideShowPassword}
        onPress={() => setHidePassword(!hidePassword)}
      >
        <Text style={styles.hideShowPasswordText}>{hidePassword ? 'Show' : 'Hide'} password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BoardScreen')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={styles.registerLink}>No account yet? register now</Text>
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
    marginBottom: 50,
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
  hideShowPassword: {
    marginBottom: 30,
  },
  hideShowPasswordText: {
    color: '#004d4d',
  }, 
  registerLink: {
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

export default LoginScreen;