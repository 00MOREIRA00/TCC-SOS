import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { ClockAfternoon, FirstAid, GlobeHemisphereWest, CircleWavyCheck } from 'phosphor-react-native';

export type HospitalProps =  {
        id: string,
        nm_hospital: string,
        latitude: string,
        longitude: string,
        bairro: string,
        cidade: string,
        lotacao: number,
        em_aberto: string,
        URL?: string
}

type Props = IPressableProps & {
    dataHospital: HospitalProps;
}

export function Hospital({ dataHospital, ...rest }: Props) {
    const { colors } = useTheme();
    
  return (
    <Pressable {...rest}>
        <HStack 
            bg="#FFFAF0"
            mb={4}
            alignItems="center"
            justifyContent="space-between"
            rounded="sm"
            overflow="hidden"
        >
            <Box h="full" w={4} bg={'red.500'}/>
            <VStack flex={1} my={5} ml={5}>
                <Text color="black" fontSize="md">
                    Nome: {dataHospital.nm_hospital}
                </Text>

                <HStack alignItems="center">
                    <GlobeHemisphereWest size={15} color={colors.gray[700]}/>
                    <Text color="gray.700" fontSize="xs" ml={1}>
                        Bairro: {dataHospital.bairro}
                    </Text>
                </HStack>

                <HStack alignItems="center">
                    <FirstAid size={15} color={colors.gray[700]}/>
                    <Text color="gray.700" fontSize="xs" ml={1}>
                        Lotação: {dataHospital.em_aberto} de {dataHospital.lotacao}
                    </Text>
                </HStack>
            </VStack>
        </HStack>
    </Pressable>
  );
}