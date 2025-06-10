
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL || "";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_UPLOAD_PRESET || "";

export const useImageUpload = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
            base64: false
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const uri = asset.uri;

            const extension = uri.split('.').pop()?.toLowerCase();
            const type = extension === 'png' ? 'image/png' : 'image/jpeg';
            setImageUri(uri);
            await uploadToCloudinary(uri, type);
        }
    }

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.7
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const type = result.assets[0].mimeType || 'image/jpeg';
            setImageUri(uri);
            await uploadToCloudinary(uri, type);
        }
    }

    const uploadToCloudinary = async (uri: string, type: string) => {
        console.log(uri);
        try {
            setUploading(true);
            const formData = new FormData();
            const isBase64 = uri.startsWith('data:image');
            if (isBase64) {
                formData.append('file', uri);
            } else {
                formData.append('file', {
                    uri,
                    type,
                    name: `upload.${type.split('/')[1]}`,
                } as any);
            }
            formData.append('upload_preset', UPLOAD_PRESET);

            console.log("type:", type);

            const res = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            setCloudinaryUrl(data.secure_url);
            Alert.alert("Imagen subida correctamente");
        } catch (error) {
            console.log(error);
            console.error('Error al subir imagen:', error);
            Alert.alert('Error', 'No se pudo subir la imagen');
        } finally {
            setUploading(false);
        }
    }

    return {
        imageUri,
        cloudinaryUrl,
        uploading,
        pickImage,
        takePhoto
    };
};




