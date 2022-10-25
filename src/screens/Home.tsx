import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { HStack, IconButton, VStack, useTheme, Heading, KeyboardAvoidingView, FlatList, Center, Text } from 'native-base';
import { SignOut } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';

//Estilos e animações
import Logo from '../assets/Logo.svg';
import { Button } from '../componentes/Button';
import { Input } from '../componentes/Input'
import { Loading } from '../componentes/Loading';
import { especColors } from '../styles/especColors';

//Regra de negócio
import { Out } from '../utils/Out';
import { getInfo } from '../utils/crud';
import { Ocorrencia, OcorrenciaProps } from '../componentes/CardOcorrencia';
import { dateFormat } from '../utils/firestoreDateFormats';

export function Home() {
  //Estilização
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [titulo, setTitulo] = useState('MINHAS OCORRÊNCIAS');

  //Navegação entre páginas
  const navigation = useNavigation();
  const route = useRoute();

  //Dados regra de negócio
  const [vtr, setVtr] = useState('');
  const userLocal = auth().currentUser.email;
  const [vetorOcorrencias, setVetorOcorrencias] = useState<OcorrenciaProps[]>([]);
  const [hospital, setHospital] = useState({});

  //controle exibição componentes
  const [formViatura, setFormViatura] = useState(false);

  const handleLogout = Out();

  const navegarSaidaBase = (idOcorrencia: string) => {
    setFormViatura(false);
    setVtr('');
    navigation.navigate('iniciaOcorrencia', { idOcorrencia })
  }

  const navegarDetalheOcorrencia = (idOcorrencia: string) => {
    navigation.navigate('ocorrencia', { idOcorrencia })
  }

  function gravaDados(COLLECTION: string, DATA: any, SOLICITANTE: string, MSG: string) {
    console.log("Parametros: " + COLLECTION, SOLICITANTE);
    if (!DATA) {
      console.log(MSG, 'Verifique os campos e tente novamente');
    }
    firestore()
      .collection(COLLECTION)
      .add(DATA)
      .then((docRef) => { //docRef retorna LastInsertID        
        console.log(SOLICITANTE + " - Gravado com sucesso! ID do documento: " + docRef.id);
        navegarSaidaBase(docRef.id);
      })
      .catch((error) => {
        console.log(SOLICITANTE + ": Erro na gravação: " + error);
        console.log(MSG, 'Não foi possivel gravar o registro.');
      });
  }

  function gravaViatura() {
    const data = {
      'vtr': vtr,
      'userLocal': userLocal
    }
    console.log(data);
    gravaDados('OCORRENCIA', data, 'navegaViatura - home.tsx', 'VTR OU EQUIPE')
  }
  function navegaViatura() {
    setTitulo('VIATURA OU EQUIPE');
    setFormViatura(true);
  }

  function getMinhasOcorrencias() {
    firestore().collection('OCORRENCIA')
      .where('userLocal', '==', userLocal)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const {
            vtr,
            ocorrencia,
            ts_saida_base,
            ts_chegada_local,
            ts_saida_local,
            ts_chegada_hospital,
            ts_saida_hospital,
            ts_retorno_base,
            vetorVitimas
          } = doc.data();
          return {
            id: doc.id,
            vtr,
            ocorrencia,
            dt_saida_base: dateFormat(ts_saida_base),
            dt_chegada_local: dateFormat(ts_chegada_local),
            dt_saida_local: dateFormat(ts_saida_local),
            dt_chegada_hospital: dateFormat(ts_chegada_hospital),
            dt_saida_hospital: dateFormat(ts_saida_hospital),
            dt_retorno_base: dateFormat(ts_retorno_base),
            vetorVitimas
          }

        })
        console.log(data)        
        setVetorOcorrencias(data)
        setIsLoading(false)
      }, ((error) => console.error(error)));
    return false;
  }

  useEffect(() => {
    console.log('================ > Home.tsx - useEffect');
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getMinhasOcorrencias()
  }, []);

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
        isLoading ? <Loading/> :
        <KeyboardAvoidingView
        behavior="height"
        style={{ flex: 1 }}
        bg={especColors.coresPadrao.bg0}
      >
        <ScrollView>
          <VStack flex={1} px={6} alignItems="center">
            <Heading fontSize={16} mt={5} color="#fff">
              {titulo}
            </Heading>
          </VStack>
          {
            formViatura ?
              <Input color={colors.white} placeholder="Equipe ou VTR" m={5} onChangeText={(text) => { setVtr(text) }} />
              :
              <FlatList
                m={2}
                ml={5}
                mr={5}
                data={vetorOcorrencias}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <Ocorrencia data={item} onPress={() => navegarDetalheOcorrencia(item.id)} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                ListEmptyComponent={() => (
                  <Center>
                    <Text color={colors.white}>Ainda não existem ocorrências</Text>
                  </Center>
                )}
              />
          }
        </ScrollView>
      </KeyboardAvoidingView>
      }
      {
        formViatura ?
          <Button title="Gravar" m={5} px={5} onPress={gravaViatura} /> :
          <Button title="Nova Ocorrência" m={5} px={5} onPress={navegaViatura} />
      }

    </VStack>
  );
}