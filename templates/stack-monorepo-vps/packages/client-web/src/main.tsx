/* @refresh reload */
import { render } from 'solid-js/web';
import { App } from './App.js';
import './styles.css';
import './i18n/index.js';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

render(() => <App />, root);
