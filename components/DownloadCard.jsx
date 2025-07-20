import { Icons } from '@/constants/icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'


const DownloadCard = ({ item }) => {
    return (
        <View className="bg-soft flex-row gap-3 items-center rounded-xl p-3 mb-4">
            <View>
                <Image source={{ uri: item.image }} className="w-auto h-[80px] rounded-xl" style={{ aspectRatio: 2 / 2 }} />
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                        <Text className="text-grey text-sm mb-1">{item.category}</Text>
                        <Text className="text-white text-lg font-semibold">{item.title}</Text>
                    </View>
                    {item.downloading && (
                        <TouchableOpacity>
                            <Image source={Icons.pause} className="w-6 h-6 tint-white" />
                        </TouchableOpacity>
                    )}
                </View>

                {item.downloading ? (
                    <>
                        <View className="h-1 bg-gray-700 rounded-full mb-2">
                            <View
                                className="h-1 bg-blue_accent rounded-full"
                                style={{ width: `${item.progress * 100}%` }}
                            />
                        </View>
                        <Text className="text-grey text-xs">
                            ↓ {(item.progress * parseFloat(item.size)).toFixed(2)} of {item.size} | {Math.round(item.progress * 100)}%
                        </Text>
                    </>
                ) : (
                    <Text className="text-grey text-sm">
                        {item.type} | {item.size}
                    </Text>
                )}
            </View>
        </View>
    )
}

export default DownloadCard