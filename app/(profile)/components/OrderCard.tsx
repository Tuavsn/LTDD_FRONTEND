import { OrderState } from '@/constants/Enum';
import { Order } from '@/constants/Types';
import { formatDate, maximizeString } from '@/utils/string.utils';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';

interface OrderCardProps {
  order: Order;
  onPressDetails: () => void;
  onPressCancel: () => void;
}

const OrderCard = ({ order, onPressDetails, onPressCancel }: OrderCardProps) => {
  return (
    <Card style={styles.card}>
      <View style={styles.rowContainer}>
        {/* Left side: Order image */}
        <Card.Cover
          source={{ uri: order.items[0].image[0].url }}
          style={styles.image}
        />

        {/* Right side: Order Information */}
        <View style={styles.infoContainer}>
          <Title style={styles.title}>
            {maximizeString(order.items.reduce((acc, p, i) => acc + p.name + (i < order.items.length - 1 ? " + " : ""), ""), 20)}
          </Title>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Tổng cộng: ${order.totalPrice.toFixed(2)}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={{ ...styles.detailText, fontWeight: 700 }}>{OrderState[order.state]}</Text>
          </View>

          <Text style={styles.date}>Đã đặt vào: {formatDate(order.createdAt)}</Text>
        </View>
      </View>

      {/* Card Action */}
      <Card.Actions style={styles.actions}>
        {(order.state === 'new' || order.state === 'pending' || order.state === 'accepted') && (
          <Button onPress={onPressCancel} mode="outlined" color="red">
            <Text style={{ color: 'red' }}>
              Hủy đơn hàng
            </Text>
          </Button>
        )}
        <Button onPress={onPressDetails}>View Details</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 8,
    width: '100%',
    overflow: 'hidden',
    elevation: 3,
    padding: 10,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 140,
    height: 140,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  infoContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 4,
    fontSize: 16,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
});

export default OrderCard;
