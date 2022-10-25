import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export function Out() {
  return (
    function handleLogout(){
        auth()
        .signOut()
        .catch(error => {
            console.log(error);
            return Alert.alert('Sair', 'Não foi possivel sair.');
            });
    }
  );
}

