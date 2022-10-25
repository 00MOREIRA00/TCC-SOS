import { Alert, FlatList, Linking, Platform, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Heading, HStack, IconButton, KeyboardAvoidingView, useTheme, VStack, Text, FormControl, Select, Center, Box, Input, Radio } from 'native-base';
import { FirstAid, MapPinLine, Notepad, PersonSimpleRun, SignOut, Truck } from 'phosphor-react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import { Hourglass } from 'phosphor-react-native';

//Componentes
import { Button } from '../componentes/Button';
import { Loading } from '../componentes/Loading';
import InputMask from '../componentes/InputMask';

//Estilos e animações
import Logo from '../assets/Logo.svg';
import { especColors } from "../styles/especColors"

//Regra de negócio
import { Out } from '../utils/Out';
import { atualizaDados } from '../utils/crud'
import { dateFormat } from '../utils/firestoreDateFormats';
import { msg } from '../utils/mensagensPadrao';
import { OcorrenciaProps, VitimasProps } from '../componentes/CardOcorrencia';
import { Order } from '../componentes/Order';

type RouteParams = { // Essa tipagem foi criada apenas para que o auto complite pudesse achar esse paramentro (Testar sem)
  idOcorrencia?: string;
}

export function IncluiVitima() {
  //Estilização & efeitos
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const [titulo, setTitulo] = useState('VIATURA OU EQUIPE: ')
  const [exibeComponentes, setExibeComponentes] = useState([1, 0, 0, 0])
  const [ocultaDados, setOcDados] = useState(true);

  //Navegação entre páginas
  const navigation = useNavigation();
  const route = useRoute();

  //informações vindas de Home.tsx
  const { idOcorrencia } = route.params as RouteParams;

  //Dados regra de negócio
  const [vetorOcorrencias, setVetorOcorrencias] = useState([]);
  const [vetorVitimas, setVetorVitimas] = useState([]);
  const [vetorVitimasTemp, setVetorVitimasTemp] = useState([]);
  const [relato, setRelato] = useState('')

  //dados pessoais das vitimas para vetorvitima
  const [nmPaciente, setnmPaciente] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  //sinais vitais das vitimas para vetorvitima
  const [pressao, setPressao] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [saturacao, setSaturacao] = useState('');
  const [risco, setRisco] = useState<Number>(1);
  const [observacoes, setObservacoes] = useState('');
  const [corRisco, setCorRisco] = useState('');

  const handleLogout = Out();

  const navegarSelectHospital = (idOcorrencia: string) => {
    navigation.navigate('SelectHospital', { idOcorrencia })
  }

  const confirmVitima = (title: string, msg?: string) => {
    return Alert.alert(
      title,
      msg,
      [
        {
          text: "Sim",
          onPress: () => {
            setOcDados(true);
            exibeRegVitimas();
          }
        },
        {
          text: "Não",
          onPress: () => {
            gravaDados({ vetorVitimas }, 0)
          }
        },
      ]
    );
  }

  function arrVitimas() {
    let validaNome = nmPaciente == "" ? 'Desconhecido' : nmPaciente;
    const objTemp = {
      "sinaisVitais": {
        pressao: pressao,
        frequencia: frequencia,
        saturacao: saturacao,
        problema: observacoes,
        risco: risco,
      },
      "dadosPessoais": {
        nmPaciente: validaNome,
        cpf: cpf,
        telefone: telefone,
        origem: 'sos'
      }
    }
    vetorVitimas.push(objTemp);
    console.log(vetorVitimas);
    confirmVitima('Incluir Vítima?');
  }

  function gravaDados(ts: {}, altComp: number) {
    setIsLoading(true);
    if (altComp == 0) {
      setExibeComponentes([0, 1, 0, 0]);
    } if (altComp == 1) {
      setExibeComponentes([0, 0, 1, 0]);
    } if (altComp == 2) {
      setExibeComponentes([0, 0, 0, 1]);
    }
    atualizaDados(idOcorrencia, ts, 'gravaDados()', 'Saída da base')
      .then((data: boolean) => {
        if (data) {
          setIsLoading(false);
        }
      })
  }//gravaDados

  function exibeRegVitimas() {
    return (
      <>
        {
          ocultaDados ?
            exibeDadosTriagem() :
            exibeDadosPessoais()
        }
      </>
    )
  }

  function exibeDadosTriagem() {
    return (
      <VStack>
        <InputMask
          value={pressao}
          mask="pressao"
          maxLength={6}
          placeholder="Pressão"
          placeholderTextColor={colors.black}
          inputMaskChange={(text: string) => setPressao(text)}
          keyboardType='number-pad'
        />
        <InputMask
          value={frequencia}
          mask="default"
          maxLength={6}
          placeholder="Frequência"
          placeholderTextColor={colors.black}
          inputMaskChange={(text: string) => setFrequencia(text)}
          keyboardType='number-pad'
        />
        <InputMask
          value={saturacao}
          mask="default"
          maxLength={6}
          placeholder="Saturação"
          placeholderTextColor={colors.black}
          inputMaskChange={(text: string) => setSaturacao(text)}
          keyboardType='number-pad'
        />
        <Input
          bg="gray.600"
          color={colors.light[100]}
          placeholder='Observações:'
          placeholderTextColor={colors.light[100]}
          onChangeText={setObservacoes}
          textAlignVertical="top"
          multiline
          h={48}
          mt={4}
        />
        <Select
          selectedValue={String(risco)}
          flex={1}
          accessibilityLabel="Grau de risco"
          placeholder="Grau de risco"
          fontSize={'lg'}
          backgroundColor={corRisco}
          _selectedItem={{
            bg: corRisco,
            _text: { color: colors.white }
          }}
          _item={{
            _text: { color: colors.white }
          }}
          mt={2}
          onValueChange={(itemValue) => setRisco(Number(itemValue))}
        >
          <Select.Item mt={2} backgroundColor={especColors.risco.naoUrgencia} label="Não é urgente" value="1" />
          <Select.Item mt={2} backgroundColor={especColors.risco.poucaUrgencia} label="Pouca urgência" value="2" />
          <Select.Item mt={2} backgroundColor={especColors.risco.urgencia} label="Urgência" value="3" />
          <Select.Item mt={2} backgroundColor={especColors.risco.muitaUrgencia} label="Muita urgência" value="4" />
          <Select.Item mt={2} backgroundColor={especColors.risco.emergencia} label="Emergência" value="5" />
        </Select>
        <Text color={colors.white} mt={3}>
          TEM OS DADOS DA VÍTIMA?
        </Text>
        <Radio.Group
          mt={2}
          defaultValue="1"
          name="myRadioGroup"
          accessibilityLabel="Vítima Consciente?"
        >
          <Radio _text={{ color: "#FFF" }} value="1" my={1} >
            Não
          </Radio>
          <Radio value="2" my={1} color={colors.white} onTouchEnd={() => setOcDados(false)}>
            Sim
          </Radio>
        </Radio.Group>
      </VStack>
    )
  }

  function exibeDadosPessoais() {

    return (
      <VStack>
        <FormControl isRequired>
          <InputMask
            value={nmPaciente}
            mask="default"
            maxLength={14}
            placeholder="Nome"
            placeholderTextColor={colors.black}
            inputMaskChange={(text: string) => setnmPaciente(text)}
            keyboardType='default'
          />
          <InputMask
            value={cpf}
            mask="cpf"
            maxLength={14}
            placeholder="CPF"
            placeholderTextColor={colors.black}
            inputMaskChange={(text: string) => setCpf(text)}
            keyboardType='number-pad'
          />
          <InputMask
            value={telefone}
            mask="phone"
            maxLength={14}
            placeholder="(99)9999-9999"
            placeholderTextColor={colors.black}
            inputMaskChange={(text: string) => setTelefone(text)}
            keyboardType='number-pad'
          />
        </FormControl>
      </VStack>
    )

  }

  useEffect(() => {
    setIsLoading(true);
    console.log('================ > Incluivitimas.tsx - useEffect');
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
          dt_retorno_base: dateFormat(data.ts_retorno_base),
          vetorVitimas: data.vetorVitimas
        }
        setVetorOcorrencias([dt]);
        setVetorVitimasTemp(dt.vetorVitimas)
        console.log(vetorVitimasTemp);
        setIsLoading(false);
      });

  }, []);

  useEffect(() => {
    console.log("exibeComponentes: ")
    console.log(exibeComponentes);
  }, [exibeComponentes]);

  useEffect(() => {
    //Pega os padrões de cores em /styles/especColors 
    if (risco === 1) { setCorRisco(especColors.risco.naoUrgencia) }
    if (risco === 2) { setCorRisco(especColors.risco.poucaUrgencia) }
    if (risco === 3) { setCorRisco(especColors.risco.urgencia) }
    if (risco === 4) { setCorRisco(especColors.risco.muitaUrgencia) }
    if (risco === 5) { setCorRisco(especColors.risco.emergencia) }
    if (!risco) { setCorRisco(colors.white) }
  }, [risco]);

  const riscoPadrao = (par: number) => {
    if (par === 1) { return { 'cor': especColors.risco.naoUrgencia, 'msg': msg.risco.naoUrgencia }; }
    if (par === 2) { return { 'cor': especColors.risco.poucaUrgencia, 'msg': msg.risco.poucaUrgencia }; }
    if (par === 3) { return { 'cor': especColors.risco.urgencia, 'msg': msg.risco.urgencia }; }
    if (par === 4) { return { 'cor': especColors.risco.muitaUrgencia, 'msg': msg.risco.muitaUrgencia }; }
    if (par === 5) { return { 'cor': especColors.risco.emergencia, 'msg': msg.risco.emergencia }; }
  }

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
          <VStack flex={1} px={6}>
            <Heading fontSize={16} mt={5} color="#fff" textAlign={'center'}>
              INCLUIR VÍTIMAS
            </Heading>
            <KeyboardAvoidingView
              behavior="height"
              style={{ flex: 1 }}
              bg={especColors.coresPadrao.bg0}
            >
              <ScrollView>
                <VStack w={'full'}>
                  {
                    exibeComponentes[1] == 1 || exibeComponentes[2] == 1 || exibeComponentes[3] == 1 ?
                    <FlatList
                    data={vetorVitimasTemp}
                    renderItem={({ item }) => <Order data={item} onPress={() => null} />}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    ListEmptyComponent={() => (
                      <Center>
                        <Text color="#fff" fontSize="xl" mt={6} textAlign="center">
                          0 Pacientes {'\n'}

                        </Text>
                      </Center>
                    )}
                  /> :
                      null
                  }
                  {
                    exibeComponentes[0] == 1 &&
                    exibeRegVitimas()
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
                </VStack>
              </ScrollView>

            </KeyboardAvoidingView>
            {
              exibeComponentes[0] == 1 &&
              <Button title="Salvar" mb={5} w={'full'}
                onPress={arrVitimas}
              />
            }{
              exibeComponentes[1] == 1 &&
              <Button title='Selecionar Hospital' mb={5} w={'full'}
                onPress={() => { navegarSelectHospital(idOcorrencia) }}
                //onPress={() => gravaDados({ 'ts_saida_local': firestore.FieldValue.serverTimestamp() }, null)}
              />
            }  
          </VStack>
      }
    </VStack>
  );
}