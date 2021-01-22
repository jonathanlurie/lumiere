import React from 'react';
import icon from '../../../assets/icon.svg';
import SomeCom from '../../components/SomeCom'
import LedRing from '../../components/LedRing'
import { ipcRenderer } from 'electron'


async function onUniqueLedChange(ledIndex, color) {
  const res = await ipcRenderer.invoke('uniqueLedChange', [ledIndex, color])
  // console.log('result: ', res)
}


async function onGlobalLedChange(color) {
  const res = await ipcRenderer.invoke('globalLedChange', [color])
}

const Hello = () => {
  return (
    <div>
      <LedRing onUniqueLedChange={onUniqueLedChange} onGlobalLedChange={onGlobalLedChange}/>
    </div>
  );
};

export default Hello
