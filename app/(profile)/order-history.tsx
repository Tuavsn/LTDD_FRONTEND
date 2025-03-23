// import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { strings } from '@/constants/String';

// const OrderHistoryScreen = () => {

//   const orderStates = Object.entries(strings.orderHistory.states).map(([key, value]) => ({ key, value }))
//   console.log('orderStates', orderStates)

//   return (
//     <SafeAreaView style={styles.container}>
//       <View>
//         <Text>Order History Screen</Text>
//       </View>
//       <View style={styles.statesContainer}>
//         {orderStates.map((state, index) => {
//           return (
//             <View key={state.key}>
//               <Text>{state.value}</Text>
//             </View>
//           )
//         })}
//       </View>
//     </SafeAreaView>
//   )
// }

// export default OrderHistoryScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   statesContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20
//   },
// })

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OrderHistoryScreen = () => {
  return (
    <View>
      <Text>OrderHistoryScreen</Text>
    </View>
  )
}

export default OrderHistoryScreen;

const styles = StyleSheet.create({})