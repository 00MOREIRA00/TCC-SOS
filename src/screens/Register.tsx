import { Linking, Platform, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Heading, HStack, IconButton, KeyboardAvoidingView, useTheme, VStack, Text, FormControl, Select, Center } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

//Estilos e animações
import Logo from '../assets/Logo.svg';
import { especColors } from "../styles/especColors"
import { Hourglass } from 'phosphor-react-native';
import { SignOut } from 'phosphor-react-native';

//Componentes
import { Button } from '../componentes/Button';


//Regra de negócio
import { Out } from '../utils/Out';
import { Hospital, HospitalProps } from '../componentes/Hospital';

type RouteParams = { // Essa tipagem foi criada apenas para que o auto complite pudesse achar esse paramentro (Testar sem)
  hospitalId: string; //Erro de tipo não pode ser und (Consultar navigation.d.ts)
  idOcorrencia?: string;
}

export function Register() {
  //Estilização & efeitos
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  //Informações hospital
  const [hospital, setHospital] = useState<HospitalProps>();
  const [Hlat, setHlat] = useState(null);
  const [Hlon, setHlon] = useState(null);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [tempo, setTempo] = useState(null);
  const [distancia, setDistancia] = useState(null);

  //Navegação entre páginas
  const navigation = useNavigation();
  const route = useRoute();

  //informações vindas de Incluivitima.tsx (Typagem logo após os imports Linha 15)
  const { hospitalId, idOcorrencia } = route.params as RouteParams; // o route.params não sabe qual é então foi criada a tipagem acima

  const handleLogout = Out();

  function infoGeo(org: string, dst: string) {
    let request = new XMLHttpRequest();

    request.open('POST', "https://api.openrouteservice.org/v2/directions/driving-car/json");

    request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', '5b3ce3597851110001cf62485388f3fdaef64ec599ec37c1e19398ab');

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        console.log('Status:', this.status);
        let temp = this.responseText;
        let temp1 = JSON.parse(temp);
        console.log(temp1.routes[0].summary);
        setDistancia((temp1.routes[0].summary.distance));
        //setTempo(temp1.routes[0].summary.duration);
        let tst = 600;
        if (tst > 6000) {
          setTempo({ 'temp': (temp1.routes[0].summary.duration) / 60, 'tipo': 'horas' })
        } else {
          setTempo({ 'temp': (temp1.routes[0].summary.duration) / 60, 'tipo': 'min' })
        }
      }
    };
    const body = '{"coordinates":[' + [org, dst] + ']}';
    //console.log(body);
    request.send(body);
  }

  function openGps(lat?: string, lng?: string, purl?: string) {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:0,0?q=';
    //var url = scheme + `${lat},${lng}`;
    var url = scheme + `${purl}`;
    Linking.openURL(url);
    //console.log(infoGeo(origem.toString(), destino.toString()));
  }

  function pagResOcorrencia() {
    navigation.navigate('finalizaOcorrencia', { hospitalId, idOcorrencia });
  }

  useEffect(() => {
    firestore().collection('HOSPITAL').doc(hospitalId)
      .onSnapshot((doc) => {
        const DATA = doc.data() as HospitalProps
        setHospital(DATA)
        setHlat(DATA.latitude)
        setHlon(DATA.longitude)
        setDestino('[' + [DATA.longitude, DATA.latitude] + ']')
      })
  }, [origem]);

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      console.log(info.coords)
      setOrigem('[' + [info.coords.longitude+','+info.coords.latitude] + ']')
    });
  }, []);

  useEffect(() => {
    console.log("hs: " + hospitalId);
    console.log("oc: " + idOcorrencia);
  }, []);

  useEffect(() => {
    console.log('org' + origem);
    console.log('dst' + destino);
    if (origem && destino) {
      infoGeo(origem.toString(), destino.toString())
    }
  }, [origem, destino]);

  useEffect(() => {
    console.log('================ > Register.tsx - useEffect');
    console.log('Hosp: ' + hospitalId);
    console.log('Ocor: ' + idOcorrencia);
    //getOcorrencia(idOcorrencia)
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={80}
      style={{ flex: 1 }}
      bg={especColors.coresPadrao.bg0}
    >
      <ScrollView>
        <HStack
          w="full"
          justifyContent="space-between"
          alignItems="center"
          bg={especColors.coresPadrao.head0}
          pt={1}
          pb={1}
          px={2}
        >
          <Logo />
          <IconButton
            icon={<SignOut size={26} color={colors.black} />}
            onPress={handleLogout}
          />
        </HStack>

        <HStack bg={especColors.coresPadrao.bgTitulos} justifyContent="center" p={4}>
          <Hourglass size={22} color={colors.green[300]} />
          <Text
            fontSize="sm"
            ml={2}
            textTransform="uppercase"
            color={colors.green[300]}
          >
            Conduzir para Hospital
          </Text>
        </HStack>
        <VStack justifyContent="center" p={4} space={1} alignItems="center">
        </VStack>
        <VStack w='full' bg={especColors.coresPadrao.bg1} space={1} alignItems="center">
          <Heading>
            <Text
              textAlign='center'
              fontSize="sm"
              ml={2}
              textTransform="uppercase"
              color={colors.white} >
              {hospital ? hospital.nm_hospital : isLoading}
            </Text>
          </Heading>
          {
            hospital ?
              <>
                <Hospital dataHospital={hospital} w='full' px={2} />
                <Text color={colors.white}>Distância: {distancia ? (Number(distancia) / 1000).toFixed(2) + "km" : <Text>Carregando...</Text>} </Text>
                <Text color={colors.white}>Tempo para chegada: {tempo ? (tempo.temp).toFixed(2) + " " + tempo.tipo + "\n" : <Text>Carregando...</Text>}</Text>
              </>
              :
              <Text>Carregando...</Text>
          }
        </VStack>
      </ScrollView>
      <VStack w='full' space={1} mb={5}>
        <HStack
          w="full"
          justifyContent="space-between"
          alignItems="center"
          pt={1}
          pb={1}
          px={2}>
          <Button title='Não' m={1} w='2/5' />
          <Button title='Sim' m={1} w='2/5' onPress={() => { openGps(Hlat, Hlon, hospital.URL), pagResOcorrencia() }} />
        </HStack>
      </VStack>
    </KeyboardAvoidingView>

  );
}