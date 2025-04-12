import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getUserInfo } from '@/service/user.service';
import { EditUserField } from '@/components';
import { strings } from '@/constants/String';
import { useUserInfoStore } from '@/zustand/user.store';
import { useFocusEffect } from 'expo-router';
import { DataTable } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

interface UserInfoPanelProps {
  isLoading: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setFieldName: React.Dispatch<React.SetStateAction<string>>;
  setInitialData: React.Dispatch<React.SetStateAction<string>>;
  setIsEmail: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPhone: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFullname: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserInfoPanel = ({ isLoading, setIsEditing, setInitialData, setTitle, setFieldName, setIsEmail, setIsFullname, setIsPassword, setIsPhone }: UserInfoPanelProps) => {
  const user = useUserInfoStore(state => state.auth.user);
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
    setIsPassword(false);
  };

  return (
    <View>
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
            isLoading={isLoading}
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
  isLoading: boolean;
  handleEditField: (title: string, value: string) => void;
  uniqueKey: number;
};

const UserInfoField = ({
  title,
  value,
  handleEditField,
  uniqueKey,
  isLoading,
}: UserInfoFieldProps) => {
  return (
    <TouchableOpacity onPress={() => handleEditField(title, value)}>
      <DataTable.Row style={styles.dataTableRow}>
        <DataTable.Cell style={styles.cellTitle}>{title}</DataTable.Cell>
        <DataTable.Cell style={styles.cellValue}>{isLoading ? (<ActivityIndicator size="small" color="#EA1916" />) : value}</DataTable.Cell>
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
    alignContent: 'center',
  },
  cellIcon: {
    flex: 0.2,
  },
  coverBackground: {
    backgroundColor: '#000',
    opacity: 0.8,
    zIndex: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  }
});
