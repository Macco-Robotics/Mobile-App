import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/themeContext"; // Asegúrate de tener la ruta correcta

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
  };
};

const PersonalizationScreen: React.FC<PersonalizationScreenProps> = ({ onGoBack, userData }) => {
  const { colors } = useTheme(); // 🎯 Hook del contexto

  const [step, setStep] = useState(1);
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
      onGoBack();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleRegister = async () => {
    const questionnaire = {
      flavourPreferences: selectedFlavors,
      alcoholRestriction: selectedAlcoholPreference,
      caffeinePreferences: selectedCaffeinePreference,
      physicalActivityLevel: selectedActivityLevel,
      orderMotivation: selectedMotivation,
      wantsNotifications: selectedNotifications === "Yes",
      notificationTypes: selectedNotificationTypes,
    };

    const payload = {
      user: userData.user,
      password: userData.password,
      name: userData.name,
      surname: userData.lastName,
      email: userData.email,
      postal_code: userData.postalCode,
      phone_number: userData.phone,
      image: "",
      role: "user",
      description: userData.description,
      questionnaire,
    };

    try {
      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Usuario registrado correctamente");
      } else {
        const error = await response.json();
        console.log(error);
        alert("Error: " + error.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error de red o servidor");
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Personalize Your Experience</Text>

      {step === 1 && (
        <View>
          <Text style={[styles.question, { color: colors.text }]}>What flavors do you prefer in your drinks?</Text>
          {["Sweet", "Sour / Citrusy", "Bitter", "Fruity"].map((flavor) => (
            <TouchableOpacity
              key={flavor}
              style={[
                styles.option,
                { backgroundColor: selectedFlavors.includes(flavor) ? colors.accent : colors.card },
              ]}
              onPress={() => handleToggle(selectedFlavors, setSelectedFlavors, flavor)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{flavor}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.question, { color: colors.text }]}>Do you have any alcohol restrictions?</Text>
          {["I don't drink alcohol", "I prefer low-alcohol drinks", "I have no restrictions"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                { backgroundColor: selectedAlcoholPreference === option ? colors.accent : colors.card },
              ]}
              onPress={() => setSelectedAlcoholPreference(option)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={[styles.question, { color: colors.text }]}>Do you like caffeine in your drinks?</Text>
          {["Yes, I love it", "Only in small amounts", "No, I avoid caffeine"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                { backgroundColor: selectedCaffeinePreference === option ? colors.accent : colors.card },
              ]}
              onPress={() => setSelectedCaffeinePreference(option)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.question, { color: colors.text }]}>What is your level of physical activity?</Text>
          {["Sedentary", "Moderate", "Active"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                { backgroundColor: selectedActivityLevel === option ? colors.accent : colors.card },
              ]}
              onPress={() => setSelectedActivityLevel(option)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === 3 && (
        <View>
          <Text style={[styles.question, { color: colors.text }]}>What motivates you when ordering?</Text>
          {["Trying something new", "Familiar flavor", "Healthiest option", "Depends"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                { backgroundColor: selectedMotivation === option ? colors.accent : colors.card },
              ]}
              onPress={() => setSelectedMotivation(option)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.question, { color: colors.text }]}>Do you want notifications from Kime?</Text>
          {["Yes", "No"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                { backgroundColor: selectedNotifications === option ? colors.accent : colors.card },
              ]}
              onPress={() => setSelectedNotifications(option)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.question, { color: colors.text }]}>Preferred types of notifications</Text>
          {["Promotions", "Events", "Recommendations", "New drinks"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                { backgroundColor: selectedNotificationTypes.includes(type) ? colors.accent : colors.card },
              ]}
              onPress={() => handleToggle(selectedNotificationTypes, setSelectedNotificationTypes, type)}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.primary }]}
          onPress={handleBack}
        >
          <Text style={[styles.navButtonText, { color: colors.background }]}>
            {step === 1 ? "Back to Register" : "Back"}
          </Text>
        </TouchableOpacity>
        {step < 3 ? (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={[styles.navButtonText, { color: colors.background }]}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primary }]}
            onPress={handleRegister}
          >
            <Text style={[styles.navButtonText, { color: colors.background }]}>Finish</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  question: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
  },
  option: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  navButton: {
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  navButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PersonalizationScreen;
