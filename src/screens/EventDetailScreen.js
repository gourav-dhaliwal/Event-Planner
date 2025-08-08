// src/screens/EventDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Title, Paragraph, Button } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function EventDetailScreen({ route, navigation }) {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    getDoc(doc(db, 'events', eventId)).then(docSnap => {
      if (docSnap.exists()) setEvent({ id: docSnap.id, ...docSnap.data() });
      setLoading(false);
    });
  }, [eventId]);

  if (loading) return <ActivityIndicator style={{ marginTop: 30 }} />;

  if (!event) return <Text style={{ margin: 20 }}>Event not found</Text>;

  const isOwner = user.uid === event.ownerId;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>{event.title}</Title>
      <Paragraph><Text style={styles.label}>Date:</Text> {event.date}</Paragraph>
      <Paragraph><Text style={styles.label}>Location:</Text> {event.location}</Paragraph>
      <Paragraph style={{ marginTop: 16 }}>{event.description || 'No description provided.'}</Paragraph>

      {isOwner && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('CreateEdit', { eventId })}
          style={styles.button}
        >
          Edit Event
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 30,
  },
});
