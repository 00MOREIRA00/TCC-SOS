import { createNativeStackNavigator } from '@react-navigation/native-stack'


import { Home } from '../screens/Home';
import { IniciaOcorrencia } from '../screens/IniciaOcorrencia';
import { IncluiVitima } from '../screens/IncluiVitima';
import { SelectHospital } from '../screens/SelectHospital';
import { Register } from '../screens/Register';
import { Details } from '../screens/Details';
import { FinalizaOcorrencia } from '../screens/FinalizaOcorrencia';

import { Ocorrencia } from '../screens/Ocorrencia';

const { Navigator, Screen} =  createNativeStackNavigator();

export function AppRoutes(){
    return(
        <Navigator screenOptions={{ headerShown:false }}>
            <Screen name="home" component={Home} />
            <Screen name="iniciaOcorrencia" component={IniciaOcorrencia} />
            <Screen name="ocorrencia" component={Ocorrencia} />
            <Screen name="incluiVitima" component={IncluiVitima} />
            <Screen name="register" component={Register} />
            <Screen name="details" component={Details} />
            <Screen name="SelectHospital" component={SelectHospital} />
            <Screen name="finalizaOcorrencia" component={FinalizaOcorrencia} />              
        </Navigator>
    )
}