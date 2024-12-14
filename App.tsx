import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Subscription } from 'expo-sensors/build/Pedometer';
import Svg, { Circle, Line, Path } from 'react-native-svg';

const CIRCLE_RADIUS = 120;
const INDICATOR_LENGTH = 100;

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
    Accelerometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription?.remove();
    setSubscription(null);
  };

  // 加速度からx,y軸の角度を計算
  const calculateAngle = () => {
    const angle = Math.atan2(y, x);
    return angle * (180 / Math.PI);
  };

  // 傾きの強さを計算（0-1の範囲）
  const calculateTiltStrength = () => {
    return Math.min(Math.sqrt(x * x + y * y), 1);
  };

  const renderCompass = () => {
    const centerX = CIRCLE_RADIUS;
    const centerY = CIRCLE_RADIUS;
    const angle = calculateAngle();
    const strength = calculateTiltStrength();
    
    // 傾きに基づいて線の終点を計算
    const endX = centerX + Math.cos(angle * Math.PI / 180) * INDICATOR_LENGTH * strength;
    const endY = centerY + Math.sin(angle * Math.PI / 180) * INDICATOR_LENGTH * strength;

    // 矢印の頭のサイズ
    const arrowSize = 15;
    
    // 傾き方向の矢印の頭を計算
    const arrowAngle = Math.atan2(endY - centerY, endX - centerX);
    const arrowPoint1X = endX - arrowSize * Math.cos(arrowAngle - Math.PI / 6);
    const arrowPoint1Y = endY - arrowSize * Math.sin(arrowAngle - Math.PI / 6);
    const arrowPoint2X = endX - arrowSize * Math.cos(arrowAngle + Math.PI / 6);
    const arrowPoint2Y = endY - arrowSize * Math.sin(arrowAngle + Math.PI / 6);

    return (
      <Svg height={CIRCLE_RADIUS * 2} width={CIRCLE_RADIUS * 2}>
        {/* 外側の円 */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={CIRCLE_RADIUS - 10}
          stroke="#333"
          strokeWidth="2"
          fill="none"
        />
        
        {/* 中心から傾きを示す線と矢印 */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={endX}
          y2={endY}
          stroke="#4CAF50"
          strokeWidth="3"
        />
        <Path
          d={`M ${endX} ${endY} L ${arrowPoint1X} ${arrowPoint1Y} L ${arrowPoint2X} ${arrowPoint2Y} Z`}
          fill="#4CAF50"
        />
        
        {/* 中心点 */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={5}
          fill="#4CAF50"
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.compassContainer}>
        {renderCompass()}
      </View>
      <View style={styles.dataContainer}>
        <Text>傾き強度: {calculateTiltStrength().toFixed(2)}</Text>
        <Text>角度: {calculateAngle().toFixed(0)}°</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassContainer: {
    marginBottom: 20,
  },
  dataContainer: {
    alignItems: 'center',
  },
});
