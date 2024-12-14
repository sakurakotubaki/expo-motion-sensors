# Expo Motion Sensors Demo

このプロジェクトは、Expoを使用してモバイルデバイスの加速度センサーを視覚的に表示するデモアプリケーションです。デバイスの傾きを矢印で直感的に表示します。

## 機能

- デバイスの傾きをリアルタイムで検出
- 傾きの方向と強さを視覚的に表示（SVGを使用）
- 傾きの角度と強度を数値で表示

## 必要な環境

- Node.js (v20以上)
- Expo CLI
- iOS/Androidデバイス、またはシミュレータ

## 使用しているパッケージ

- expo-sensors: デバイスの加速度センサーにアクセス
- react-native-svg: 傾きを視覚的に表示するためのSVGコンポーネント

## セットアップ手順

1. プロジェクトをクローン
```bash
git clone https://github.com/sakurakotubaki/expo-motion-sensors
cd expo-motion-sensors
```

2. 依存パッケージをインストール
```bash
bun install
```

3. アプリを起動
```bash
bun start
```

4. ExpoGoアプリでQRコードをスキャン
   - iOSの場合：カメラアプリでQRコードをスキャン
   - Androidの場合：ExpoGoアプリでQRコードをスキャン

## コードの解説

### センサーの初期化と購読

```typescript
const _subscribe = () => {
  setSubscription(
    Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    })
  );
  Accelerometer.setUpdateInterval(100);
};
```

加速度センサーのデータを100ミリ秒ごとに更新し、状態を更新します。

### 傾きの計算

```typescript
const calculateAngle = () => {
  const angle = Math.atan2(y, x);
  return angle * (180 / Math.PI);
};

const calculateTiltStrength = () => {
  return Math.min(Math.sqrt(x * x + y * y), 1);
};
```

- `calculateAngle`: x軸とy軸の値から傾きの角度を計算
- `calculateTiltStrength`: 傾きの強さを0-1の範囲で計算

### 視覚的な表示

SVGを使用して、円と矢印で傾きを表示します：
- 外側の円：基準となる円
- 緑の矢印：デバイスの傾きの方向と強さを表示
- 中心点：基準点

## 注意事項

- 実機でのテストを推奨（シミュレータでは加速度センサーの値が正確に取得できない場合があります）
- デバイスを平らな場所に置いた状態が初期状態となります
