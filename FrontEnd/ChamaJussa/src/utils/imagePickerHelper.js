import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

/**
 * Exibe as opções para o usuário escolher entre tirar uma foto usando a câmera
 * ou escolher uma imagem existente na galeria do dispositivo.
 *
 * @param {Object} customOptions Opções personalizadas para o expo-image-picker
 * @returns {Promise<ImagePicker.ImagePickerResult|null>}
 */
export const pedirEObterImagem = async (customOptions = {}) => {
  const defaultOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Images : "images",
    allowsEditing: true,
    quality: 0.7,
    ...customOptions,
  };

  const tirarFoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        const msg = "É necessária permissão para utilizar a câmera.";
        if (Platform.OS === "web") {
          window.alert(msg);
        } else {
          Alert.alert("Permissão Necessária", msg);
        }
        return null;
      }

      return await ImagePicker.launchCameraAsync(defaultOptions);
    } catch (error) {
      console.warn("Erro ao abrir câmera:", error);
      return null;
    }
  };

  const escolherGaleria = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        const msg = "É necessária permissão para acessar suas fotos.";
        if (Platform.OS === "web") {
          window.alert(msg);
        } else {
          Alert.alert("Permissão Necessária", msg);
        }
        return null;
      }

      return await ImagePicker.launchImageLibraryAsync(defaultOptions);
    } catch (error) {
      console.warn("Erro ao abrir galeria:", error);
      return null;
    }
  };

  return new Promise((resolve) => {
    if (Platform.OS === "web") {
      const usarCamera = window.confirm(
        "Deseja tirar uma foto com a Câmera?\n\nClique em 'OK' para abrir a Câmera ou 'Cancelar' para escolher da Galeria de fotos."
      );
      if (usarCamera) {
        tirarFoto().then(resolve);
      } else {
        escolherGaleria().then(resolve);
      }
    } else {
      Alert.alert(
        "Selecionar Foto",
        "Como você prefere adicionar a imagem?",
        [
          {
            text: "📷 Tirar Foto",
            onPress: () => tirarFoto().then(resolve),
          },
          {
            text: "🖼️ Escolher da Galeria",
            onPress: () => escolherGaleria().then(resolve),
          },
          {
            text: "Cancelar",
            style: "cancel",
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(null) }
      );
    }
  });
};
