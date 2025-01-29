 
 
import './App.css'
import PoolList from './components/CoinsList';
import { usePools } from './hooks/usePools';

const App: React.FC = () => {
  const pools = usePools();

  return (
    <div>
      <h1>Sniper Bot</h1>
      <PoolList pools={pools} />
    </div>
  );
};

export default App
