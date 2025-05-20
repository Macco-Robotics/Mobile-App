import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const PersonalizationScreen: React.FC = () => {
  const [step, setStep] = useState(1);

  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedAlcohol, setSelectedAlcohol] = useState<string | null>(null);
  const [selectedCaffeine, setSelectedCaffeine] = useState<string | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
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
    if (step > 1) setStep((prev) => prev - 1);
  };

  const renderStepTitle = (title: string) => (
    <Text style={styles.stepTitle}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Personaliza tu experiencia</Text>

      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {step === 1 && (
            <>
              {renderStepTitle("Paso 1: Gustos y hábitos")}

              <Text style={styles.question}>¿Qué tipo de bebidas te gustan más?</Text>
              {["Dulces", "Ácidas / Cítricas", "Amargas", "Afrutadas"].map((flavor) => (
                <TouchableOpacity
                  key={flavor}
                  style={[
                    styles.option,
                    selectedFlavors.includes(flavor) && styles.selectedOption,
                  ]}
                  onPress={() => handleToggle(selectedFlavors, setSelectedFlavors, flavor)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedFlavors.includes(flavor) && styles.selectedOptionText,
                    ]}
                  >
                    {flavor}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.question}>¿Sueles consumir alcohol?</Text>
              {["No, nunca", "A veces", "Sí, regularmente"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedAlcohol === option && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedAlcohol(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedAlcohol === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.question}>¿Tomas bebidas con cafeína?</Text>
              {["Sí, a menudo", "Solo en ciertas ocasiones", "No, las evito"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedCaffeine === option && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedCaffeine(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedCaffeine === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              {renderStepTitle("Paso 2: Preferencias y motivaciones")}

              <Text style={styles.question}>
                ¿En qué situación sueles tomar tus bebidas?
              </Text>
              {[
                "En casa relajado",
                "En eventos sociales",
                "Después de hacer ejercicio",
                "Mientras estudio o trabajo",
              ].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedSituation === option && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedSituation(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSituation === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.question}>¿Qué te motiva al elegir una bebida?</Text>
              {[
                "Innovación y probar cosas nuevas",
                "Buscar algo saludable",
                "Sabor familiar y seguro",
                "Depende del momento",
              ].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedMotivation === option && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedMotivation(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedMotivation === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.question}>¿Quieres recibir notificaciones de Kime?</Text>
              {["Sí", "No"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    selectedNotifications === option && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedNotifications(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedNotifications === option && styles.selectedOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              {renderStepTitle("Paso 3: Tipos de notificaciones")}

              <Text style={styles.question}>
                ¿Qué tipo de notificaciones te gustaría recibir?
              </Text>
              {[
                "Promociones",
                "Eventos especiales",
                "Recomendaciones personalizadas",
                "Nuevas bebidas disponibles",
              ].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.option,
                    selectedNotificationTypes.includes(type) && styles.selectedOption,
                  ]}
                  onPress={() =>
                    handleToggle(
                      selectedNotificationTypes,
                      setSelectedNotificationTypes,
                      type
                    )
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedNotificationTypes.includes(type) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>

        {/* Navegación */}
        <View style={styles.navigationButtons}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Atrás</Text>
            </TouchableOpacity>
          )}
          {step < 3 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Siguiente ➝</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => console.log("Finalizar")}
            >
              <Text style={styles.nextButtonText}>Finalizar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 20,
    color: "#A9D6E5",
    fontWeight: "600",
    marginBottom: 5, // antes: 10
  },
  card: {
    backgroundColor: "#CCF2F4",
    borderRadius: 10,
    padding: 16, // antes: 20
    width: "100%",
    maxWidth: 400,
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    color: "#003366",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  question: {
    fontSize: 16,
    color: "#003366",
    marginTop: 15,
    marginBottom: 10,
  },
  option: {
    backgroundColor: "#E0F7FA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "#00BFFF",
  },
  optionText: {
    color: "#003366",
    fontSize: 15,
  },
  selectedOptionText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  backButton: {
    backgroundColor: "#CCCCCC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#003366",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#00BFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default PersonalizationScreen;
