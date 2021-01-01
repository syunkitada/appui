# README

## Routing

- 以下の Path によって root-content の特定を行う
  - CommonService
    - /Service/[ServiceName]
  - ProjectService
    - /Project/[ProjectName]/[ServiceName]
- Service Path からは、searchParams によって Routing を行う
  - json で以下の Location データを管理する
    - Path
      - 現在のローケーションパスを管理する
    - SubPathMap: {PathKey1: PathData1, PathKey2: PathData2}
      - ローケーションヒストリを管理するためのマップ
    - DataQueries: ["Query1", "Query2"]
      - ロケーションパスの Component を表示するためのデータ取得を行う Query を保存する
    - Params: {Key1: Data1, Key2: Data2}
      - Query を実行するとこに渡すパラメータを保存する

## html 要素の id や class の命名規則

- html の id や class はグローバルなものなので、以下のルールを順守する
- 上位コンポーネントから受け取った \${id} を名前の先頭につける
- 各 html 要素の id や class の先頭には決まって以下のプレフィックスを付ける
  - keyPrefix = `${id}-${ComponentName}-`
    - ComponentName は大文字で始めた CamelCase
  - 以下のような id や class 名になる
  - `${keyPrefix}${subComponentName}`
    - subComponentName は小文字で始めた camelCase
  - 例
    - `${keyPrefix}table`
    - `${keyPrefix}pagenation`
    - `${keyPrefix}search`
