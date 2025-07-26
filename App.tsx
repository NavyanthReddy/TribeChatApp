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
} from 'react-native';
import { fetchLatestMessages, postNewMessage } from './api/chatApi';
import { MessageBubble } from './components/MessageBubble';
import { styles } from './styles';

interface Message {
  uuid: string;
  text: string;
  senderUuid: string;
  senderDisplayName: string;
  timestamp: number;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = async () => {
    try {
      const data = await fetchLatestMessages();
      setMessages(data);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err);
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

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
    </SafeAreaView>
  );
}
