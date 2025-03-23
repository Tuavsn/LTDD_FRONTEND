// ProfileScreen.tsx
import { EditUserField } from '@/components';
import { strings } from '@/constants/String';
import { getUserInfo } from '@/service/user.service';
import { useUserInfoStore } from '@/zustand/user.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserInfoPanel from './components/UserInfoPanel';


const ProfileScreen = () => {
  const setAuth = useUserInfoStore(state => state.setAuth);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const user = useUserInfoStore(state => state.auth.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);


  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      getUserInfo(setUserInfo).finally(() => setIsLoading(false));
    }, [])
  );

  const handleEditField = () => {
    setIsEditing(true);
  }

  const handleCancelEditting = () => {
    setIsEditing(false);
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    router.push({ pathname: '/(auth)/login' });
    setAuth({} as any);
  };

  const handleNavigateToOrderHistory = () => {
    router.push({ pathname: '/(profile)/order-history' });
  }

  const { height } = Dimensions.get('window');
  const avatarSize = height * 0.3;

  return (
    <SafeAreaView style={styles.container}>
      {
        isEditing
        &&
        (<EditUserField
          initialData={user.avatar ?? ''}
          title={strings.editProfile.titles.avatar}
          fieldName={'avatar'}
          handleCancel={handleCancelEditting}
          isAvatar={true}
        />)
      }
      {/* Phần ảnh bìa và avatar */}
      <View className="relative bg-black">
        {/* Ảnh bìa */}
        <Image
          source={require('@/assets/images/login-background.png')}
          className="w-full h-80 opacity-70"
        />
        {/* Avatar được đặt ở trung tâm ảnh bìa */}
        <View className="absolute inset-0 flex items-center justify-center">
          <TouchableOpacity onPress={handleEditField}>
            {
              isLoading ?
                <ActivityIndicator size="large" color="#EA1916" /> :
                (<Image
                  source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
                  style={{ width: avatarSize, height: avatarSize }}
                  className="rounded-full border-4 border-white"
                />)}
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ ...styles.panel, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
        <TouchableOpacity onPress={() => setShowProfile(!showProfile)}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Tài khoản</Text>
            <Icon name={`${showProfile ? "angle-up" : "angle-down"}`} size={24} color="black" />
          </View>
        </TouchableOpacity>
        {
          showProfile &&
          <UserInfoPanel />
        }
      </View>
      <View style={styles.panel}>
        <TouchableOpacity onPress={handleNavigateToOrderHistory}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Đơn hàng</Text>
            <Icon name="angle-right" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Nút chỉnh sửa hồ sơ */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  panel: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    marginTop: 24,
    backgroundColor: '#dd2233',
    padding: 16,
    borderRadius: 9999,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;
