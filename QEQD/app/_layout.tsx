import {View, Text, Image, ScrollView, TextInput} from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ItemsMovable from '@/app/(tabs)/items';
import Slot from '@/app/(tabs)/slot';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <>
    <View style={{
      display: 'flex',
      flexDirection:'column-reverse',
      backgroundColor: 'black',
      minHeight:'100%',
      width:'100%',
      paddingBottom:'15%'
    }}>
      <View style={{
        // position:'fixed',
        // bottom:50,
        // width:'100%'
      }}>
        <Text style={{
        color:"white",
        display:'flex',
        justifyContent:'center'
        }}>Placez les cartes au bonne endroit.</Text>
        <ItemsMovable/>    
      </View>
        <View style={{
          display:'flex',
          justifyContent:'space-around',
          flexDirection:'row',
          flexWrap:'wrap',
          paddingBottom:150,
        }}>
          <Slot></Slot>
          <Slot></Slot>
          <Slot></Slot>
          <Slot></Slot>
        </View> 
    </View>
    </>
  );
}
