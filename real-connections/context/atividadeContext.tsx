import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './authContext'; 

type Atividade = {
  id: string;
  titulo: string;
  descricao: string;
  pontos: number;
  data: string;
};

type AtividadeUsuario = Atividade & {
  respondido: boolean;
};

type AtividadeContextType = {
  atividadesCriadas: Atividade[];
  atividadesUsuario: AtividadeUsuario[];
  pontosTotais: number;                     // novo: pontos acumulados
  adicionarAtividade: (atividade: Omit<Atividade, 'id'>) => void;
  enviarParaUsuario: (atividade: Atividade) => void;
  marcarComoRespondida: (id: string) => void;
  limparAtividades: () => void;
};

const AtividadeContext = createContext({} as AtividadeContextType);

export function AtividadeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || 'default';

  const [atividadesCriadas, setAtividadesCriadas] = useState<Atividade[]>([]);
  const [atividadesUsuario, setAtividadesUsuario] = useState<AtividadeUsuario[]>([]);
  const [pontosTotais, setPontosTotais] = useState(0);      // novo: estado dos pontos acumulados

  // Keys do AsyncStorage para cada usuário
  const keyAtividadesCriadas = `@atividades_criadas_${userId}`;
  const keyAtividadesUsuario = `@atividades_usuario_${userId}`;
  const keyPontosTotais = `@pontos_totais_${userId}`;       // nova key para pontos

  // Carrega dados do AsyncStorage (atividades + pontos)
  useEffect(() => {
    async function loadData() {
      try {
        const atividadesCriadasJSON = await AsyncStorage.getItem(keyAtividadesCriadas);
        const atividadesUsuarioJSON = await AsyncStorage.getItem(keyAtividadesUsuario);
        const pontosTotaisJSON = await AsyncStorage.getItem(keyPontosTotais);

        if (atividadesCriadasJSON) {
          setAtividadesCriadas(JSON.parse(atividadesCriadasJSON));
        } else {
          setAtividadesCriadas([]);
        }

        if (atividadesUsuarioJSON) {
          setAtividadesUsuario(JSON.parse(atividadesUsuarioJSON));
        } else {
          setAtividadesUsuario([]);
        }

        if (pontosTotaisJSON) {
          setPontosTotais(Number(pontosTotaisJSON));
        } else {
          setPontosTotais(0);
        }
      } catch (error) {
        console.error('Erro ao carregar atividades e pontos do storage:', error);
      }
    }
    loadData();
  }, [userId]);

  // Salva atividadesCriadas
  useEffect(() => {
    AsyncStorage.setItem(keyAtividadesCriadas, JSON.stringify(atividadesCriadas)).catch(error =>
      console.error('Erro ao salvar atividadesCriadas:', error),
    );
  }, [atividadesCriadas, keyAtividadesCriadas]);

  // Salva atividadesUsuario
  useEffect(() => {
    AsyncStorage.setItem(keyAtividadesUsuario, JSON.stringify(atividadesUsuario)).catch(error =>
      console.error('Erro ao salvar atividadesUsuario:', error),
    );
  }, [atividadesUsuario, keyAtividadesUsuario]);

  // Salva pontosTotais
  useEffect(() => {
    AsyncStorage.setItem(keyPontosTotais, pontosTotais.toString()).catch(error =>
      console.error('Erro ao salvar pontosTotais:', error),
    );
  }, [pontosTotais, keyPontosTotais]);

  function adicionarAtividade(atividade: Omit<Atividade, 'id'>) {
    const nova = { ...atividade, id: uuidv4() };
    setAtividadesCriadas((prev) => [...prev, nova]);
  }

  function enviarParaUsuario(atividade: Atividade) {
    const atividadeUsuario: AtividadeUsuario = {
      ...atividade,
      respondido: false,
    };
    setAtividadesUsuario((prev) => [...prev, atividadeUsuario]);
  }

  function marcarComoRespondida(id: string) {
    setAtividadesUsuario((prev) =>
      prev.map((a) => {
        if (a.id === id && !a.respondido) {
          // SOMA OS PONTOS só se não estava respondido antes
          setPontosTotais((oldPontos) => oldPontos + a.pontos);
          return { ...a, respondido: true };
        }
        return a;
      }),
    );
  }

  function limparAtividades() {
    setAtividadesCriadas([]);
    setAtividadesUsuario([]);
    setPontosTotais(0);                
    AsyncStorage.removeItem(keyAtividadesCriadas);
    AsyncStorage.removeItem(keyAtividadesUsuario);
    AsyncStorage.removeItem(keyPontosTotais);
  }

  return (
    <AtividadeContext.Provider
      value={{
        atividadesCriadas,
        atividadesUsuario,
        pontosTotais,                
        adicionarAtividade,
        enviarParaUsuario,
        marcarComoRespondida,
        limparAtividades,
      }}
    >
      {children}
    </AtividadeContext.Provider>
  );
}

export const useAtividade = () => useContext(AtividadeContext);
