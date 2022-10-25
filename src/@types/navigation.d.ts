export declare global {
    namespace ReactNavigation {
        interface RootParamList {
            home: { hospitalId: String };
            iniciaOcorrencia: { idOcorrencia: String };
            ocorrencia: { idOcorrencia: String } ;
            incluiVitima: { idOcorrencia: String };
            SelectHospital: {  idOcorrencia: String  };
            register: { hospitalId: String, idOcorrencia?: string };
            finalizaOcorrencia: { hospitalId?: String, idOcorrencia?: string };
            details: { orderId: String, hospitalId: String };
        }
    }
}