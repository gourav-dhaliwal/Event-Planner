import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Appbar, FAB, Text } from 'react-native-paper';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import EventCard from '../components/EventCard';

export default function DashboardScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsArray = [];
      querySnapshot.forEach((docSnap) => {
        eventsArray.push({ id: docSnap.id, ...docSnap.data() });
      });
      setEvents(eventsArray);
    });
    return unsubscribe;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const toggleFavorite = async (eventId, isFavorited) => {
    const eventRef = doc(db, 'events', eventId);
    try {
      await updateDoc(eventRef, {
        favoritedBy: isFavorited
          ? arrayRemove(user.uid)
          : arrayUnion(user.uid)
      });
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#6200ee' }}>
        <Appbar.Content title="Events" />
        <Appbar.Action
          icon="heart"
          onPress={() => navigation.navigate('Favorites')}
        />
        <Appbar.Action
          icon="logout"
          onPress={() =>
            auth.signOut().then(() => navigation.replace('SignIn'))
          }
        />
      </Appbar.Header>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No events available.</Text>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            currentUserId={user.uid}
            onPress={() =>
              navigation.navigate('EventDetail', { eventId: item.id })
            }
            onEdit={() =>
              navigation.navigate('CreateEdit', { eventId: item.id })
            }
            onDelete={() => onDelete(item.id)}
            onFavorite={() =>
              toggleFavorite(
                item.id,
                item.favoritedBy?.includes(user.uid)
              )
            }
          />
        )}
      />

      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CreateEdit')}
        style={styles.fab}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
    backgroundColor: '#f6f6f6',
    flexGrow: 1
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6200ee'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666'
  }
});
