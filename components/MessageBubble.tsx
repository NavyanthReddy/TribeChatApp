// components/MessageBubble.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

export const MessageBubble = ({ message }: { message: any }) => {
  const isYou = message.authorUuid === 'you';
  const time = new Date(Number(message.sentAt)).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.bubble, isYou ? styles.bubbleRight : styles.bubbleLeft]}>
      <Text style={styles.senderName}>{isYou ? 'You' : message.senderDisplayName}</Text>
      <Text style={styles.bubbleText}>{message.text}</Text>
      <Text style={styles.timestamp}>{time}</Text>
    </View>
  );
};
