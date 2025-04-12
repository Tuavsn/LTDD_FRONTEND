// ProfileScreen.tsx
import { EditUserField } from '@/components';
import { strings } from '@/constants/String';
import { getUserInfo } from '@/service/user.service';
import { useUserInfoStore } from '@/zustand/user.store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
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
    setInitialData(user.avatar ?? '');
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
          {/* BlurView tạo hiệu ứng làm mờ cho nền */}
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

      {/* Cover image and avatar */}
      <View style={styles.coverContainer}>
        {/* Cover Image */}
        <Image
          source={require('@/assets/images/login-background.png')}
          style={styles.coverImage}
        />
        {/* Avatar placed over the cover */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleEditAvatarField}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#EA1916" />
            ) : (
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    'https://via.placeholder.com/150',
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
        <TouchableOpacity onPress={() => setShowProfile(!showProfile)}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Tài khoản</Text>
            <Icon
              name={showProfile ? 'angle-up' : 'angle-down'}
              size={24}
              color="black"
            />
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
      <View style={styles.panel}>
        <TouchableOpacity onPress={handleNavigateToOrderHistory}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Đơn hàng</Text>
            <Icon name="angle-right" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container cho toàn bộ màn hình.
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  // Container cho cover image và avatar.
  coverContainer: {
    position: 'relative',
    backgroundColor: 'black',
  },
  // Cover image: full width, height cố định, áp dụng opacity.
  coverImage: {
    width: '100%',
    height: 320,
    opacity: 0.7,
  },
  // Container cho avatar, được đặt nằm giữa cover image.
  avatarContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Avatar image với border để nổi bật.
  avatarImage: {
    borderWidth: 4,
    borderColor: 'white',
  },
  // Container cho các panel (tài khoản, đơn hàng).
  panel: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  // Panel đầu tiên có thêm đường viền dưới.
  profilePanel: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  // Header cho mỗi panel.
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Tiêu đề của panel.
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Container cho nút logout, căn giữa.
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Styling cho nút logout.
  button: {
    width: '50%',
    marginTop: 24,
    backgroundColor: '#dd2233',
    padding: 16,
    borderRadius: 9999,
  },
  // Text của nút logout.
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Container của modal bao phủ toàn màn hình với nền tối mờ.
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
    width: '100%',
  },
  // Style dùng cho BlurView phủ toàn màn hình.
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  // Nội dung của modal (form chỉnh sửa).
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
});

export default ProfileScreen;