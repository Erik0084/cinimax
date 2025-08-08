import { FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '../constants/icons';

const seasons = [
    { id: '1', name: 'Season 1' },
    { id: '2', name: 'Season 2' },
    { id: '3', name: 'Season 3' },
    { id: '4', name: 'Season 4' },
    { id: '5', name: 'Season 5' },
];

const SeasonSelectionModal = ({ visible, onClose, onSelectSeason }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            className="py-3 items-center"
            onPress={() => {
                onSelectSeason(item.name);
                onClose();
            }}
        >
            <Text className={`text-h4 ${item.name === 'Season 1' ? 'text-white font-bold' : 'text-grey'}`}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-soft rounded-xl p-6 w-3/4">
                    <TouchableOpacity onPress={onClose} className="absolute top-3 right-3 p-2">
                        <Image source={Icons.remove} className="w-5 h-5" tintColor="#fff" />
                    </TouchableOpacity>
                    <FlatList
                        data={seasons}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-700 my-2" />}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default SeasonSelectionModal;