import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

export const MessageBubble = ({ message }: { message: any }) => {
  const isYou = message.senderUuid === 'you';
  return (
    <View style={[styles.bubble, isYou ? styles.bubbleYou : styles.bubbleOther]}>
      <Text style={styles.sender}>{message.senderDisplayName}</Text>
      <Text style={styles.message}>{message.text}</Text>
    </View>
  );
};
