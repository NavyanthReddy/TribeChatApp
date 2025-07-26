// App.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  fetchLatestMessages,
  postNewMessage,
  fetchOlderMessages,
  fetchParticipants,
} from './api/chatApi';
import { MessageBubble } from './components/MessageBubble';
import { ParticipantsPanel } from './components/ParticipantsPanel';
import { styles } from './styles';

interface Message {
  uuid: string;
  text: string;
  senderUuid: string;
  senderDisplayName: string;
  timestamp: number;
}

interface Participant {
  uuid: string;
  displayName: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const loadInitialMessages = async () => {
    setLoading(true);
    try {
      const [msgData, userData] = await Promise.all([
        fetchLatestMessages(),
        fetchParticipants(),
      ]);
      setMessages(msgData);
      setParticipants(userData);
    } catch (err) {
      console.error('❌ Failed to fetch initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const newMsg = await postNewMessage(input.trim());
      setMessages((prev) => [...prev, newMsg]);
      setInput('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error('❌ Failed to send message:', err);
    }
  };

  const handleRefresh = async () => {
    if (!messages.length) return;
    setRefreshing(true);
    try {
      const older = await fetchOlderMessages(messages[0].uuid);
      setMessages((prev) => [...older, ...prev]);
    } catch (err) {
      console.error('❌ Failed to fetch older messages:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitialMessages();

    const interval = setInterval(async () => {
      try {
        const latest = await fetchLatestMessages();
        setMessages((prev) => {
          const newMessages = latest.filter(
            (msg) => !prev.some((m) => m.uuid === msg.uuid)
          );
          return [...prev, ...newMessages];
        });
      } catch (err) {
        console.error('❌ Polling error:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setAtBottom(isBottom);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <>
          <ParticipantsPanel participants={participants} />
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.uuid}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => {
              if (atBottom) flatListRef.current?.scrollToEnd({ animated: true });
            }}
            onScroll={handleScroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}
