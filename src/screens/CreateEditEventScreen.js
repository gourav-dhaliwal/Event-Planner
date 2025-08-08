// src/screens/CreateEditEventScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { validateTitle, validateDate, validateLocation } from '../utils/validators';

export default function CreateEditEventScreen({ route, navigation }) {
  const eventId = route.params?.eventId;
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      getDoc(doc(db, 'events', eventId)).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDate(data.date);
          setLocation(data.location);
          setDescription(data.description || '');
        }
      }).finally(() => setLoading(false));
    }
  }, [eventId]);

  const onSave = async () => {
    if (!validateTitle(title)) return Alert.alert('Title is required');
    if (!validateDate(date)) return Alert.alert('Date must be valid and future');
    if (!validateLocation(location)) return Alert.alert('Location is required');

    const eventData = {
      title,
      date,
      location,
      description,
      updatedAt: serverTimestamp(),
      ownerId: auth.currentUser.uid,
    };

    setLoading(true);

    try {
      if (eventId) {
        await updateDoc(doc(db, 'events', eventId), eventData);
      } else {
        await setDoc(doc(db, 'events', Date.now().toString()), {
          ...eventData,
          createdAt: serverTimestamp(),
        });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error saving event', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>{eventId ? 'Edit Event' : 'Create Event'}</Title>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
          mode="outlined"
          placeholder="e.g. 2025-12-31"
        />
        <TextInput
          label="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
        />
        <Button
          mode="contained"
          onPress={onSave}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Save Event
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 20,
  },
});
