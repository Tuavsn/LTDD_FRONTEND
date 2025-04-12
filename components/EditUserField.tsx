import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { api } from '@/utils/restApiUtil';
import { useToast } from '@/components/SimpleToastProvider';
import { router } from 'expo-router';
import { strings } from '@/constants/String';
import { uploadImage } from '@/service/cloudinary.service';

type EditUserFieldProps = {
  initialData: string;
  title: string;
  fieldName: string;
  isEmail?: boolean;
  isPhone?: boolean;
  isFullname?: boolean;
  isAvatar?: boolean;
  isPassword?: boolean;
  requireOldPassword?: boolean;
  handleCancel: () => void;
};

const EditUserField = ({
  initialData,
  title,
  fieldName,
  requireOldPassword,
  isEmail,
  isPhone,
  isFullname,
  isAvatar,
  isPassword,
  handleCancel,
}: EditUserFieldProps) => {
  const [oldPassword, setOldPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [data, setData] = React.useState(isPassword ? '' : initialData)
  const [image, setImage] = React.useState(initialData)
  const [imagePicked, setImagePicked] = React.useState(false)
  const { showToast } = useToast()

  const validateData = () => {
    const phoneRegex = /^[0-9]{10,11}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (requireOldPassword && oldPassword === '') {
      showToast(strings.editProfile.errors.emptyOldPassword)
      return false
    }

    if (isEmail && !emailRegex.test(data)) {
      showToast(strings.editProfile.errors.emailInvalid)
      return false
    }

    if (isPhone && !phoneRegex.test(data)) {
      showToast(strings.editProfile.errors.phoneInvalid)
      return false
    }

    if (isPassword && data.length < 6) {
      showToast(strings.editProfile.errors.passwordLengthInvalid)
      return false
    }

    if (isPassword && oldPassword !== confirmPassword) {
      showToast(strings.editProfile.errors.passwordNotMatch)
      return false
    }

    if (data === '') {
      showToast(strings.editProfile.errors.fullInformationRequired)
      return false
    }
    return true
  }

  const handleSave = async () => {
    let avatar_url = initialData;
    if (isAvatar && imagePicked) {
      const res = await handleUploadImage(image);
      if (res) {
        avatar_url = res;
      }
    }

    const body: { [key: string]: any } = {};
    body[fieldName] = data;

    if (isAvatar) {
      body[fieldName] = avatar_url;
    }

    if (requireOldPassword) {
      body['oldPassword'] = oldPassword;
    }

    api.put<{ changeEmail: boolean }>('/user/profile', body).then((res) => {
      showToast(res.message ?? strings.editProfile.texts.success);
      if (res.success) {
        handleCancel();
        if (res.data && res.data.changeEmail) {
          router.push({ pathname: '/(common)/confirm-otp', params: { email: initialData, nextPathname: "/(profile)/profile" } });
        }
      }
    });
  }

  useEffect(() => {
    (async () => {
      if (isAvatar) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert(strings.editProfile.texts.noPermission);
        }
      }
    })();
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      selectionLimit: 1,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled
    ) {
      setImage(result.assets[0].uri);
      setImagePicked(true);
    }
  };

  const handleUploadImage = async (uri: string) => {
    let url = '';
    await uploadImage(uri).then((res) => {
      url = res.secure_url;
    }).catch((err) => {
      console.log(err);
    });

    if (url === '') {
      alert(strings.editProfile.errors.error);
      return undefined;
    }
    return url;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Chỉnh sửa {title.toLocaleLowerCase()}</Text>
      </View>
      <View style={styles.formContainer}>
        {requireOldPassword && (
          <TextInput
            label={strings.editProfile.titles.oldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
            mode="outlined"
            secureTextEntry
          />
        )}
        {isAvatar ? (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: image }} style={styles.avatarImage} />
            <Button mode="contained" onPress={handlePickImage}>
              Chọn ảnh
            </Button>
          </View>
        ) : (
          <>
            <TextInput
              label={title}
              value={data}
              onChangeText={setData}
              mode="outlined"
              keyboardType={isEmail ? 'email-address' : isPhone ? 'phone-pad' : 'default'}
              autoCapitalize={isFullname ? 'words' : 'none'}
              secureTextEntry={isPassword}
            />
            {isPassword && (
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                secureTextEntry
              />
            )}
          </>
        )}
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Save
          </Button>
          <Button mode="contained" onPress={handleCancel} style={styles.button}>
            Cancel
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 100,
  },
  titleContainer: {
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: 50,
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  avatarImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default EditUserField;