import { FlatList, Platform, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StatusList from './components/StatusList';
import { OrderState } from '@/constants/Enum';
import OrderService from '@/service/order.service';
import { Order } from '@/constants/Types';
import OrderCard from './components/OrderCard';

const OrderHistoryScreen = () => {

  const orderStates = Object.entries(OrderState).map(([key, value]) => ({
    key,
    value
  }))

  const [orderState, setOrderState] = React.useState(orderStates[0].key);
  const [orders, setOrders] = React.useState([] as Order[]);
  const [displayOrders, setDisplayOrders] = React.useState([] as Order[]);
  const [loading, setLoading] = React.useState(false);

  const fetchOrders = async () => {
    const orders = await OrderService.getAllOrders();
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setOrders(sortedOrders);
    setLoading(false);
  }

  React.useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, []);

  React.useEffect(() => {
    setDisplayOrders(orders.filter((order) => order.state === orderState || orderState === 'all'));
  }, [orderState, orders]);

  const handleCancelOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await OrderService.cancelOrder(orderId);
      if (res.success) {
        fetchOrders();
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statesContainer}>
        <StatusList states={orderStates} currentState={orderState} setCurrentState={setOrderState} />
      </View>
      <FlatList
        style={{ width: '90%' }}
        data={displayOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderCard order={item} onPressCancel={() => handleCancelOrder(item._id)} onPressDetails={() => console.log(item)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true);
              fetchOrders();
            }}
          />
        }
        contentContainerStyle={{ display: 'flex', justifyContent: 'center', width: '95%' }}
      />
    </SafeAreaView>
  )
}

export default OrderHistoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  statesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
})
