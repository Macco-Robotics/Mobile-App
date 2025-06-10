import { authEvents } from "@/utils/authEvents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PersonalizationScreenProps = {
  onGoBack: () => void;
  userData: {
    user: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    postalCode: string;
    phone: string;
    description: string;
    image: string;
  }
};

const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({ onGoBack, userData }) => {
  const [step, setStep] = useState(1);
  
  // Estados individuales
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedAlcoholPreference, setSelectedAlcoholPreference] = useState<string | null>(null);
  const [selectedCaffeinePreference, setSelectedCaffeinePreference] = useState<string | null>(null);
  const [selectedActivityLevel, setSelectedActivityLevel] = useState<string | null>(null);
  const [selectedMotivation, setSelectedMotivation] = useState<string | null>(null);
  const [selectedNotifications, setSelectedNotifications] = useState<string | null>(null);
  const [selectedNotificationTypes, setSelectedNotificationTypes] = useState<string[]>([]);

  const handleToggle = (
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      // Si estamos en el primer paso, usar la prop onGoBack para volver al registro
      onGoBack();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleRegister = async (req, res) => {
    const questionnaire = {
      flavourPreferences: selectedFlavors,
      alcoholRestriction: selectedAlcoholPreference,
      caffeinePreferences: selectedCaffeinePreference,
      physicalActivityLevel: selectedActivityLevel,
      orderMotivation: selectedMotivation,
      wantsNotifications: selectedNotifications === "Yes",
      notificationTypes: selectedNotificationTypes
    };

    const payload = {
      user: userData.user,
      password: userData.password,
      name: userData.name,
      surname: userData.lastName,
      email: userData.email,
      postal_code: userData.postalCode,
      phone_number: userData.phone,
      image: userData.image,
      role: 'user',
      description: userData.description,
      questionnaire
    }

    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_DEPLOYMENT}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Usuario registrado correctamente');
        const result = await response.json();
        await AsyncStorage.setItem('token', result.token);
        authEvents.emit('authChange');
        router.replace('/');

      } else {
        const error = await response.json();
        console.log(error);
        alert('Error: ' + error.message);
      }

    } catch (error) {
      console.error(error);
      alert('Error de red o servidor');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Personalize Your Experience</Text>

      {step === 1 && (
        <View>
          <Text style={styles.question}>What flavors do you prefer in your drinks?</Text>
          {["Sweet", "Sour / Citrusy", "Bitter", "Fruity"].map((flavor) => (
            <TouchableOpacity
              key={flavor}
              style={[styles.option, selectedFlavors.includes(flavor) && styles.selectedOption]}
              onPress={() => handleToggle(selectedFlavors, setSelectedFlavors, flavor)}
            >
              <Text style={styles.optionText}>{flavor}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.question}>Do you have any alcohol restrictions?</Text>
          {["I don't drink alcohol", "I prefer low-alcohol drinks", "I have no restrictions"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, selectedAlcoholPreference === option && styles.selectedOption]}
              onPress={() => setSelectedAlcoholPreference(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      
      {step === 2 && (
        <View>
          <Text style={styles.question}>Do you like caffeine in your drinks?</Text>
          {["Yes, I love it", "Only in small amounts", "No, I avoid caffeine"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, selectedCaffeinePreference === option && styles.selectedOption]}
              onPress={() => setSelectedCaffeinePreference(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.question}>What is your level of physical activity?</Text>
          {["Sedentary", "Moderate", "Active"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, selectedActivityLevel === option && styles.selectedOption]}
              onPress={() => setSelectedActivityLevel(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      
      {step === 3 && (
        <View>
          <Text style={styles.question}>What motivates you when ordering?</Text>
          {["Trying something new", "Familiar flavor", "Healthiest option", "Depends"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, selectedMotivation === option && styles.selectedOption]}
              onPress={() => setSelectedMotivation(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.question}>Do you want notifications from Kime?</Text>
          {["Yes", "No"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, selectedNotifications === option && styles.selectedOption]}
              onPress={() => setSelectedNotifications(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.question}>Preferred types of notifications</Text>
          {["Promotions", "Events", "Recommendations", "New drinks"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.option, selectedNotificationTypes.includes(type) && styles.selectedOption]}
              onPress={() => handleToggle(selectedNotificationTypes, setSelectedNotificationTypes, type)}
            >
              <Text style={styles.optionText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      
      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack}>
          <Text style={styles.navButtonText}>{step === 1 ? "Back to Register" : "Back"}</Text>
        </TouchableOpacity>
        {step < 3 ? (
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={handleRegister}>
            <Text style={styles.navButtonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#001F3F",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A9D6E5",
    marginBottom: 20,
    textAlign: "center",
  },
  question: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 15,
    marginBottom: 10,
  },
  option: {
    backgroundColor: "#003366",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#A9D6E5",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navButton: {
    backgroundColor: "#A9D6E5",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  navButtonText: {
    color: "#003366",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PersonalizationScreen;
