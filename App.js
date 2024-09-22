import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState({
    latitude: 60.1699, // Helsingin koordinaatit
    longitude: 24.9384,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerCoords, setMarkerCoords] = useState(null); // Marker-komponentin koordinaatit

  // Haetaan osoite, annetaan virheilmoitus jos käyttäjä ei syötä mitään
  const fetchCoordinates = async () => {
    if (!address) {
      Alert.alert('Kirjoita osoite');
      return;
    }

    try {
      const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(address)}`);
      const data = await response.json();

      // Otetaan json-vastauksesta osoitteen latitude ja longitude (muutetaan desimaaleiksi)
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);

        // Päivitetään karttaan osoite ja marker
        setRegion({
          ...region,
          latitude: latNum,
          longitude: lonNum,
        });
        setMarkerCoords({
          latitude: latNum,
          longitude: lonNum,
        });
      } else {
        Alert.alert('Osoitetta ei löytynyt');
      }
    } catch (error) {
      Alert.alert('Error');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Näytä osoite kartalla</Text>

      <TextInput
        style={styles.input}
        placeholder="Kirjoita osoite"
        value={address}
        onChangeText={setAddress}
      />

      <Button title="Näytä osoite" onPress={fetchCoordinates} />

      <MapView
        style={styles.map}
        region={region}
      >
        {markerCoords && (
          <Marker coordinate={markerCoords} />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 5,
  },
  map: {
    width: '100%',
    height: 400,
    marginTop: 20,
  },
});

export default App;
