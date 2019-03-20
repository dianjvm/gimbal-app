# GIMBAL
GIMBAL - Pencarian Tukang Tambal Ban Langsung

## Require
* Node JS
* NPM
* SDK Android Studio
* Gradle
* Ionic
* Cordova
* Git (Command Line Interface)

## Installations

### 1. Node JS
First, you need [nodejs](https://nodejs.org/en/) for install this repo.
you can download [here](https://nodejs.org/en/).
After install nodejs, by default npm is install.

### 2. IONIC
Install ionic is easy, you can start [here](https://ionicframework.com).

### 3. Clone & Install
Clone this repo with git-cli,
```
git clone https://github.com/dianjvm/gimbal-app.git gimbal
cd gimbal
npm install
```
wait installations and see not have error message after install.

### 4. You Go
```
ionic serve
```
## Build
### Android
You need android studio install, and SDK Path is set to environment variable.
gradle install and set to environment.

then following this code:
```
ionic cordova platform add android
ionic cordova prepare android
```

After finish let build your first gimbal apk.
```
ionic cordova build android --prod
```
cek your folder platform/android/app/build/outputs/apk/debug/app-debug.apk
