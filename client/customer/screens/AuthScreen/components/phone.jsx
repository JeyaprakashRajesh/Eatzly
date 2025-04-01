import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions } from "react-native";
import { primary, lightblack, lightgray } from "../../../utils/color";
import { SafeAreaView } from "react-native-safe-area-context";
const {width, height} = Dimensions.get('window');

export default function Phone({ navigation, phone, setPhone }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topContainer}>
                <Image source={require("../../../assets/images/loginIllustration.png")} style={styles.topImage}/>
            </View>
            <View style={styles.bottomContainer}>
                <View style={{width: '90%', alignItems: 'center'}}>
                    <Text style={styles.title}>
                        Sign in using Mobile number
                    </Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.subTitle}>
                           mobile number
                        </Text>
                        <TextInput 
                            style={styles.input}
                            placeholder="mobile number"
                            placeholderTextColor={"gray"}
                            value={phone}                            
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            maxLength={10}
                            autoFocus={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="done"
                        />
                    </View>
                </View>
                <View >

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: primary,
        justifyContent : 'center',
        alignItems: 'center',
    },
    topContainer : {
        height: 250,
        width: '100%',
        justifyContent: 'flex-end',  
        alignItems: 'center', 
    },
    bottomContainer : {
        flex: 1,
        width: '90%',
        backgroundColor: "white",
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        borderRadius: 60,
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '10%'
    },
    topImage : {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    title : {
        fontFamily: 'montserrat-bold',
        fontSize: width * 0.045,
        color: lightblack,
        width: '100%',
        textAlign: 'center',
    },
    subTitle : {
        fontFamily: 'montserrat-semibold',
        fontSize: width * 0.03,
        color: lightblack,
    },
    input : {
        borderRadius: 8,
        width: '100%',
        height: 50,
        borderColor: primary,
        borderWidth: 2,
        paddingHorizontal: 20,
        outline: 'none',
        fontFamily: 'montserrat-regular',
    },
    inputContainer : {
        width: '90%',
        marginTop: 30,
        flexDirection: 'column',
    }

})