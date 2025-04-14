// ProfileScreen.tsx
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { EditUserField } from '@/components';
import { strings } from '@/constants/String';
import { getUserInfo } from '@/service/user.service';
import { useUserInfoStore } from '@/zustand/user.store';
import UserInfoPanel from './components/UserInfoPanel';
import { BlurView } from 'expo-blur';

const ProfileScreen = () => {
  const setAuth = useUserInfoStore((state) => state.setAuth);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const user = useUserInfoStore((state) => state.auth.user);
  const [isEditing, setIsEditing] = React.useState(false);
  const [initialData, setInitialData] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [fieldName, setFieldName] = React.useState('');
  const [isAvatar, setIsAvatar] = React.useState(false);
  const [isEmail, setIsEmail] = React.useState(false);
  const [isPhone, setIsPhone] = React.useState(false);
  const [isFullname, setIsFullname] = React.useState(false);
  const [isPassword, setIsPassword] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      getUserInfo(setUserInfo).finally(() => setIsLoading(false));
    }, [])
  );

  const handleEditAvatarField = () => {
    setInitialData(user?.avatar ?? '');
    setTitle(strings.editProfile.titles.avatar);
    setFieldName('avatar');
    setIsAvatar(true);
    setIsEditing(true);
  };

  const handleCancelEditting = () => {
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.navigate({ pathname: '/(auth)/login' });
    setAuth({} as any);
  };

  const handleNavigateToOrderHistory = () => {
    router.navigate({ pathname: '/(profile)/order-history' });
  };

  React.useEffect(() => {
    if (!isEditing) {
      setIsAvatar(false);
      setIsEmail(false);
      setIsPhone(false);
      setIsFullname(false);
      setIsPassword(false);
      setIsLoading(true);
      getUserInfo(setUserInfo).finally(() => setIsLoading(false));
    }
  }, [isEditing]);

  const { height } = Dimensions.get('window');
  const avatarSize = height * 0.3;

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isEditing}
        onRequestClose={handleCancelEditting}
      >
        <View style={styles.modalContainer}>
          <BlurView
            style={styles.absolute}
            intensity={80}
            tint="dark"
            onTouchEnd={handleCancelEditting}
          />
          <View style={styles.modalContent}>
            <EditUserField
              initialData={initialData}
              title={title}
              fieldName={fieldName}
              handleCancel={handleCancelEditting}
              isAvatar={isAvatar}
              isEmail={isEmail}
              isPhone={isPhone}
              isFullname={isFullname}
              isPassword={isPassword}
            />
          </View>
        </View>
      </Modal>

      {/* Cover Image & Avatar */}
      <View style={styles.coverContainer}>
        <Image
          source={require('@/assets/images/login-background.png')}
          style={styles.coverImage}
        />
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleEditAvatarField}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#EA1916" />
            ) : (
              <Image
                source={{
                  uri:
                    user?.avatar || 'https://via.placeholder.com/150',
                }}
                style={[
                  { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
                  styles.avatarImage,
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* User Profile Panel */}
      <View style={[styles.panel, styles.profilePanel]}>
        <TouchableOpacity style={styles.panelButton} onPress={() => setShowProfile(!showProfile)}>
          <View style={styles.panelHeader}>
            <Icon name="user" size={22} color="#333" style={styles.panelIcon} />
            <Text style={styles.panelTitle}>Tài khoản</Text>
            <Icon name={showProfile ? 'angle-up' : 'angle-down'} size={24} color="#333" />
          </View>
        </TouchableOpacity>
        {showProfile && (
          <UserInfoPanel
            isLoading={isLoading}
            setIsEditing={setIsEditing}
            setFieldName={setFieldName}
            setInitialData={setInitialData}
            setTitle={setTitle}
            setIsEmail={setIsEmail}
            setIsPhone={setIsPhone}
            setIsFullname={setIsFullname}
            setIsPassword={setIsPassword}
          />
        )}
      </View>

      {/* Order History Navigation Panel */}
      <View style={[styles.panel, styles.orderPanel]}>
        <TouchableOpacity style={styles.panelButton} onPress={handleNavigateToOrderHistory}>
          <View style={styles.panelHeader}>
            <Icon name="shopping-cart" size={22} color="#333" style={styles.panelIcon} />
            <Text style={styles.panelTitle}>Đơn hàng</Text>
            <Icon name="angle-right" size={24} color="#333" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#fff" style={styles.buttonIcon} />
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  coverContainer: {
    position: 'relative',
    backgroundColor: 'black',
  },
  coverImage: {
    width: '100%',
    height: 320,
    opacity: 0.7,
  },
  avatarContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    borderWidth: 4,
    borderColor: 'white',
  },
  panel: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#f7f7f7',
    marginVertical: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  panelButton: {
    paddingVertical: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelIcon: {
    marginRight: 8,
  },
  panelTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  button: {
    width: '50%',
    flexDirection: 'row',
    backgroundColor: '#dd2233',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
});

export default ProfileScreen;
