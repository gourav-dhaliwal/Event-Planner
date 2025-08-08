import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  arrayRemove,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import EventCard from '../components/EventCard';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      where('favoritedBy', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const favEvents = [];
      querySnapshot.forEach((docSnap) => {
        favEvents.push({ id: docSnap.id, ...docSnap.data() });
      });
      setFavorites(favEvents);
    });

    return unsubscribe;
  }, [user.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const removeFromFavorites = async (eventId) => {
    const eventRef = doc(db, 'events', eventId);
    try {
      await updateDoc(eventRef, {
        favoritedBy: arrayRemove(user.uid)
      });
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#6200ee' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Favorite Events" />
      </Appbar.Header>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No favorite events yet.</Text>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            currentUserId={user.uid}
            onPress={() =>
              navigation.navigate('EventDetail', { eventId: item.id })
            }
            onEdit={() => {}}
            onDelete={() => onDelete(item.id)}
            onFavorite={() => removeFromFavorites(item.id)}
          />
        )}
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666'
  }
});
