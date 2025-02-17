import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { User } from '@/constants/Types';

const ProfileScreen = ({ user }: { user: User }) => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState<User>({ ...user });

  const handleChange = (field: keyof User, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    setEditable(false);
    console.log('Updated User Data:', formData);
    // Call API to update user data here
  };

  return (
    <View style={styles.container}>    
        {/* Avatar */}
        <Image source={{ uri: formData.avatar }} style={styles.avatar} />

        {/* Edit Button */}
        <TouchableOpacity onPress={() => setEditable(!editable)} style={styles.editButton}>
            <Text style={styles.editText}>{editable ? 'Hủy' : 'Chỉnh sửa'}</Text>
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.form}>
            <Text style={styles.label}>Tên</Text>
            <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            editable={editable}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={formData.email} editable={false} />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            editable={editable}
            />

            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
            editable={editable}
            />

            <Text style={styles.label}>Vai trò</Text>
            <TextInput style={styles.input} value={formData.role} editable={false} />
        </View>

        {editable && (
            <Button title="Lưu" onPress={handleSave} color="#007AFF" />
        )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,    
    padding: 20
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
});
