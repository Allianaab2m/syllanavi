module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'subject-case': [0, 'always'], // subject のルールを無効化
      'header-max-length': [2, 'always', 999] // メッセージヘッダーの文字制限を 999 文字に
    }
  };