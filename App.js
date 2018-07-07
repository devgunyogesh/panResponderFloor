/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions,
  Image
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      showDraggable: true,
      dropZoneValues: null,
      pan: new Animated.ValueXY(),
      panO: new Animated.ValueXY(),
      panTw: new Animated.ValueXY(),
      panTh: new Animated.ValueXY()

    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y
      }]),
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture)) {
          // this.setState({
          //   showDraggable: false
          // });
        } else {
          Animated.spring(
            this.state.pan,
            { toValue: { x: 0, y: 0 } }
          ).start();
        }
      }
    });

    this.panResponderO = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: this.state.panO.x,
        dy: this.state.panO.y
      }]),
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture)) {
          // this.setState({
          //   showDraggable: false
          // });
        } else {
          Animated.spring(
            this.state.panO,
            { toValue: { x: 0, y: 0 } }
          ).start();
        }
      }
    });

    this.panResponderTw = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: this.state.panTw.x,
        dy: this.state.panTh.y
      }]),
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture)) {
          // this.setState({
          //   showDraggable: false
          // });
        } else {
          Animated.spring(
            this.state.panTw,
            { toValue: { x: 0, y: 0 } }
          ).start();
        }
      }
    });

    this.panResponderTh = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: this.state.panTh.x,
        dy: this.state.panTh.y
      }]),
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropZone(gesture)) {
          // this.setState({
          //   showDraggable: false
          // });
        } else {
          Animated.spring(
            this.state.panTh,
            { toValue: { x: 0, y: 0 } }
          ).start();
        }
      }
    });
  }

  

  isDropZone(gesture) {
    var dz = this.state.dropZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  setDropZoneValues(event) {
    this.setState({
      dropZoneValues: event.nativeEvent.layout
    });
  }

  render() {
    return (
      <View style={styles.mainContainer}>

        <View
          onLayout={this.setDropZoneValues.bind(this)}
          style={styles.dropZone}>
          <Image
            source={require('./Floorplan.jpg')}
            style={styles.floorImage}
          />
          {/* <Text style={styles.text}>Drop me here!</Text> */}
        </View>
        {this.renderDraggable()}


      </View>
    );
  }


  renderDraggable() {
    if (this.state.showDraggable) {
      return (
        <View style={styles.draggableContainer}>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[this.state.pan.getLayout(), styles.circle]}>
            <Text style={styles.text}>Drag me!</Text>
          </Animated.View>

          <Animated.View
            {...this.panResponderO.panHandlers}
            style={[this.state.panO.getLayout()]}>
            <Image
              source={require('./cartridge.png')}
              style={styles.iconStyling}
            />
          </Animated.View>
          <Animated.View
            {...this.panResponderTw.panHandlers}
            style={[this.state.panTw.getLayout()]}>
            <Image
              source={require('./modem.png')}
              style={styles.iconStyling}

            />
          </Animated.View>
          <Animated.View
            {...this.panResponderTh.panHandlers}
            style={[this.state.panTh.getLayout()]}>
            <Image
              style={styles.iconStyling}

              source={require('./printer.png')}
            />
          </Animated.View>
        </View>




      );
    }
  }
}


let CIRCLE_RADIUS = 36;
let Window = Dimensions.get('window');
let styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  dropZone: {
    width: Window.width - 100,
    height: Window.height,
    backgroundColor: '#ffffff',
    justifyContent: 'center'
  },
  text: {
    marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#fff'
  },
  draggableContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    // width: 120,
    // backgroundColor: 'pink',
    padding: 10,
    height: Window.height,
    justifyContent: 'center',
    alignItems: 'center'

  },
  circle: {
    backgroundColor: '#1abc9c',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS
  },
  floorImage: {
    width: Window.width
  },
  dragableMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyling:{
    height: 60,
    width: 60
  }
});