import { FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { Icons } from '../constants/icons';

const SeasonSelectionModal = ({ visible, onClose, onSelectSeason, currentSeason, seasons = [] }) => {
    const renderItem = ({ item }) => {
        const isSelected = currentSeason?.Id === item.Id;
        return (
            <TouchableOpacity
                className="py-3 items-center"
                onPress={() => {
                    onSelectSeason(item);
                    onClose();
                }}
            >
                <Text className={`text-h4 ${isSelected ? 'text-white font-bold' : 'text-grey'}`}>
                    {item.Name}
                </Text>
            </TouchableOpacity>
        );
    };

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
                    {seasons.length > 0 ? (
                        <FlatList
                            data={seasons}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.Id}
                            ItemSeparatorComponent={() => <View className="h-[1px] bg-gray-700 my-2" />}
                        />
                    ) : (
                        <Text className="text-grey text-center py-4">No seasons available</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default SeasonSelectionModal;