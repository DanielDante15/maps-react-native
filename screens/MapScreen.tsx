import React, { useState, useEffect } from 'react';
import api from '../Api';
import Dialog from 'react-native-dialog';
import MapView, { Marker, Callout, MarkerPressEvent } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { Text, View } from "../components/Themed";
import { LatLng } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function MapScreen(this: any) {

  const [lat, setLatitude] = useState(-22.91387958710525)
  const [long, setLongitude] = useState(-47.068131631428884)
  const GOOGLE_MAPS_APIKEY = 'AIzaSyAsYdGzyVfnKpkKIw5GJQzoaveZfswRlsU';
  let coord: LatLng = { latitude: 0, longitude: 0 };
  const [coordenadas, setCoordenadas] = useState(coord)
  const [visible, setVisible] = useState(false)
  const [clientes, setClientes] = useState<{ id: number, razao_social: string, lat: number, lng: number }[]>([])
  const [nome, setNome] = useState('')
  const [origin, setOrigin] = useState({latitude:1,longitude:1})
  const [destination, setDestination] = useState({latitude:1,longitude:1})

  function getData() {
    api.get('/clientes')
      .then(function (res) {
        setClientes(res.data)
        // setOrigin({
        //   latitude: clientes[0].lat,
        //   longitude: clientes[0].lng
        // })
        
      })
      .catch(function (error) {
        alert(error.message)
      })
  }

  useEffect(() => {
    getData();
  }, [])

  

  function renderRoutes(){
    return(
      <MapViewDirections
          origin={origin}
          strokeWidth={3}
          strokeColor='blue'
          waypoints={[]}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
        />
    )
  }

  const addMarcador = (e: LatLng) => {
    setCoordenadas(e)
    setVisible(true)
    setOrigin({
      latitude: clientes[0].lat,
      longitude: clientes[0].lng
    })
    setDestination({
      latitude: clientes[clientes.length - 1].lat,
      longitude: clientes[clientes.length - 1].lng
    })
    renderRoutes()
  }

  const handleControl = () => {
    setVisible(false);
  }
  const deletarMarcador = (e: MarkerPressEvent) => {
    let novaLista = [...clientes as any]
    let posicaoItem = novaLista.findIndex(x => x.lat = e.nativeEvent.coordinate.latitude &&
      x.lng == e.nativeEvent.coordinate.longitude)
    let id: number = novaLista[posicaoItem].id
    console.log(id)
    novaLista.splice(posicaoItem, 1)
    setClientes(novaLista)
    const headers = {
      "Content-Type": "application/json",
    }
    api.delete(`/clientes/${id}/`, { headers: headers }).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }
  const handleOk = () => {
    let novaLista = [...clientes as any]
    novaLista.push({
      razao_social: nome,
      endereco: "dfg",
      lat: coordenadas.latitude,
      lng: coordenadas.longitude,
    })
    api.post('/clientes/', novaLista[novaLista.length - 1])
    setClientes(novaLista)
    setOrigin({
      latitude: clientes[0].lat,
      longitude: clientes[0].lng
    })
    setDestination({
      latitude: clientes[clientes.length - 1].lat,
      longitude: clientes[clientes.length - 1].lng
    })
    renderRoutes()
    setVisible(false)
  }


  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }}
        onPress={e => addMarcador(e.nativeEvent.coordinate)}
      >
        {clientes.map((local) => (
          <Marker
            key={local.razao_social}
            coordinate={{ latitude: local.lat, longitude: local.lng }}
            title={local.razao_social}
            onPress={e => deletarMarcador(e)}
          >
          </Marker>
        ))}

{clientes.length >=2 ?renderRoutes():null}
        

      </MapView>

      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Inserir marcador</Dialog.Title>
          <Dialog.Description>
            Informe abaixo o nome deste marcador
          </Dialog.Description>
          <Dialog.Input onChange={(e) => setNome(e.nativeEvent.text)} />
          <Dialog.Button onPress={() => handleControl()} label="Cancel" />
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