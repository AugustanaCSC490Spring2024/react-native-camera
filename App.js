import { StyleSheet, Text, View, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from "expo-media-library";
import React, { useState, useEffect, useRef } from 'react';
import Button from './src/components/Button';
import { style } from 'deprecated-react-native-prop-types/DeprecatedViewPropTypes';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  // Give Expo permission to access your local photo library,
  // Access the camera
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status == 'granted');
    })();
  }, [])

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  }

  const savePicture = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Picture Saved!');
        setImage(null);
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <View style={styles.container}>
      {!image ?
      <Camera
        style={styles.camera}
        type={type}
        flash={flash}
        ref={cameraRef}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 30,
          paddingTop: 40
        }}>
          <Button icon={'retweet'} onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}/>
          {/* <Button icon={'flash'}/> */}
        </View>
      </Camera>
      : 
      <Image source={{uri: image}} style={styles.camera}/>
      }
      <View>
        {image ?
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 50,
        }}>
          <Button title={'Re-take'} icon='retweet' onPress={() => setImage(null)}/>
          <Button title={'Save'} icon='check' onPress={savePicture}/>
        </View>
        :
        <Button title={'Take a picture'} icon='camera' onPress={takePicture}/>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 20
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  }
});
