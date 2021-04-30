# Application User Interface (APPUI)

## Overview

- 自分用の実験プロジェクトです
- html や css を定義せずに UI を提供するためのフレームワーク
- アプリケーション開発者は、ApplicationProvider (AP: TypeScript) を作成するだけ
- AP は、View の提供、Action のハンドリングを行う
  - View は json で定義された UI の元データ
  - appui は View を元に、html のレンダリングを行う
  - appui はイベント時に必要に応じて AP のハンドラを呼び出してデータの読み書きを行う

```
[AP] -- Register ------------> [APPUI]
     <------------- GetView -- Render
     <--- CallActionHandler -- Action
```

## How to use

### プロジェクトを初期化する

```
$ mkdir [project]
$ cd [project]
$ git submodule add git@github.com:syunkitada/appui.git src/appui
$ cp -r src/appui/*.json src/appui/*.js src/appui/public ./

# package.jsonのdependenciesにappuiを書く
$ vim package.json
"dependencies": {
  "appui": "link:./src/appui"
}

$ yarn install
```

### エントリーポイント(src/index.tsx)を作成する

```
import auth from "./appui/src/apps/auth";
import provider from "./appui/src/provider";
import app from "./app";

$(function () {
    provider.register(new app.Provider());
    auth.init();
});
```

### AP 用のディレクトリ(src/app)を作成し、IProvider インターフェイスの実装を定義する

- 定義方法は、[APPUI Demos](https://github.com/syunkitada/appui-demos)を参考にしてください

```
$ mkdir src/app

$ vim src/app/index.tsx
import { IProvider } from "../appui/src/provider/IProvider";

class Provider implements IProvider {
...
}

const index = {
    Provider
};
export default index;
```

### Scripts

```
# 開発サーバの起動
$ yarn start
yarn run v1.22.10
$ webpack serve
ℹ ｢wds｣: Project is running at http://0.0.0.0:3000/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: Content not from webpack is served from public
ℹ ｢wds｣: 404s will fallback to /index.html
```

```
# ビルド
$ yarn build

# distにmain.jsが作成されるので、publicのファイルと一緒に公開して利用ください
$ ls dist
main.js

# public内のindex.html、favicon、logoなどは適宜変更してください
$ ls public
favicon.ico  index.html  logo192.png  logo512.png  manifest.json  robots.txt
```
