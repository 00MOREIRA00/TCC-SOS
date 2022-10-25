
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { VStack, Text, HStack, useTheme, ScrollView, FlatList, Center, AlertDialog } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

import { Header } from '../componentes/Header';
import { Loading } from '../componentes/Loading';
import { Button } from '../componentes/Button';
import { CardDetails } from '../componentes/CardDetails';

import { Assentamento, AssentDetails } from '../componentes/Assentamento';
import { OrderFirestoreDTO } from '../DTOs/OderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormats';
import { CircleWavyCheck, Heart, Hourglass, Clipboard } from 'phosphor-react-native';
import { Input } from '../componentes/Input';

type RouteParams = {
  orderId: string;
  hospitalId: string;
  user: {};
}

type OrderDetails = {
  id: string;
  paciente: string;
  frequencia: string;
  pressao: string;
  saturacao: string;
  temperatura: string;
  problema: string;
  risco: number;
  when: string;
  atendimento: string;
  closed: string;
  status: string;
  responsavel: string;
}

type PacienteDetails = {
  id: string;
  nmPaciente: string;
  cpf: string;
  telefone: string;
}

export function Details() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [atendimento, setAtendimento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [insertReg, setInsertReg] = useState(false);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const [pacient, setPacient] = useState<PacienteDetails>({} as PacienteDetails);
  const [assentamento, setAssentamento] = useState<AssentDetails[]>([]);
  //const [order, setOrder] = useState({});
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId, hospitalId } = route.params as RouteParams;
  const userLocal = auth().currentUser.email;

  function handleOrderClose() {
    if (!atendimento) {
      return Alert.alert('Atendimento', 'Descrever  ')
    }
    firestore().collection<OrderFirestoreDTO>('ATENDIMENTO').doc(orderId)
      .update({
        status: 'close',
        atendimento,
        responsavel: userLocal,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Atendimento', 'Paciente Liberado')
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Atendimento', 'Não foi possivel finalizar o atendimento')
      })

  }

  function handleOrderAssent(idAtendimento: string) {

    if (!observacao) {
      return Alert.alert('Registro', 'Descrever  ')
    }
    AlertDialog
    firestore().collection('ASSENTAMENTO')
      .add({
        id_at: idAtendimento,
        userLocal,
        observacao,
        created_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Registro', 'Sucesso')
        setInsertReg(false)
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Registro', 'Não foi possivel realizar o registro')
      })
  }

  function getAssentamento(idAtendimento: string) {
    firestore().collection('ASSENTAMENTO')
      .where('id_at', '==', idAtendimento)
      //.orderBy('risco', 'desc')
      .onSnapshot(snapshot => {
        const dataAssent = snapshot.docs.map(doc => {
          const { observacao, userLocal, created_at } = doc.data();

          return {
            id: doc.id,
            userLocal,
            observacao,
            when: dateFormat(created_at)
          }
        });
        //console.log("------------");
        //console.log(dataAssent);
        setAssentamento(dataAssent)

      }, ((error) => console.error(error)));
  }

  useEffect(() => {
    firestore().collection<OrderFirestoreDTO>('ATENDIMENTO').doc(orderId).get()
      .then((doc) => {
        const {
          created_at,
          frequencia,
          pressao,
          problema,
          risco,
          saturacao,
          status,
          temperatura,
          paciente,
          closed_at,
          atendimento,
          responsavel
        } = doc.data();
        //console.log(orderId);
        //console.log(paciente);
        getPaciente(paciente);
        const closed = closed_at ? dateFormat(closed_at) : null;
        setOrder({
          id: doc.id,
          paciente,
          risco,
          frequencia,
          pressao,
          saturacao,
          temperatura,
          problema,
          when: dateFormat(created_at),
          status,
          atendimento,
          closed,
          responsavel
        });
        getAssentamento(orderId)
        setIsLoading(false);
      })
  }, [])

  function getPaciente(idPaciente: string) {
    firestore().collection<OrderFirestoreDTO>('PACIENTE').doc(idPaciente).get()
      .then((doc) => {
        const {
          nmPaciente,
          cpf,
          telefone
        } = doc.data();
        setPacient({
          id: doc.id,
          nmPaciente,
          cpf,
          telefone
        });
      });
  }
  if (isLoading) {
    return <Loading />
  }

  if (!insertReg) {
    return (
      <VStack flex={1} bg="#565656">
        <Header title="Detalhe Atendimento" />
        <HStack bg="gray.500" justifyContent="center" p={4}>
          {
            order.status === 'close'
              ? <CircleWavyCheck size={22} color={colors.green[300]} />
              : <Hourglass size={22} color={colors.green[300]} />
          }

          <Text
            fontSize="sm"
            color={order.status === 'close' ? colors.green[300] : colors.secondary[700]}
            ml={2}
            textTransform="uppercase"
          >
            {order.status === 'close' ? 'Liberado' : 'Aguardando'}
          </Text>
        </HStack>
        <ScrollView
          mx={5}
          showsVerticalScrollIndicator={false}
        >
          <CardDetails
            title={pacient.nmPaciente}
            cpf={pacient.cpf}
            pressao={'Freq: ' + order.frequencia}
            saturacao={'Pres: ' + order.pressao}
            frequencia={'Sat: ' + order.saturacao}
            temperatura={'Temp: ' + order.temperatura}
            icon={Heart}
            footer={'Entrada: ' + order.when}
          />
          <CardDetails
            title='Motivo entrada'
            description={'Reclamação: ' + order.problema}
            icon={Clipboard}
          />
                    
          {
            assentamento.length >=1 &&
            <CardDetails
              title='Registros'
              children={
                <FlatList
                  data={assentamento}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => <Assentamento data={item} /* onPress={ () => handleOpenDetails(item.id_at, hospitalId) }  */ />}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 50 }}
                  ListEmptyComponent={() => (
                    <Text></Text>
                  )}
                />
              }
              icon={Clipboard}
            />
          }

          {
            order.status === 'open' &&
            <Button
              title='Novo registro'
              m={5}
              onPress={() => { setInsertReg(true) }}
            />
          }

          <CardDetails
            title='Alta'
            description={order.atendimento}
            footer={order.closed && 'Alta em: ' + order.closed + "\nResponsável: " + order.responsavel}
            icon={CircleWavyCheck}
          >
            {
              order.status === 'open' &&
              <Input
                bg="gray.600"
                color={colors.light[100]}
                placeholder='Descrição:'
                placeholderTextColor={colors.light[100]}
                onChangeText={setAtendimento}
                textAlignVertical="top"
                multiline
                h={24}
              />
            }
          </CardDetails>

        </ScrollView>
        {
          order.status === 'open' &&
          <Button
            title='Finalizar atendimento'
            m={5}
            onPress={handleOrderClose}
          />
        }
      </VStack>
    );
  } else {
    return (
      <VStack flex={1} bg="#565656">
        <Header title="Novo registro" />
        <CardDetails
          title='Registro'
          description={""}
          icon={CircleWavyCheck}
        >
          {
            order.status === 'open' &&
            <Input
              bg="gray.600"
              color={colors.light[100]}
              placeholder='Descrição:'
              placeholderTextColor={colors.light[100]}
              onChangeText={setObservacao}
              textAlignVertical="top"
              multiline
              h={24}
            />
          }
        </CardDetails>


        <Button
          title='Cancelar'
          m={5}
          onPress={() => { setInsertReg(false) }}
        />
        <Button
          title='Gravar'
          m={5}
          onPress={() => { handleOrderAssent(orderId) }}
        />
      </VStack>

    )
  }

}