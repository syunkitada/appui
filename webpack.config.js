module.exports = {
  // モード値を production に設定すると最適化された状態で出力される
  //  development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",
  // mode: 'production',

  // エントリーポイント: 相対パス
  entry: `./src/index.tsx`,

  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名: 絶対パス
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: "main.js"
  },

  // モジュールの設定
  // Loaderモジュールを利用すると、JS以外のCSSやTypeScriptなどをバンドルすることができる
  // 利用可能なLoaderモジュール: https://webpack.js.org/loaders/
  module: {
    rules: [
      {
        // 拡張子が .css の場合、style-loader, css-loaderを利用する
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        // 拡張子が .ts もしくは .tsx の場合、ts-loaderを利用する
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },

  // モジュールをimportする際の解決方法の設定
  resolve: {
    // https://webpack.js.org/configuration/resolve/#resolveextensions
    // .ts や .tsx ファイルをimportできるようにする
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  // 開発サーバ(webpack serve) の設定
  devServer: {
    host: "0.0.0.0",
    port: "3000",
    contentBase: "public"
  }
};
