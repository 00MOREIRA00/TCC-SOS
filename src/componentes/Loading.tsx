import { Center, Spinner } from "native-base";

export function Loading(){
    return (
        <Center flex={1} bg="#565656">
            <Spinner color="secondary.700" size="lg"/>
        </Center>
    );
}