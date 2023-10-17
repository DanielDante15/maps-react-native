import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { View, Text } from '../components/Themed';
import { Select, CheckIcon } from "native-base";
import Drop from '../components/Dropdown';


export default function ModalScreen() {
  const [service, setService] = React.useState("");

  useEffect(() => {
    console.log(service)
  }, [service])

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View>
          <Text>Luciano</Text>
          <Drop/>
        </View>
        <View>
          <Text>Luciano</Text>
          <Drop />
        </View>
        <View>
          <Text>Luciano</Text>
          <Drop />
        </View>
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  card: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%'

  },
});
