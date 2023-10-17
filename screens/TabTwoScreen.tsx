import React, { useState, useEffect } from 'react';
import api from '../Api';
import Dialog from 'react-native-dialog';
import MapView, { Marker} from 'react-native-maps';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from "../components/Themed";
import { LatLng } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function MapScreen(this: any) {
  const GOOGLE_MAPS_APIKEY = 'AIzaSyAsYdGzyVfnKpkKIw5GJQzoaveZfswRlsU';
  let coord: LatLng = { latitude: 0, longitude: 0 };
  const [coordenadas, setCoordenadas] = useState(coord)
  const [visible, setVisible] = useState(false)
  const [clientes, setClientes] = useState<{ id: string, razao_social: string, lat: number, lng: number }[]>([])
  const [nome, setNome] = useState('')
  const [waypoint, setWaypoint] = useState<{ latitude: number, longitude: number }[]>([])
  const [origin, setOrigin] = useState({ latitude: 1, longitude: 1 })
  const [destination, setDestination] = useState({ latitude: 1, longitude: 1 })

  function getData() {
    api.get('/clientes')
      .then(function (res) {
        setClientes(res.data)
      }).catch(function (error) {
        console.error("errorzao:", error.message)
      })
  }

  useEffect(() => {
    getData();
    clientes.length > 1 ? SetCordinates() : null
  }, [])

  useEffect(() => {
    clientes.length > 1 ? SetCordinates() : null
  }, [clientes])

  useEffect(() => {
    let novaLista = [...clientes]
    novaLista.pop()
    novaLista.shift()
    let listaWaypoints = []
    for (let index = 0; index < novaLista.length; index++) {
      listaWaypoints.push({
        latitude: novaLista[index].lat,
        longitude: novaLista[index].lng
      })
    }
    setWaypoint(listaWaypoints)
  }, [clientes])

  const renderRoutes = () => {
    if (origin.latitude == 0 && origin.longitude == 0) return (null)
    else {
      return (
        <MapViewDirections
          origin={origin}
          strokeWidth={3}
          strokeColor='blue'
          waypoints={waypoint}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
        />
      )
    }
  }


  function SetCordinates() {
    setOrigin({
      latitude: clientes[0].lat,
      longitude: clientes[0].lng
    })
    setDestination({
      latitude: clientes[clientes.length - 1].lat,
      longitude: clientes[clientes.length - 1].lng
    })
  }

  const changeMarcador = (e: LatLng, id: string) => {
    let clienteSelecionado = clientes.findIndex(x => x.id === id)
    clientes[clienteSelecionado].lat = e.latitude
    clientes[clienteSelecionado].lng = e.longitude

    api.put(`/clientes/${id}/`, clientes[clienteSelecionado]).then(() => getData())
  }

  const addMarcador = (e: LatLng) => {
    setCoordenadas(e)
    setVisible(true)
  }

  const deletarMarcador = (id: string) => {
    api.delete(`/clientes/${id}/`).then(() => {
      if (clientes.length < 2) {
        setOrigin({
          latitude: 0,
          longitude: 0
        })
        setDestination({
          latitude: 0,
          longitude: 0
        })
      }
    }).catch((err) => {
      console.log(err)
    })
    getData();
  }

  const handleOk = () => {
    let novaLista: any = []
    if (clientes.length > 0) {
      novaLista = [...clientes as any]
    }

    novaLista.push({
      razao_social: nome,
      lat: coordenadas.latitude,
      lng: coordenadas.longitude,
    })
    api.post('/clientes/', novaLista[novaLista.length - 1]).then(() => getData())
    setVisible(false)
  }
  return (
    <View style={styles.container}>

      <MapView style={styles.map}
        initialRegion={{
          latitude: -22.91387958710525,
          longitude: -47.068131631428884,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        onPress={e => addMarcador(e.nativeEvent.coordinate)}
      >
        {
          clientes.map((cliente) => (
            <Marker
              draggable
              pinColor='blue'
              key={cliente.id}
              coordinate={{ latitude: cliente.lat, longitude: cliente.lng }}
              title={cliente.razao_social}
              onPress={() => deletarMarcador(cliente.id)}
              onDragEnd={(e) => changeMarcador(e.nativeEvent.coordinate, cliente.id)}
            />
          ))}

        {clientes.length > 1 ? renderRoutes() : null}

      </MapView>

      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Inserir marcador</Dialog.Title>
          <Dialog.Description>
            Informe abaixo o nome deste marcador
          </Dialog.Description>
          <Dialog.Input autoFocus={true} onChange={(e) => setNome(e.nativeEvent.text)} />
          <Dialog.Button onPress={() => setVisible(false)} label="Cancel" />
          <Dialog.Button onPress={() => handleOk()} label="Adicionar" />
        </Dialog.Container>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});