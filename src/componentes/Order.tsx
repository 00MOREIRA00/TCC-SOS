import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { ClockAfternoon, Hourglass, CircleWavyCheck, FirstAid, Notepad } from 'phosphor-react-native';
import { especColors } from "../styles/especColors"
import { msg } from "../utils/mensagensPadrao"


export function Order({ data, ...rest }) {
  const { colors } = useTheme();
  const risco = (par: number) => {
    if (par === 1) { return { 'cor': especColors.risco.naoUrgencia, 'msg': msg.risco.naoUrgencia }; }
    if (par === 2) { return { 'cor': especColors.risco.poucaUrgencia, 'msg': msg.risco.poucaUrgencia }; }
    if (par === 3) { return { 'cor': especColors.risco.urgencia, 'msg': msg.risco.urgencia }; }
    if (par === 4) { return { 'cor': especColors.risco.muitaUrgencia, 'msg': msg.risco.muitaUrgencia }; }
    if (par === 5) { return { 'cor': especColors.risco.emergencia, 'msg': msg.risco.emergencia }; }
  }


  return (
    <Pressable {...rest}>
      {console.log(data)}
      <HStack
        bg={especColors.coresPadrao.card0}
        mb={4}
        alignItems="center"
        justifyContent="space-between"
        rounded="sm"
        overflow="hidden"
      >
        <Box h="full" w={4} bg={risco(data.sinaisVitais.risco).cor} />

        <VStack flex={1} my={5} ml={2}>
          <Text color="black" fontSize="md">
            Nome: {data.dadosPessoais.nmPaciente}
          </Text>
          {
            data.dadosPessoais.nmPaciente != 'Desconhecido' &&
            <>
              {
                data.dadosPessoais.telefone != "" &&
                <Text color="black" fontSize="md">
                  Telefone: {data.dadosPessoais.telefone}
                </Text>
              }
              {
                data.dadosPessoais.cpf != "" &&
                <Text color="black" fontSize="xs">
                  CPF: {data.dadosPessoais.cpf}
                </Text>
              }


            </>
          }

          <HStack alignItems="center">
            <Notepad size={15} color={colors.gray[700]} />
            <Text color="black" fontSize="xs" ml={5}>
              Freq: {data.sinaisVitais.frequencia}
            </Text>
            <Text color="black" fontSize="xs" ml={5}>
              Pressão: {data.sinaisVitais.pressao}
            </Text>
            <Text color="black" fontSize="xs" ml={5}>
              Sat: {data.sinaisVitais.saturacao}
            </Text>
          </HStack>
          <HStack alignItems="center">
            <FirstAid size={15} color={colors.gray[700]} />
            <Text color="gray.700" fontSize="xs" ml={1}>
              {risco(data.sinaisVitais.risco).msg}
            </Text>
          </HStack>
        </VStack>

      </HStack>
    </Pressable>
  );
}