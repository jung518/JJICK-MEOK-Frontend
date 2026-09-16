export default {
  expo: {
    name: 'JJICK-MEOK',
    slug: 'JJICK-MEOK',
    version: '1.0.0',
    scheme: 'jjick-meok',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    updates: {
      url: 'https://u.expo.dev/1a606ff9-09bc-4dd1-9121-8a8d7ca1572f',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.jjickmeok.app', //App Store 등록용 앱 고유 ID - 추후 변경
    },
    android: {
      package: 'com.jjickmeok.app', //Play Store 등록용 앱 고유 ID - 추후 변경
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: 'metro',
      output: 'single',
    },
    plugins: ['expo-router', 'expo-web-browser', 'expo-secure-store', 'expo-font', 'expo-status-bar'],
    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
      },
    },
  },
};
