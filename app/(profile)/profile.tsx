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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import UserInfoPanel from './components/UserInfoPanel';

const ProfileScreen = () => {
  const setAuth = useUserInfoStore((state) => state.setAuth);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const user = useUserInfoStore((state) => state.auth.user);
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

  const { height } = Dimensions.get('window');
  const avatarSize = height * 0.3;

  return (
    <SafeAreaView style={styles.container}>
      {isEditing && (
        <View>
          <EditUserField
            initialData={user.avatar ?? ''}
            title={strings.editProfile.titles.avatar}
            fieldName={'avatar'}
            handleCancel={handleCancelEditting}
            isAvatar={true}
          />
        </View>
      )}

      {/* Cover image and avatar */}
      <View style={styles.coverContainer}>
        {/* Cover Image */}
        <Image
          source={require('@/assets/images/login-background.png')}
          style={styles.coverImage}
        />
        {/* Avatar placed over the cover */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleEditField}>
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
        {showProfile && <UserInfoPanel />}
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
  // Container for the entire screen.
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // Container for the cover image and avatar.
  coverContainer: {
    position: 'relative',
    backgroundColor: 'black',
  },
  // Cover image styling: full width, fixed height (320 pixels) and reduced opacity.
  coverImage: {
    width: '100%',
    height: 320,
    opacity: 0.7,
  },
  // Avatar container positioned absolutely over the cover image.
  avatarContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Avatar image styling: border applied to make it stand out.
  avatarImage: {
    borderWidth: 4,
    borderColor: 'white',
  },
  // Panel container for sections (User info and Order history).
  panel: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  // Additional styling for the first panel: a bottom border.
  profilePanel: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  // Header for each panel section.
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Panel title text styling.
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Container for the logout button, centering it.
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Logout button styling.
  button: {
    width: '50%',
    marginTop: 24,
    backgroundColor: '#dd2233',
    padding: 16,
    borderRadius: 9999,
  },
  // Logout button text styling.
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileScreen;