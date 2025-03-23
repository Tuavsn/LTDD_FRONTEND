import { Cart } from "@/constants/Types";
import CartService from "@/service/cart.service";
import { api } from "@/utils/restApiUtil";
import { useUserInfoStore } from "@/zustand/user.store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar, Image, Alert } from "react-native";
import { Button, Card, TextInput, RadioButton } from "react-native-paper";

const CheckoutScreen = () => {
  const cartStr = useLocalSearchParams().cartStr;
  const cart = JSON.parse(cartStr?.toString() || "{}") as Cart;
  const user = useUserInfoStore((state) => state.auth.user);

  // Trạng thái cho thông tin giao hàng và phương thức thanh toán
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address.length ? (user.address.find(a => a.isPrimary)?.address) : "");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Tính toán tổng số lượng và tổng giá
  const totalQuantity = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.items?.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0) || 0;

  // Xử lý sự kiện thanh toán
  const handleCheckout = async () => {
    const checkoutData = { phone, address, paymentMethod };

    // Gửi dữ liệu đến server
    try {
      const res = await CartService.checkout(address!, phone, paymentMethod);

      if (res.cart) {
        Alert.alert("Thành công", "Đơn hàng của bạn đã được ghi nhận. Cảm ơn bạn đã mua hàng!");
        router.back();
      }
    }
    catch (err: any) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thực hiện thanh toán. Vui lòng thử lại sau!");
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tiêu đề chính */}
      <Text style={styles.title}>Thanh toán</Text>

      {/* Phần thông tin nhận hàng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
        <View style={styles.infoContainer}>
          <TextInput
            mode="outlined"
            label="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Địa chỉ"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
        </View>
      </View>

      {/* Phần phương thức thanh toán */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
          <View style={styles.radioButton}>
            <RadioButton value="cash" />
            <Text>Thanh toán khi nhận hàng</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton value="card" disabled />
            <Text style={{ opacity: 0.5 }}>Thẻ tín dụng</Text>
          </View>
          {/* <View style={styles.radioButton}>
            <RadioButton value="paypal" />
            <Text>PayPal</Text>
          </View> */}
        </RadioButton.Group>
      </View>

      {/* Tổng số lượng và tổng giá */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryText}>Tổng sản phẩm: {totalQuantity}</Text>
        <Text style={[styles.summaryText, styles.totalPriceText]}>
          Tổng giá: {totalPrice.toLocaleString()} VND
        </Text>
      </Card>

      {/* Danh sách sản phẩm */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={cart?.items || []}
          keyExtractor={(item) => item.product._id}
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <View style={styles.itemContent}>
                <Image
                  source={{ uri: item.product.image?.[0]?.url || "https://via.placeholder.com/100" }}
                  style={styles.itemImage}
                />
                <View style={styles.itemTextContainer}>
                  <Text style={styles.productName}>{item.product.name}</Text>
                  <Text style={styles.itemDetail}>Số lượng: {item.quantity}</Text>
                  <Text style={styles.itemDetail}>
                    Tổng: {(item.product.price * item.quantity).toLocaleString()} VND
                  </Text>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      {/* Nút thanh toán */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Thanh toán</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: "column",
    gap: 8,
  },
  input: {
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalPriceText: {
    color: "#FF5722",
  },
  itemCard: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDetail: {
    fontSize: 14,
    color: "#555",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    width: "60%",
    padding: 8,
    borderRadius: 40,
    backgroundColor: "#11EE11",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dfd",
  },
});

export default CheckoutScreen;