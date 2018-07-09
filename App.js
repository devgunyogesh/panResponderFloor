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
import Datastore from 'react-native-local-mongodb';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};

// const printer = require('./printer.png');
// const cartridge = require('./cartridge.png');
// const modem = require('./modem.png');
// const icons = {
//   printer: require('./printer.png'),
//   cartridge: require('./cartridge.png'),
//   modem: require('./modem.png')
// }

const icons = {
  printer: require('./printer.png'),
  cartridge: require('./cartridge.png'),
  modem: require('./modem.png')
}


var db = new Datastore({ filename: 'asyncStorageKey', autoload: true });
export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.dataDrag = [1, 2, 3, 4, 5];
    this.pan = this.dataDrag.map(() => new Animated.ValueXY()),
      this.allIcons = [
        { number: this.dataDrag ,name: 'printer', path: require('./printer.png') },
      ]
    this.state = {
      showDraggable: true,
      dropZoneValues: null,

      icons: [{ x: 0, y: 0 }],
      panO: new Animated.ValueXY(),
      panTw: new Animated.ValueXY(),
      panTh: new Animated.ValueXY(),
    };
  }

  getPanResponder(index) {
    console.log("Yogesh", this.pan)
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this.pan[index].setOffset({ x: this.pan[index].x._value, y: this.pan[index].y._value });
        this.pan[index].setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, {
        dx: this.pan[index].x,
        dy: this.pan[index].y
      }]),
      onPanResponderRelease: (evt, { dx, dy }) => {
        console.log(dx);
        console.log(dy);
        this.pan[index].flattenOffset();
        this.updateDB(dx, dy);
      },
    });
  }

  // componentWillMount() {
  //   this.panResponder = PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onMoveShouldSetPanResponderCapture: () => true,
  //     onPanResponderGrant: (e, gestureState) => {
  //       this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
  //       this.state.pan.setValue({ x: 0, y: 0 });
  //     },
  //     onPanResponderMove: Animated.event([null, {
  //       dx: this.state.pan[index].x,
  //       dy: this.state.pan[index].y
  //     }]),
  //     onPanResponderRelease: (evt, { dx, dy }) => {
  //       console.log(dx);
  //       console.log(dy);
  //       this.state.pan.flattenOffset();
  //       this.updateDB(dx, dy);
  //     },
  //   });

  //   this.panResponderO = PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event([null, {
  //       dx: this.state.panO.x,
  //       dy: this.state.panO.y
  //     }]),
  //     onPanResponderRelease: (e, gesture) => {
  //       // Animated.spring(
  //       //   this.state.panO,
  //       //   { toValue: { x: 0, y: 0 } }
  //       // ).start();
  //     }
  //   });

  //   this.panResponderTw = PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event([null, {
  //       dx: this.state.panTw.x,
  //       dy: this.state.panTw.y
  //     }]),
  //     onPanResponderRelease: (e, gesture) => {
  //       Animated.spring(
  //         this.state.panTw,
  //         { toValue: { x: 0, y: 0 } }
  //       ).start();
  //     }
  //   });

  //   this.panResponderTh = PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event([null, {
  //       dx: this.state.panTh.x,
  //       dy: this.state.panTh.y
  //     }]),
  //     onPanResponderRelease: (e, gesture) => {
  //       Animated.spring(
  //         this.state.panTh,
  //         { toValue: { x: 0, y: 0 } }
  //       ).start();
  //     }
  //   });
  // }

  isDropZone(gesture) {
    var dz = this.state.dropZoneValues;
    return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height;
  }

  setDropZoneValues(event) {
    this.setState({
      dropZoneValues: event.nativeEvent.layout
    });
  }


  updateDB(dx, dy) {
    const { icons } = this.state;
    let arr = icons;
    let temp = icons[icons.length - 1];
    arr.push({ x: temp.x + dx, y: temp.y + dy });
    console.log(arr);
    this.setState({ icons: arr });
    db.update({ name: 'points' }, { $inc: { x: dx, y: dy } }, { upsert: true }, function (error, newDoc) {
      console.log(newDoc);
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
    const { cartridge, modem, printer } = icons
    var i
    console.log("HEllo")
    return (
      <View style={styles.draggableContainer}>
         {this.allIcons.map((icon, indexs) => {
          console.log(indexs, "All  Ucis", icon)
          return (
            this.dataDrag.map((d, index) => {
              console.log(d, "POP")

              return (
                <Animated.View
                  key={index}
                  {...this.getPanResponder(index).panHandlers}
                  style={[styles.draggableContainer, this.pan[index].getLayout(), styles.circle]}>
                  
                  <Text style={styles.text}>{icon.name} {index}</Text>
                  <Image
                    key={index}
                    source={icon.path}
                    style={styles.iconStyling}
                  />
                </Animated.View>
              )
            })
          )
        })}


        {/* <Animated.View
          {...this.panResponder.panHandlers}
          style={[this.state.pan.getLayout(), styles.circle]}>
          <Text style={styles.text}>Drag me!</Text>
        </Animated.View>
        <Animated.View
          {...this.panResponderO.panHandlers}
          style={[this.state.panO.getLayout()]}>
          <Image
            source={cartridge}
            style={styles.iconStyling}
          />
        </Animated.View>
        <Animated.View
          {...this.panResponderTw.panHandlers}
          style={[this.state.panTw.getLayout()]}>
          <Image
            source={modem}
            style={styles.iconStyling}
          />
        </Animated.View>
        <Animated.View
          {...this.panResponderTh.panHandlers}
          style={[this.state.panTh.getLayout()]}>
          <Image
            style={styles.iconStyling}
            source={printer}
          />
        </Animated.View> */}
      </View>




    );

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
    // marginTop: 25,
    marginLeft: 5,
    marginRight: 5,
    textAlign: 'center',
    color: '#000000'
  },
  draggableContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 620,
    backgroundColor: 'pink',
    padding: 10,
    height: Window.height,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 4,
    // borderWidth: 0.5,
    // borderColor: '#d6d7da',

  },
  circle: {
    backgroundColor: 'transparent',
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
  iconStyling: {
    height: 60,
    width: 60
  }
});