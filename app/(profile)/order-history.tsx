import { FlatList, Platform, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StatusList from './components/StatusList'
import { OrderState } from '@/constants/Enum'
import OrderService from '@/service/order.service'
import { Order } from '@/constants/Types'
import OrderCard from './components/OrderCard'
import { router } from 'expo-router';

const OrderHistoryScreen = () => {

  const orderStates = Object.entries(OrderState).map(([key, value]) => ({
    key,
    value
  }))

  const [orderState, setOrderState] = React.useState(orderStates[0].key)
  const [orders, setOrders] = React.useState([] as Order[])
  const [displayOrders, setDisplayOrders] = React.useState([] as Order[])
  const [loading, setLoading] = React.useState(false)

  const fetchOrders = async () => {
    try {
      const orders = await OrderService.getAllOrders()
      const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setOrders(sortedOrders)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    setLoading(true)
    fetchOrders()
  }, [])

  React.useEffect(() => {
    setDisplayOrders(orders.filter(order => order.state === orderState || orderState === 'all'))
  }, [orderState, orders])

  // Tính toán thống kê dòng tiền dựa trên thuộc tính totalPrice
  const pendingConfirmationTotal = React.useMemo(() => {
    // Giả sử đơn hàng chờ xác nhận có state là 'new'
    return orders
      .filter(order => order.state === 'new')
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
  }, [orders])

  const deliveringTotal = React.useMemo(() => {
    return orders
      .filter(order => order.state === 'delivering')
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
  }, [orders])

  const deliveredTotal = React.useMemo(() => {
    return orders
      .filter(order => order.state === 'delivered')
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
  }, [orders])

  // Bổ sung thống kê cho đơn đã hủy
  const canceledTotal = React.useMemo(() => {
    return orders
      .filter(order => order.state === 'canceled')
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
  }, [orders])

  const handleCancelOrder = async (orderId: string) => {
    setLoading(true)
    try {
      const res = await OrderService.cancelOrder(orderId)
      if (res.success) {
        fetchOrders()
      } else {
        console.error(res.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Lịch Sử Đơn Hàng</Text>
      </View>

      {/* Thống kê dòng tiền */}
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>
          Đơn chờ xác nhận: {pendingConfirmationTotal.toLocaleString()} đ
        </Text>
        <Text style={styles.statText}>
          Đơn đang giao: {deliveringTotal.toLocaleString()} đ
        </Text>
        <Text style={styles.statText}>
          Đơn đã giao: {deliveredTotal.toLocaleString()} đ
        </Text>
        <Text style={styles.statText}>
          Đơn đã hủy: {canceledTotal.toLocaleString()} đ
        </Text>
      </View>

      {/* Bộ lọc trạng thái */}
      <View style={styles.statesContainer}>
        <StatusList states={orderStates} currentState={orderState} setCurrentState={setOrderState} />
      </View>

      {/* Danh sách đơn hàng (không thay đổi) */}
      <FlatList
        style={{ width: '90%' }}
        data={displayOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPressCancel={() => handleCancelOrder(item._id)}
            onPressDetails={() => router.navigate({ pathname: '/order-detail', params: { order: JSON.stringify(item) } })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true)
              fetchOrders()
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
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    width: '90%',
    paddingVertical: 12,
    marginVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    width: '90%',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  statText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
  statesContainer: {
    width: '90%',
    marginBottom: 12,
    // Nếu cần có thêm khoảng cách giữa các button của StatusList,
    // bạn có thể chỉnh sửa bên trong component StatusList hoặc thêm margin tại đây.
  },
})
