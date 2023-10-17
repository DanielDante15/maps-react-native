import { StyleSheet } from 'react-native';
import api from '../Api';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useEffect, useState } from 'react';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [clientes, setClientes] = useState<{ razao_social: string, lat: number, lng: number }[]>([])

  function getData() {
    api.get('/clientes')
      .then(function (res) {
        setClientes(res.data)
      })
      .catch(function (error) {
        alert(error.message)
      })

  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <View style={styles.container}>
      {clientes.map((cliente, index) => {
        return (
          <Text key={cliente.razao_social} style={styles.title}>{cliente.razao_social}</Text>
        )
      })}
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
});
