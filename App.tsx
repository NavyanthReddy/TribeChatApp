import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { fetchParticipants, fetchLatestMessages } from './utils/api';
import { useChatStore, Message, Participant } from './stores/chatStore';

export default function App() {
  const messages = useChatStore((state) => state.messages);
  const participants = useChatStore((state) => state.participants);
  const setMessages = useChatStore((state) => state.setMessages);
  const setParticipants = useChatStore((state) => state.setParticipants);

  useEffect(() => {
  const loadData = async () => {
    try {
      const participantData = await fetchParticipants();
      const rawMessages = await fetchLatestMessages();

      // Transform the raw message to fit our expected structure
      const mappedMessages: Message[] = rawMessages.map((msg: any) => ({
        ...msg,
        id: msg.uuid,
        senderUuid: msg.authorUuid,
        timestamp: msg.sentAt,
      }));

      setParticipants(participantData);
      setMessages(mappedMessages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  loadData();
}, []);


  const renderMessage = ({ item }: { item: Message }) => {
  console.log('Full message:', item); // 👈 ADD HERE

  const sender = participants[item.senderUuid];
  const time = new Date(item.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });


    return (
      <View style={styles.messageContainer}>
        <View style={styles.header}>
          {sender?.avatar && (
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{sender.avatar}</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.sender}>{sender?.name ?? 'Unknown'}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>

        <Text style={styles.messageText}>
          {item.text} {item.edited ? <Text style={styles.edited}>(edited)</Text> : null}
        </Text>

        {item.reactions && Object.keys(item.reactions).length > 0 && (
          <View style={styles.reactionRow}>
            {Object.entries(item.reactions).map(([emoji, users]) => (
              <View key={`${emoji}-${item.id}`} style={styles.reactionBubble}>

                <Text>
                  {emoji} {users.length}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
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
  messageContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  headerInfo: {
    flexDirection: 'column',
  },
  sender: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 10,
    color: '#777',
  },
  messageText: {
    fontSize: 14,
    marginTop: 4,
  },
  edited: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  reactionRow: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  reactionBubble: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 16,
    marginRight: 6,
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
