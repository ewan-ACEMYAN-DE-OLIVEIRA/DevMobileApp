import { HelloWave } from '@/components/hello-wave';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const themes = [
  { id: 'personnalite', label: 'Personnalité', icon: '👤', 'bgColors':[ '#3A1C4A', '#5A2A4A'] },
  { id: 'geographie',  label: 'Géographie',  icon: '🌍',  'bgColors':[ '#234B6E', '#368A91'] },
  { id: 'cinema',    label: 'Cinéma',    icon: '🎥', 'bgColors':[ '#4A3F2A', '#7A6B3A'] },
  { id: 'sport',  label: 'Sport',  icon: '⚽', 'bgColors':[ '#3A1C6A', '#5D33A6'] },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ color: '#ffffff' }}>Bienvenue!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle" style={{ color: '#ffffff' }}>Sélectionnez un thème</ThemedText>
      </ThemedView>

      <View style={styles.grid}>
        {themes.map((theme) => (
          <TouchableOpacity
            key={theme.id}
            style={styles.cardWrapper}
            onPress={() => router.push({ pathname: '/quiz', params: { themeId: theme.id } })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.bgColors as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <ThemedText style={styles.cardIcon}>{theme.icon}</ThemedText>
              <ThemedText style={styles.cardLabel}>{theme.label}</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    backgroundColor: '#12142B',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#12142B',
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#12142B',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  cardWrapper: {
    width: '44%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',      // ← indispensable pour que le gradient respecte le borderRadius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cardIcon: {
    fontSize: 42,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});