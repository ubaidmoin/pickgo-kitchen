import React from 'react';
import {SafeAreaView} from 'react-native';
import {reducer} from './src/Services/State/Reducer';
import {StateProvider} from './src/Services/State/State';
import {initialState} from './src/Services/State/InitialState';
import Index from './src/index';

const App = () => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <SafeAreaView style={{flex: 1}}>
        <Index />
      </SafeAreaView>
    </StateProvider>
  );
};

export default App;
