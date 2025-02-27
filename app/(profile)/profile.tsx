// ProfileScreen.tsx
import { useUserInfoStore } from '@/zustand/user.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserInfo } from '@/service/user.service';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { EditUserField } from '@/components';
import { strings } from '@/constants/String';

const { height: vh, width: vw } = Dimensions.get('window');

const ProfileScreen = () => {
  const user = useUserInfoStore(state => state.auth.user);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState('');
  const [title, setTitle] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isFullname, setIsFullname] = useState(false);
  const [isAvatar, setIsAvatar] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [requireOldPassword, setRequireOldPassword] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getUserInfo(setUserInfo)
    }, [])
  );

  const handleEditField = (title: string, value: string) => {
    setInitialData(value);
    setTitle(title);
    switch (title) {
      case strings.editProfile.titles.email:
        setFieldName('email');
        setIsEmail(true);
        setRequireOldPassword(true);
        break;
      case strings.editProfile.titles.phone:
        setFieldName('phone');
        setIsPhone(true);
        break;
      case strings.editProfile.titles.fullname:
        setFieldName('fullname');
        setIsFullname(true);
        break;
      case strings.editProfile.titles.avatar:
        setFieldName('avatar');
        setIsAvatar(true);
        break;
      default: // Password
        setFieldName('password');
        setRequireOldPassword(true);
        setIsPassword(true);
        break;
    }
    setIsEditing(true);
  }

  const handleCancelEditting = () => {
    setIsEditing(false);
    setRequireOldPassword(false);
    setIsEmail(false);
    setIsPhone(false);
    setIsFullname(false);
    setIsAvatar(false);
    setIsPassword(false);
  }

  const handleLogout = async () => {
    setUserInfo({} as any);
    router.push({ pathname: '/(auth)/login' });
  };

  const { height } = Dimensions.get('window');
  const avatarSize = height * 0.3; // avatar chiếm 30% chiều cao màn hình

  return (
    <SafeAreaView className="flex-1 bg-white">
      {
        isEditing
        &&
        (<EditUserField initialData={initialData}
          title={title}
          fieldName={fieldName}
          handleCancel={handleCancelEditting}
          isEmail={isEmail}
          isPhone={isPhone}
          isFullName={isFullname}
          isAvatar={isAvatar}
          isPassword={isPassword}
          requireOldPassword={requireOldPassword}
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
          <TouchableOpacity onPress={() => handleEditField(strings.editProfile.titles.avatar, user.avatar)}>
            <Image
              source={{ uri: user.avatar || 'https://via.placeholder.com/150' }}
              style={{ width: avatarSize, height: avatarSize }}
              className="rounded-full border-4 border-white"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Phần thông tin người dùng */}
      <View className="mt-6">
        {
          [
            { title: strings.editProfile.titles.email, value: user.email },
            { title: strings.editProfile.titles.phone, value: user.phone },
            { title: strings.editProfile.titles.fullname, value: user.fullname },
            { title: strings.editProfile.titles.password, value: '******' },
          ].map((field, index) => (
            <UserInfoField key={index} {...field} handleEditField={handleEditField} uniqueKey={index} />
          ))
        }
      </View>

      {/* Nút chỉnh sửa hồ sơ */}
      <TouchableOpacity className="mt-6 bg-red-500 p-4 rounded-full"
        onPress={handleLogout}>
        <Text className="text-white text-center font-bold">Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const UserInfoField = ({ title, value, handleEditField, uniqueKey }:
  { title: string, value: string, handleEditField: (title: string, value: string) => void, uniqueKey: number }) => {
  return (
    <TouchableOpacity onPress={() => handleEditField(title, value)}>
      <DataTable.Row className={`w-full flex justify-between px-4 border-0 ${uniqueKey == 0 ? 'border-t-4' : ''} pt-4 border-b-4 py-2 border-solid border-gray-300`}>
        <DataTable.Cell className='flex-[0.5]'>{title}</DataTable.Cell>
        <DataTable.Cell className='flex-1'>{value}</DataTable.Cell>
        <DataTable.Cell className='flex-[0.2]'>
          <Text>
            <Icon name="edit" size={20} color="blue" />
          </Text>
        </DataTable.Cell>
      </DataTable.Row>
    </TouchableOpacity>
  );
}


export default ProfileScreen;
