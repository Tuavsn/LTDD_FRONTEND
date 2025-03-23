import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getUserInfo } from '@/service/user.service';
import { EditUserField } from '@/components';
import { strings } from '@/constants/String';
import React, { useState } from 'react'
import { useUserInfoStore } from '@/zustand/user.store';
import { useFocusEffect } from 'expo-router';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserInfoPanel = () => {
  const user = useUserInfoStore(state => state.auth.user);
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

  return (
    <View>
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


      {/* Phần thông tin người dùng */}
      <View className="mt-6">
        {
          [
            { title: strings.editProfile.titles.email, value: user?.email },
            { title: strings.editProfile.titles.phone, value: user?.phone },
            { title: strings.editProfile.titles.fullname, value: user?.fullname },
            { title: strings.editProfile.titles.password, value: '******' },
          ].map((field, index) => (
            <UserInfoField key={index} {...field} handleEditField={handleEditField} uniqueKey={index} />
          ))
        }
      </View>
    </View>
  )
}

const UserInfoField = ({ title, value, handleEditField, uniqueKey }:
  { title: string, value: string, handleEditField: (title: string, value: string) => void, uniqueKey: number }) => {
  return (
    <TouchableOpacity onPress={() => handleEditField(title, value)}>
      <DataTable.Row className={`w-full flex justify-between px-4 border-0 pt-4 border-b-4 py-2 border-solid border-gray-300`}>
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


export default UserInfoPanel

const styles = StyleSheet.create({})