import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type OrderFirestoreDTO = {
    id_at: string, //Assentamentos
    observacao: string, //Assentamentos
    paciente: string,//novo
    nmPaciente: string,//novo
    nome: string;
    cpf?: string;
    telefone?: string;
    frequencia?: string;
    pressao?: string;
    saturacao?: string;
    temperatura?: string;
    risco?: number;
    problema: string;
    status: 'open'| 'close';
    atendimento?: string;
    responsavel?: string;
    created_at: FirebaseFirestoreTypes.Timestamp;
    closed_at?: FirebaseFirestoreTypes.Timestamp;
}