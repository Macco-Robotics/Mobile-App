import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface LoginScreenProps {
  onRegisterPress: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onRegisterPress }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}> {/* Contenedor hasta botón de login */}
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="SampleDomain"
          placeholderTextColor="#ccc"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="SampleDomain"
          placeholderTextColor="#ccc"
          secureTextEntry
        />

        <Text style={styles.forgotPassword}>¿Has olvidado la contraseña?</Text>

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Fuera del contenedor visual */}
      <Text style={styles.socialText}>- Inicia sesión con -</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialCircle}>
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialCircle}>
          <FontAwesome name="instagram" size={24} color="#C13584" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialCircle}>
          <FontAwesome name="facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>

      <Text style={styles.registerText}>
        ¿No tienes una cuenta?{' '}
        <Text style={styles.registerLink} onPress={onRegisterPress}>
          Regístrate
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#001F3F",
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    color: '#00B7EB',
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#DCEBFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: '100%',
    color: '#000',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#666',
    marginBottom: 20,
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#00B7EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialText: {
    color: '#FFF',
    marginBottom: 10,
    alignSelf: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  socialCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  registerText: {
    color: '#FFF',
    alignSelf: 'center',
  },
  registerLink: {
    color: '#00B7EB',
    fontWeight: 'bold',
  },
});
