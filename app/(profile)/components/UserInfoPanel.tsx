import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserInfo } from '@/service/user.service';
import { EditUserField } from '@/components';
import { strings } from '@/constants/String';
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
      default: setFieldName('password');
        setRequireOldPassword(true);
        setIsPassword(true);
        break;
    }
    setIsEditing(true);
  };

  const handleCancelEditting = () => {
    setIsEditing(false);
    setRequireOldPassword(false);
    setIsEmail(false);
    setIsPhone(false);
    setIsFullname(false);
    setIsAvatar(false);
    setIsPassword(false);
  };

  return (
    <View>
      {isEditing && (
        <EditUserField
          initialData={initialData}
          title={title}
          fieldName={fieldName}
          handleCancel={handleCancelEditting}
          isEmail={isEmail}
          isPhone={isPhone}
          isFullName={isFullname}
          isAvatar={isAvatar}
          isPassword={isPassword}
          requireOldPassword={requireOldPassword}
        />
      )}

      {/* User Info Section */}
      <View style={styles.panelContainer}>
        {[
          { title: strings.editProfile.titles.email, value: user?.email },
          { title: strings.editProfile.titles.phone, value: user?.phone },
          { title: strings.editProfile.titles.fullname, value: user?.fullname },
          { title: strings.editProfile.titles.password, value: '******' },
        ].map((field, index) => (
          <UserInfoField
            key={index}
            {...field}
            handleEditField={handleEditField}
            uniqueKey={index}
          />
        ))}
      </View>
    </View>
  );
};

type UserInfoFieldProps = {
  title: string;
  value: string;
  handleEditField: (title: string, value: string) => void;
  uniqueKey: number;
};

const UserInfoField = ({
  title,
  value,
  handleEditField,
  uniqueKey,
}: UserInfoFieldProps) => {
  return (
    <TouchableOpacity onPress={() => handleEditField(title, value)}>
      <DataTable.Row style={styles.dataTableRow}>
        <DataTable.Cell style={styles.cellTitle}>{title}</DataTable.Cell>
        <DataTable.Cell style={styles.cellValue}>{value}</DataTable.Cell>
        <DataTable.Cell style={styles.cellIcon}>
          <Text>
            <Icon name="edit" size={20} color="blue" />
          </Text>
        </DataTable.Cell>
      </DataTable.Row>
    </TouchableOpacity>
  );
};

export default UserInfoPanel;

const styles = StyleSheet.create({
  panelContainer: {
    marginTop: 24,
  },
  dataTableRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, borderBottomWidth: 4, borderStyle: 'solid',
    borderColor: '#D1D5DB',
  },
  cellTitle: {
    flex: 0.5,
  },
  cellValue: {
    flex: 1,
  },
  cellIcon: {
    flex: 0.2,
  },
});
