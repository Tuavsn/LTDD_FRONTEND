// ProfileScreen.tsx
import { api } from '@/utils/restApiUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: vh, width: vw } = Dimensions.get('window');

const ProfileScreen = () => {
  const fields = ["fullname", "email", "phone"];

  const [user, setUser] = useState(Object.fromEntries(fields.map((field) => [field, ''])));

  useEffect( () => {
    try {
      const tryGetInfo = async () => {
        await api.get<{user:any}>('/user/info', { requiresAuth: true }).then((res) => {
          if (res.success) {
            AsyncStorage.setItem('user', JSON.stringify(res.data?.user));
            AsyncStorage.getItem('user').then((user) => setUser(JSON.parse(user ?? `{${fields.join(": ''")} }`)));
          }
        });
      }
      tryGetInfo()
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleEditProfile = () => {
    router.push({ pathname: './EditProfile', params: { ...user } });
  };

  const handleLogout = () => {
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('token');
    router.push('/(auth)/login');
  }

  const { height } = Dimensions.get('window');
  const avatarSize = height * 0.3; // avatar chiếm 30% chiều cao màn hình

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Phần ảnh bìa và avatar */}
      <View className="relative bg-black">
        {/* Ảnh bìa */}
        <Image
          source={require('@/assets/images/login-background.png')}
          className="w-full h-80 opacity-70"
        />
        {/* Avatar được đặt ở trung tâm ảnh bìa */}
        <View className="absolute inset-0 flex items-center justify-center">
          <Image
            source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
            style={{ width: avatarSize, height: avatarSize }}
            className="w-40 h-40 rounded-full border-4 border-white"
          />
        </View>
      </View>

      {/* Phần thông tin người dùng */}
      <View className="mt-6 px-4">
        <View className="mb-4">
          <Text className="text-lg font-bold">Email: {user?.email}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-lg font-bold">Phone: {user?.phone}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-lg font-bold">Fullname: {user?.fullname}</Text>
        </View>

        {/* Nút chỉnh sửa hồ sơ */}
        <TouchableOpacity className="mt-6 bg-blue-500 p-4 rounded-full"
          onPress={handleEditProfile}>
          <Text className="text-white text-center font-bold">Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-6 bg-red-500 p-4 rounded-full"
          onPress={handleLogout}>
          <Text className="text-white text-center font-bold">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default ProfileScreen;
