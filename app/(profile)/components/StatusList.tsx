import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface StatusListProps {
  states: Status[],
  currentState: string
  setCurrentState: (state: string) => void
}
interface Status {
  key: string
  value: string
}

const StatusList = ({ states, currentState, setCurrentState }: StatusListProps) => {

  const renderItem = ({ item }: { item: Status }) => (
    <View style={{ ...styles.item, backgroundColor: item.key === currentState ? 'rgba(222,222,222,0.8)' : 'rgba(255, 255, 255, 0.8)' }}
      onTouchEnd={() => {
        setCurrentState(item.key);
      }
      }>
      <Text style={styles.text}>{item.value}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={states}
        horizontal
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 2,
  },
  item: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    color: '#333',
    fontWeight: '500',
  },
});

export default StatusList