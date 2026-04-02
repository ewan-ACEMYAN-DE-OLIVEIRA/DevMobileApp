import React, { useRef } from 'react';
// 1. On ajoute ImageSourcePropType dans l'import
import { View, Image, Animated, PanResponder, ImageSourcePropType } from 'react-native'; 

// 2. On définit une "Interface" pour dire à TypeScript à quoi s'attendre
interface DraggableImageProps {
    source: ImageSourcePropType;
}

// 3. On applique cette interface aux paramètres de notre composant
const DraggableImage = ({ source }: DraggableImageProps) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            // Met à jour la position de l'image quand le doigt bouge
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            // Effet ressort quand on lâche l'image
            onPanResponderRelease: () => {
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={{
                // On applique le déplacement X et Y
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
                // zIndex permet à l'image attrapée de passer au-dessus des autres
                zIndex: 1, 
            }}
        >
            <Image 
                source={source}
                // ⚠️ J'ai ajouté une hauteur (height), c'est obligatoire avec width en React Native
                // sinon ton image risque d'être écrasée ou invisible.
                style={{ width: 80, height: 80 }} 
            />
        </Animated.View>
    );
};

// 2. Ton composant principal qui boucle sur le tableau
export default function ItemsMovable() {
    return (
        <View style={{
            flex: 1, // Prend toute la hauteur de l'écran pour avoir de la place pour drag
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center' // Centre les images verticalement
        }}>
            {[1, 2, 3, 4].map((item, index) => (
                <DraggableImage 
                    key={index}                  
                    source={require('../../assets/images/react-logo.png')} 
                />
            ))}
        </View>
    );
}