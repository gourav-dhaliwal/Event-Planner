// src/screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { validateEmail, validatePassword } from '../utils/validators';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = async () => {
    if (!validateEmail(email)) return Alert.alert('Invalid email');
    if (!validatePassword(password)) return Alert.alert('Password must be at least 6 chars');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Dashboard');
    } catch (err) {
      Alert.alert('Sign up failed', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.card}>
            <Title style={styles.title}>Create Account</Title>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              mode="outlined"
            />

            <Button mode="contained" onPress={onSignUp} style={styles.button}>
              Sign Up
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('SignIn')}
              style={{ marginTop: 12 }}
            >
              Already have an account? Sign In
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { marginBottom: 12, backgroundColor: '#fff' },
  button: { marginTop: 8 },
});
