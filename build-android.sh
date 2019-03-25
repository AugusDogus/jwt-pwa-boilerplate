cd -- "$(dirname "$0")"

rm -rf jwt-pwa-boilerplate.apk

ionic cordova build android --prod --release && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore jwt-pwa-boilerplate.jks -storepass CHANGEME ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk jwt-pwa-boilerplate && /usr/local/Caskroom/android-sdk/4333796/build-tools/28.0.3/zipalign -v 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk jwt-pwa-boilerplate.apk && /usr/local/Caskroom/android-sdk/4333796/build-tools/28.0.3/apksigner verify jwt-pwa-boilerplate.apk
