import { Box, Circle, HStack, Text, useTheme, VStack, Pressable, IPressableProps } from 'native-base';
import { ClockAfternoon, Hourglass, CircleWavyCheck } from 'phosphor-react-native';

export type AssentDetails = {
    id: string;
    userLocal: string;
    observacao: string;
    when: string;
}

type Props = IPressableProps & {
    data: AssentDetails;
}

export function Assentamento({ data, ...rest }: Props) {
    const { colors } = useTheme();
    return (
        <HStack
            bg="#FFFAF0"
            mb={4}
            alignItems="center"
            justifyContent="space-between"
            rounded="sm"
            overflow="hidden"
        >
            <VStack flex={1} my={5} ml={5}>
                <Text color="black" fontSize="md">
                    {data.observacao}
                </Text>
                <HStack alignItems="center">
                    <ClockAfternoon size={15} color={colors.gray[700]} />
                    <Text color="gray.700" fontSize="xs" ml={1}>
                        {data.when}
                    </Text>
                </HStack>
                <Text color="gray.700" fontSize="xs" ml={1}>
                    Responsável: {data.userLocal}
                </Text>
            </VStack>
        </HStack>

    );
}