// src/components/EventCard.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

export default function EventCard({ event, onPress, onEdit, onDelete, onFavorite, currentUserId }) {
  const isOwner = currentUserId === event.ownerId;

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Title>{event.title}</Title>
        <Paragraph>{event.date} • {event.location}</Paragraph>
        <Paragraph numberOfLines={2} style={{ marginTop: 8 }}>{event.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" compact onPress={onFavorite}>Fav</Button>
        {isOwner && <Button mode="contained" onPress={onEdit} style={styles.button}>Edit</Button>}
        {isOwner && <Button mode="text" textColor="red" onPress={onDelete}>Delete</Button>}
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 12,
  },
  button: {
    marginLeft: 8,
  }
});
