// src/screens/SignInScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text, useTheme, Title } from 'react-native-paper';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleSignIn = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.replace('Dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.card}>
            <Title style={styles.title}>Welcome Back</Title>

            <TextInput
              label="Email"
              value={email}
              mode="outlined"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              label="Password"
              value={password}
              mode="outlined"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
              mode="contained"
              onPress={handleSignIn}
              style={styles.button}
              contentStyle={{ paddingVertical: 6 }}
            >
              Sign In
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('SignUp')}
              style={{ marginTop: 12 }}
            >
              Don't have an account? Sign Up
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
  error: { color: '#d9534f', textAlign: 'center', marginBottom: 8 },
});
