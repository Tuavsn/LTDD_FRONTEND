import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { api } from '@/utils/restApiUtil';
import { useToast } from '@/components/SimpleToastProvider';

type EditProfileScreenParams = {
  fullname: string;
  email: string;
  avatar: string;
};

const EditProfileScreen: React.FC = () => {
  const { fullname: initialName, email: initialEmail, avatar: initialAvatar } = useLocalSearchParams() as EditProfileScreenParams;
  const [fullname, setFullname] = useState(initialName || 'www.placeholder.com/150');
  const [email, setEmail] = useState(initialEmail);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [password, setPassword] = useState('');
  const [imagePicked, setImagePicked] = useState(false);
  const [image, setImage] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Xin lỗi, chúng tôi cần quyền truy cập thư viện ảnh để chọn ảnh đại diện!');
      }
    })();
  }, []);

  // Mở thư viện ảnh để chọn ảnh mới
  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true
    });

    if (!result.canceled
      && result.assets[0].base64
    ) {
      setAvatar(result.assets[0].uri);
      setImagePicked(true);
      setImage(result.assets[0].base64)
    }
  };

  const handleSave = async () => {
    let avatar_url = initialAvatar;
    if (imagePicked) {
      try {
        console.log('test')
        // Đọc file từ uri dưới dạng base64
        // const base64 = await FileSystem.readAsStringAsync(avatar, {
        //   encoding: FileSystem.EncodingType.Base64,
        // });
        // // Tạo Data URI
        // const dataUri = `data:image/jpeg;base64,${base64}`;
        // // Sử dụng fetch trên Data URI để lấy blob có dữ liệu ảnh
        // const response = await fetch(dataUri);
        // const blob = await response.blob();

        await api
          .post<{ url: string }>('/upload/image',
            // blob,
            { image },
            {
              requiresAuth: true,
              // headers: { 'Content-Type': 'application/octet-stream' },
              headers: { 'Content-Type': 'application/json' },
            })
          .then((res) => {
            if (res.success) {
              avatar_url = res.data?.url ?? initialAvatar;
              if (!res.data) {
                showToast('Lỗi khi upload ảnh', 2000);
              }
            } else {
              showToast(res.message, 2000);
            }
          });
      } catch (err) {
        console.error(err);
        showToast('Lỗi khi upload ảnh', 2000);
      }
    }

    await api
      .post<{ changeEmail: boolean | undefined }>(
        '/users/profile',
        { fullname, email, avatar: avatar_url },
        { requiresAuth: true }
      )
      .then((res) => {
        if (res.success) {
          if (res.data?.changeEmail) {
            console.log('test')
            router.navigate({ pathname: '/(common)/confirm-otp', params: { email: initialEmail, nextPathname: "/(tabs)" } });
          } else {
            router.back();
            showToast(res.message, 2000);
          }
        }
      });
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="items-center mb-6">
        <Image source={{ uri: avatar }} className="w-32 h-32 rounded-full mb-4" />
        <TouchableOpacity onPress={handlePickImage} className="mb-4">
          <Text className="text-blue-500">Chọn ảnh mới</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold">Chỉnh sửa hồ sơ</Text>
      </View>
      <View className="mb-4">
        <Text className="text-base mb-2">Tên</Text>
        <TextInput
          value={fullname}
          onChangeText={setFullname}
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Nhập tên"
        />
      </View>
      <View className="mb-4">
        <Text className="text-base mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Nhập email"
          keyboardType="email-address"
        />
      </View>
      <View className="mb-4">
        <Text className="text-base mb-2">Mật khẩu</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          className="border border-gray-300 rounded px-3 py-2"
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={handleSave} className="bg-blue-500 px-4 py-2 rounded items-center">
        <Text className="text-white">Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;
