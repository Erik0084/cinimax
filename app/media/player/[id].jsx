import Player from '@/components/business/player/Player';
import { useLocalSearchParams } from 'expo-router';

const PlayerScreen = () => {
  const { id } = useLocalSearchParams();
  
  return <Player id={id} />;
};

export default PlayerScreen;