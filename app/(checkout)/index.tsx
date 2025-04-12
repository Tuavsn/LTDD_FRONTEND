import { CartItem, Discount } from "@/constants/Types";
import CartService from "@/service/cart.service";
import OrderService from "@/service/order.service";
import { api } from "@/utils/restApiUtil";
import { useUserInfoStore } from "@/zustand/user.store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar, Image, Alert, BackHandler } from "react-native";
import { Button, Card, TextInput, RadioButton } from "react-native-paper";

const CheckoutScreen = () => {
  const cartStr = useLocalSearchParams().cartStr;
  const cartId = useLocalSearchParams().cartId;
  const cartItems = (JSON.parse(cartStr?.toString() || "[]").length ? JSON.parse(cartStr?.toString() || "[]") : [JSON.parse(cartStr?.toString() || "[]")]) as CartItem[];
  const user = useUserInfoStore((state) => state.auth.user);
  const [discountChechking, setDiscountChechking] = useState(false);
  const [checkouting, setCheckouting] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);

  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address.length ? (user.address.find(a => a.isPrimary)?.address) : "");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState<Discount | undefined>(undefined);

  const [isShippingInfoExpanded, setIsShippingInfoExpanded] = useState(true);
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(true);
  const [isDiscountExpanded, setIsDiscountExpanded] = useState(true);

  const totalQuantity = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cartItems?.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0) || 0;

  const checkDiscountCode = async () => {
    setDiscountChechking(true);
    try {
      const res = await api.post<Discount>('/discount/check', { code: discountCode });
      if (res.success) {
        setDiscountCode((prev) => prev.toUpperCase());
        setDiscount(res.data);
        setDiscountError(null);
      } else {
        setDiscountCode("");
        setDiscountError(res.message);
        setDiscount(undefined);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi kiểm tra mã giảm giá. Vui lòng thử lại sau!");
      setDiscount(undefined);
    } finally {
      setDiscountChechking(false);
    }
  }

  const handleCheckout = async () => {
    setCheckouting(true);
    if (!phone || !address) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin giao hàng!");
      setCheckouting(false);
      return;
    }
    if (!paymentMethod) {
      Alert.alert("Thông báo", "Vui lòng chọn phương thức thanh toán!");
      setCheckouting(false);
      return;
    }

    if (discount) {
      await checkDiscountCode();
    }

    if (discountError) return;

    try {
      if (cartId) {
        await CartService.checkoutCart(phone, address, paymentMethod, discountCode.toUpperCase());
      }
      else {
        await OrderService.checkoutOrder(cartItems, address, phone, paymentMethod, discountCode.toUpperCase());
      }
      Alert.alert("Thông báo", "Đơn hàng đã được đăng lên thành công!");
      handleCancel();
    } catch (err: any) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thực hiện thanh toán. Vui lòng thử lại sau!");
    };
  };

  const handleCancel = () => {
    if (cartId) {
      router.dismissTo('/(tabs)/cart');
    } else {
      router.back();
    }
  }

  React.useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn muốn hủy thanh toán đơn hàng này không?',
        [
          { text: 'Hủy', style: 'cancel', onPress: () => null },
          { text: 'Đồng ý', onPress: handleCancel }
        ]
      );
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>

      {/* Section Thông tin nhận hàng */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setIsShippingInfoExpanded(!isShippingInfoExpanded)}>
          <Text style={styles.sectionTitle}>
            Thông tin nhận hàng {isShippingInfoExpanded ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
        {isShippingInfoExpanded && (
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
        )}
      </View>

      {/* Section Phương thức thanh toán */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setIsPaymentExpanded(!isPaymentExpanded)}>
          <Text style={styles.sectionTitle}>
            Phương thức thanh toán {isPaymentExpanded ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
        {isPaymentExpanded && (
          <RadioButton.Group onValueChange={setPaymentMethod} value={paymentMethod}>
            <View style={styles.radioButton}>
              <RadioButton value="cash" />
              <Text>Thanh toán khi nhận hàng</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="card" disabled />
              <Text style={{ opacity: 0.5 }}>Thẻ tín dụng</Text>
            </View>
          </RadioButton.Group>
        )}
      </View>

      {/* Section Mã giảm giá */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => setIsDiscountExpanded(!isDiscountExpanded)}>
          <Text style={styles.sectionTitle}>
            Mã giảm giá {isDiscountExpanded ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
        {isDiscountExpanded && (
          <View style={styles.infoContainer}>
            <TextInput
              mode="outlined"
              label="Nhập mã giảm giá"
              onChangeText={setDiscountCode}
              style={styles.input}
              value={discountCode}
            />
            {discountError && <Text style={{ color: 'red', textAlign: 'center' }}>{discountError}</Text>}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Button mode="contained" onPress={checkDiscountCode} style={{ ...styles.button, backgroundColor: 'rgba(150,150,255,0.8)' }}>
                {discountChechking ? <ActivityIndicator size={'small'} /> :
                  <Text style={{ fontWeight: 'bold', color: '#333' }}>Áp dụng</Text>}
              </Button>
            </View>
          </View>
        )}
      </View>

      {/* Tổng số lượng và tổng giá */}
      <Card style={styles.summaryCard}>
        <Text style={styles.summaryText}>Tổng sản phẩm: {totalQuantity}</Text>
        <Text style={[styles.summaryText, styles.totalPriceText]}>
          Tổng giá: {totalPrice.toLocaleString()} VND
        </Text>
        {discount && (
          <Text style={[styles.summaryText, styles.totalPriceText]}>
            Giảm giá: {(totalPrice * discount.percentage / 100).toLocaleString()} VND
          </Text>
        )}
        {discount && (
          <Text style={[styles.summaryText, styles.totalPriceText]}>
            Tổng thanh toán: {(totalPrice - (totalPrice * discount.percentage / 100 || 0)).toLocaleString()} VND
          </Text>
        )}
      </Card>

      {/* Danh sách sản phẩm */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={cartItems || []}
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

      {/* Nút điều hướng */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" style={{ ...styles.button, backgroundColor: 'red' }} onPress={handleCancel} disabled={checkouting}>
          <Text style={styles.buttonText}>Hủy</Text>
        </Button>
        <Button mode="contained" style={{ ...styles.button, backgroundColor: 'green' }} onPress={handleCheckout}>
          {checkouting ? <ActivityIndicator size={'small'} /> : <Text style={styles.buttonText}>Thanh toán</Text>}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 30,
    padding: 10,
    paddingStart: 20,
  },
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
    left: 0,
    right: 0,
    padding: 8,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: "40%",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#dfd",
  },
});

export default CheckoutScreen;
