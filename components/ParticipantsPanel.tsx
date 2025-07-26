// components/ParticipantsPanel.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

export const ParticipantsPanel = ({ participants }: { participants: any[] }) => {
  return (
    <View style={styles.participantsPanel}>
      <Text style={styles.participantsTitle}>Participants:</Text>
      <View style={styles.participantsList}>
        {participants.map((p) => (
          <Text key={p.uuid} style={styles.participantName}>
            {p.uuid === 'you' ? 'You' : p.displayName}
          </Text>
        ))}
      </View>
    </View>
  );
};
