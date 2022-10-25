import { Alert, FlatList, Linking, Platform, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Heading, HStack, IconButton, KeyboardAvoidingView, useTheme, VStack, Text, FormControl, Select, Center, Box, Input } from 'native-base';
import { FirstAid, MapPinLine, Notepad, PersonSimpleRun, SignOut, Truck } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import { Hourglass } from 'phosphor-react-native';

//Componentes
import { Button } from '../componentes/Button';
import { Loading } from '../componentes/Loading';

//Estilos e animações
import Logo from '../assets/Logo.svg';
import { especColors } from "../styles/especColors"

//Regra de negócio
import { Out } from '../utils/Out';
import { atualizaDados } from '../utils/crud'
import { dateFormat } from '../utils/firestoreDateFormats';
import { Hospital, HospitalProps } from '../componentes/Hospital';
import { OcorrenciaProps } from '../componentes/CardOcorrencia'

type RouteParams = { // Essa tipagem foi criada apenas para que o auto complite pudesse achar esse paramentro (Testar sem)
  idOcorrencia?: string;
}

export function IniciaOcorrencia() {
  //Estilização & efeitos
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const [titulo, setTitulo] = useState('VIATURA OU EQUIPE: ')
  const [exibeComponentes, setExibeComponentes] = useState([1, 0, 0, 0])

  //Navegação entre páginas
  const navigation = useNavigation();
  const route = useRoute();

  //informações vindas de Home.tsx
  const { idOcorrencia } = route.params as RouteParams;

  //Dados regra de negócio
  const [vetorOcorrencias, setVetorOcorrencias] = useState([]);
  const [relato, setRelato] = useState('')

  const handleLogout = Out();

  const navegarIncluiVitimas = (idOcorrencia: string) => {
    navigation.navigate('incluiVitima', { idOcorrencia })
  }

  function timeStamp(ts: {}, altComp: number) {
    setIsLoading(true);
    if (altComp == 0) {
      setExibeComponentes([0, 1, 0, 0]);
    } if (altComp == 1) {
      setExibeComponentes([0, 0, 1, 0]);
    } if (altComp == 2) {
      setExibeComponentes([0, 0, 0, 1]);
    }

    atualizaDados(idOcorrencia, ts, 'timeStamp()', 'IniciaOcorrencia')
      .then((data: boolean) => {
        if (data) {
          setIsLoading(false);
        }
      })
  }

  useEffect(() => {
    setIsLoading(true);
    console.log('================ > IniciaOcorrencia.tsx - useEffect');
    console.log(idOcorrencia);
    firestore().collection('OCORRENCIA').doc(idOcorrencia)
      .onSnapshot((doc) => {
        const data = doc.data();
        const dt: OcorrenciaProps = {
          vtr: data.vtr,
          userLocal: data.userLocal,
          ocorrencia: data.ocorrencia,
          dt_saida_base: dateFormat(data.ts_saida_base),
          dt_chegada_local: dateFormat(data.ts_chegada_local),
          dt_saida_local: dateFormat(data.ts_saida_local),
          dt_chegada_hospital: dateFormat(data.ts_chegada_hospital),
          dt_saida_hospital: dateFormat(data.ts_saida_hospital),
          dt_retorno_base: dateFormat(data.ts_retorno_base)
        }
        setVetorOcorrencias([dt]);
        console.log(dt);
        setIsLoading(false);
      });

  }, []);

  useEffect(() => {
    console.log("exibeComponentes: ")
    console.log(exibeComponentes);
  }, [exibeComponentes]);

  return (
    <VStack flex={1} pb={1} bg="#565656">
      <HStack w="full" justifyContent="space-between" alignItems="center" bg="#FFFAF0" pt={1} pb={1} px={2}>
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.black} />}
          onPress={handleLogout}
        />
      </HStack>
      {
        isLoading ? <Loading /> :
          <VStack flex={1} px={6} alignItems="center">
            <Heading fontSize={16} mt={5} color="#fff">
              {titulo} {vetorOcorrencias[0] ? vetorOcorrencias[0].vtr.toString().toUpperCase() : <Loading />}
            </Heading>
            <KeyboardAvoidingView
              behavior="height"
              style={{ flex: 1 }}
              bg={especColors.coresPadrao.bg0}
            >
              <ScrollView>
                {
                  exibeComponentes[1] == 1 || exibeComponentes[2] == 1 || exibeComponentes[3] == 1 ?
                    <FlatList
                      data={vetorOcorrencias}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => (
                        <VStack>
                          <VStack flex={1}
                            bg="#FFFAF0"
                            mt={2}
                            mb={2}
                            height={16}
                            alignItems="center"
                            justifyContent="space-between"
                            rounded="sm"
                            overflow="hidden">
                            <Text color="black" fontSize="md" m={5}>Saída de Base: {item.dt_saida_base}</Text>
                          </VStack>
                          {
                            vetorOcorrencias[0].dt_chegada_local != undefined &&
                            <VStack flex={1}
                              bg="#FFFAF0"
                              mt={2}
                              mb={2}
                              height={16}
                              alignItems="center"
                              justifyContent="space-between"
                              rounded="sm"
                              overflow="hidden">
                              <Text color="black" fontSize="md" m={5}>Chegada ao local: {item.dt_chegada_local}</Text>
                            </VStack>
                          }
                          {
                            exibeComponentes[3] == 1 &&
                            <VStack mt={5} mb={4} pr={6}>
                              <Text ml={2} mr={2} w={'full'} color='white' fontSize="md" textAlign='left'><Notepad size={26} color='white' />Ocorrência: </Text>
                              <Text ml={2} mr={2} w={'full'} color='white' fontSize="md" textAlign='justify'>{item.ocorrencia}</Text>
                            </VStack>
                          }

                        </VStack>
                      )}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingBottom: 50 }}
                      ListEmptyComponent={() => (
                        <Center>
                          <Text color="#fff" fontSize="xl" mt={6} textAlign="center">
                            {'\n'}
                          </Text>
                        </Center>
                      )}
                    /> :
                    null
                }
                {
                  exibeComponentes[2] == 1 &&
                  <Input
                    bg="gray.600"
                    color={colors.light[100]}
                    placeholder='Relato da ocorrência:'
                    placeholderTextColor={colors.light[100]}
                    onChangeText={setRelato}
                    textAlignVertical="top"
                    multiline
                    h={'80'}
                    mt={4}
                    mb={4}
                  />
                }
                
              </ScrollView>

            </KeyboardAvoidingView>
            {
              exibeComponentes[0] == 1 &&
              <Button title='Saída da Base' mb={5} w={'full'}
                onPress={() => timeStamp({ 'ts_saida_base': firestore.FieldValue.serverTimestamp() }, 0)}
              />
            }{
              exibeComponentes[1] == 1 &&
              <Button title='Chegada ao local' mb={5} w={'full'}
                onPress={() => timeStamp({ 'ts_chegada_local': firestore.FieldValue.serverTimestamp() }, 1)}
              />
            }
            {
              exibeComponentes[2] == 1 &&
              <Button title='Grava ocorrência' mb={5} w={'full'}
                onPress={() => timeStamp({ 'ocorrencia': relato }, 2)}
              />
            }
            {
              exibeComponentes[3] == 1 &&
              <Button title='Incluir Vitimas' mb={5} w={'full'}
                onPress={()=>{navegarIncluiVitimas(idOcorrencia)}}
              />
            }
          </VStack>
      }
    </VStack>
  );
}