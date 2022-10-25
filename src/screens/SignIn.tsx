import { useState } from 'react';
import { VStack, Heading, Icon, KeyboardAvoidingView } from 'native-base';
import auth from '@react-native-firebase/auth'
import {Alert, ScrollView} from 'react-native';
import { Envelope, Key} from 'phosphor-react-native';
import Logo from '../assets/logotipo.svg';
import { Input } from '../componentes/Input';
import { Button } from '../componentes/Button';


export function SignIn(){

    const [email, setEmail ] =  useState('');
    const [password, setPassword ] =  useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleAssign(){
        if(!email || !email){
            return Alert.alert('Entrar', 'Informe e-mail e senha');
        }
        //setIsLoading(true);
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(response =>{
                console.log(response);
            })
            .catch((error)=>{
                setIsLoading(false);
                console.log(error);
                if(error.code === 'auth/invalid-email'){
                    return Alert.alert('Entrar', 'E-mail ou senha inválida')
                }
                if(error.code === 'auth/wrong-password'){
                    return Alert.alert('Entrar', 'E-mail ou senha inválida')
                }
                if(error.code === 'auth/user-not-found'){
                    return Alert.alert('Entrar', 'Usuário não cadastrado')
                }
                return Alert.alert('Entrar', 'Não foi possível acessar')
            })
        //console.log(email, password)
    }
    
    return (
        
        <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={50}
            style={{ flex: 1 }}  
            alignItems="center" 
            bg="#565656" 
            px={8} 
            pt={24}
        >       
            <Logo />
            <Heading color="#FFF" fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>
            <ScrollView style={{width:"100%"}}>
                <Input placeholder="E-mail" mb={4} InputLeftElement={<Icon as ={ <Envelope color="black" /> } ml={4} />} onChangeText={setEmail}/>
                <Input placeholder="Senha" mb={4}  InputLeftElement={<Icon as ={ <Key color="black"/> } ml={4} />} secureTextEntry onChangeText={setPassword}/>
                <Button 
                    title="Entrar"  
                    w="full" 
                    onPress={handleAssign}
                    isLoading={isLoading}
                />
            </ScrollView>
                        
        </KeyboardAvoidingView>

    )
}