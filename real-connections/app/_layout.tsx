// app/_layout.tsx
import { AuthProvider } from '../context/authContext';
import { Slot } from 'expo-router';
import { AtividadeProvider } from '../context/atividadeContext';


export default function Layout() {
  return (
    <AtividadeProvider>
    <AuthProvider>
      <Slot />
    </AuthProvider>
    </AtividadeProvider>
  );
}
