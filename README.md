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

```
$ yarn create react-app sample-app --template typescript
$ cd sample-app
$ git submodule add git@github.com:syunkitada/appui.git src/appui
$ yarn add link:./src/appui
```

- index.tsx ファイルを作成する

```
import React from "react";
import ReactDOM from "react-dom";

import auth from "./appui/src/apps/auth";
import service from "./appui/src/apps/service";
import provider from "./appui/src/provider";
import app from "./app";

$(function () {
    provider.register(new app.Provider());

    if ("auth" in window) {
        service.init();
    } else {
        auth.init();
    }
});
```

- AP 用のディレクトリ(src/app)を作成し、IProvider インターフェイスの実装を定義する

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
