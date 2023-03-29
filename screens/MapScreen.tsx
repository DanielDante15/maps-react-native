import React, {useState,useEffect} from 'react';
import api from '../Api';
import Dialog from 'react-native-dialog';
import MapView, {Marker, Callout, MarkerPressEvent} from 'react-native-maps';
import { StyleSheet } from 'react-native';
import {Text, View} from "../components/Themed";
import { LatLng } from 'react-native-maps';

export default function MapScreen(this: any) {

  const [lat, setLatitude] = useState(-22.91387958710525)
  const [long, setLongitude] = useState(-47.068131631428884)

  function getData() {
    api.get('/clientes')
    .then(function(res){
      setClientes(res.data)
    })
    .catch(function(error){
      alert(error.message)
    })
    
  }
  
  useEffect(() => {
    getData();
  }, [])


  let coord : LatLng = {latitude: 0, longitude: 0};
  const [coordenadas, setCoordenadas] = useState(coord)
  const [visible, setVisible] = useState(false)
  const [nome, setNome] = useState('')


  const [clientes, setClientes] = useState<{id: number, razao_social:string,endereco:string,lat:number,lng:number}[]>([])
  
  const addMarcador = (e : LatLng) => {
    setCoordenadas(e)
    setVisible(true)
  }

  const handleControl = () => {
    setVisible(false);
  }

  const deletarMarcador = (e : MarkerPressEvent) => {
    let novaLista = [...clientes as any]
    let posicaoItem = novaLista.findIndex(x => x.lat = e.nativeEvent.coordinate.latitude && 
      x.lng == e.nativeEvent.coordinate.longitude)
    console.log(novaLista[posicaoItem].id)
    let id = novaLista[posicaoItem].id
    novaLista.splice(posicaoItem, 1)
    setClientes(novaLista)
    api.delete(`/clientes/${id}`, {  data: {
      id: id,
  }}).then((res) => {
      console.log(res.data)
    })
  }
  const handleOk = () => {
    let novaLista = [... clientes as any]
    novaLista.push({
      lat: coordenadas.latitude,
      long: coordenadas.longitude,
      nome: nome

    })
    setClientes(novaLista)
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
        coordinate={{latitude: local.lat, longitude: local.lng}}
        title={local.razao_social}
        onPress={e => deletarMarcador(e)}
        
        >
        </Marker>
      ))}

      </MapView>

      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>Inserir marcador</Dialog.Title>
          <Dialog.Description>
            Informe abaixo o nome deste marcador
          </Dialog.Description>
          <Dialog.Input onChange={(e) => setNome(e.nativeEvent.text)}/>
          <Dialog.Button onPress={() => handleControl()} label="Cancel"/>
          <Dialog.Button onPress={() => handleOk()} label="Adicionar"/>
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