import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { dateFormat } from './firestoreDateFormats';

export function getOcorrencia(IDDOC: string, SOLICITANTE?: string) {
  console.log("Parametros: " + IDDOC, SOLICITANTE);

  return new Promise((resolve, reject) => {

    const docRef = firestore().collection('OCORRENCIA').doc(IDDOC);
    docRef.get().then((doc) => {
      if (doc.exists) {
        let dt = doc.data();
        //console.log(SOLICITANTE + " Data: ");
        //console.log(data);
        resolve(dt);
      } else {
        // doc.data() will be undefined in this case            
        reject(console.log(SOLICITANTE + ": Documento não encontrado"));
      }
    }).catch((error) => {
      console.log(SOLICITANTE + ": Erro buscando Documento:", error);
    });

  })
}

export function getInfo(COLLECTION: string, IDDOC: string, SOLICITANTE?: string) {
  console.log("Parametros: " + IDDOC, SOLICITANTE);

  return new Promise((resolve, reject) => {

    const docRef = firestore().collection(COLLECTION).doc(IDDOC);
    docRef.get().then((doc) => {
      if (doc.exists) {
        let dt = doc.data();
        resolve(dt);
      } else {
        // doc.data() will be undefined in this case            
        reject(console.log(SOLICITANTE + ": Documento não encontrado"));
      }
    }).catch((error) => {
      console.log(SOLICITANTE + ": Erro buscando Documento:", error);
    });

  })
}


export function getOcorrenciaSnap(COLLECTION: string, IDDOC: string, SOLICITANTE?: string) {
  console.log("Parametros: " + COLLECTION, IDDOC, SOLICITANTE);

  return new Promise((resolve, reject) => {

    firestore().collection(COLLECTION).doc(IDDOC)
      .onSnapshot((doc) => {
        //console.log(SOLICITANTE + ": ");
        //console.log(doc.data());
        const data = doc.data();
        resolve(data)
      }, (error) => {
        reject(console.log(SOLICITANTE + ": Documento não encontrado" + error));
      });

  });
}

export function getMinhasOcorrencias(user: string) {

  return new Promise((resolve, reject) => {

    firestore().collection('OCORRENCIA')
      .where('userLocal', '==', user)
      .onSnapshot(snapshot => {
        snapshot.docs.map(doc => {
          const {
            vtr,
            ocorrencia,
            ts_saida_base,
            ts_chegada_local,
            ts_saida_local,
            ts_chegada_hospital,
            ts_saida_hospital,
            ts_retorno_base,
            vetorVitimas
          } = doc.data();
          resolve({
            id: doc.id,
            vtr,
            ocorrencia,
            dt_saida_base: dateFormat(ts_saida_base),
            dt_chegada_local: dateFormat(ts_chegada_local),
            dt_saida_local: dateFormat(ts_saida_local),
            dt_chegada_hospital: dateFormat(ts_chegada_hospital),
            dt_saida_hospital: dateFormat(ts_saida_hospital),
            dt_retorno_base: dateFormat(ts_retorno_base),
            vetorVitimas
          });
        });
      });

  });
}

export function atualizaDados(IDDOC: string, DATA: any, SOLICITANTE?: string, MSG?: string) {
  console.log("Parametros: " + IDDOC, SOLICITANTE, DATA);

  return new Promise((resolve, reject) => {
    if (!DATA) {
      return Alert.alert(MSG, 'Verifique os campos e tente novamente');
    }
    firestore().collection('OCORRENCIA').doc(IDDOC)
      .update(
        DATA
      )
      .then(() => {
        console.log(SOLICITANTE + " - Update com sucesso! ");
        resolve(true);
      })
      .catch((error) => {
        reject(SOLICITANTE + " - Falha na atualização: " + error);
      });
  })
}



export function gravaDados(COLLECTION: string, DATA: any, SOLICITANTE: string, MSG: string) {
  console.log("Parametros: " + COLLECTION, SOLICITANTE);

  return new Promise((resolve, reject) => {
    if (!DATA) {
      return Alert.alert(MSG, 'Verifique os campos e tente novamente');
    }
    firestore()
      .collection(COLLECTION)
      .add(DATA.sinaisVitais)
      .then((docRef) => { //docRef retorna LastInsertID
        console.log(SOLICITANTE + " - Gravado com sucesso! ID do documento: " + docRef.id);
        resolve(docRef.id)
      })
      .catch((error) => {
        reject(console.log(SOLICITANTE + ": Erro na gravação: " + error));
        return Alert.alert(MSG, 'Não foi possivel gravar o registro.');
      });
  })
}

function sinaisVitais(idPaciente: string, DATA: any, DATAOCORRENCIA: any) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('ATENDIMENTO')
      .add({
        paciente: idPaciente,
        ...DATA.sinaisVitais,
        ...DATAOCORRENCIA
      }) //ver como unir o ID com o resto do objeto json
      .then(() => {
        console.log('Entrada', 'Registrado com sucesso!');
      })
      .catch((error) => {
        console.log(error);
        console.log('Registrar', 'Não foi possivel gravar o registro.');
      });
    resolve(true)
  })
}

function dadosPessoais(DATA: any, DATAOCORRENCIA: any) {
  return new Promise((resolve, reject) => {
    firestore()
      .collection('PACIENTE')
      .add(DATA.dadosPessoais)
      .then((docRef) => { //docRef retorna LastInsertID
        sinaisVitais(docRef.id, DATA, DATAOCORRENCIA)
      })
      .catch((error) => {
        console.log(error);
        console.log('Registrar', 'Não foi possivel gravar o registro.');
      });
    resolve(true)
  })
}

export function transfereHospital(DATA: any, DATAOCORRENCIA: any, SOLICITANTE?: string, MSG?: string) {
  console.log("Parametros: " + SOLICITANTE, DATA.length, DATA);

  return new Promise((resolve, reject) => {
    DATA.forEach((DATA) => { dadosPessoais(DATA, DATAOCORRENCIA) })
    resolve(true)
  })
}