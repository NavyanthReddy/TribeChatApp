import { useChatStore } from './stores/chatStore';
import React,{ useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, FlatList, TextInput, Text, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.removeItem('chat-storage');


export default function App() {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: '1',
        sender: 'Alice',
        text: 'This is loaded from Zustand store!',
        timestamp: Date.now(),
      });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messages}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Type a message..." />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6ff',
  },
  messages: {
    padding: 10,
  },
  messageBubble: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inputContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
});
