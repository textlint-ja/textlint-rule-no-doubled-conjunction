# textlint-rule-no-doubled-conjunction

「しかし、〜。しかし、〜」のように同じ接続詞が連続すると、文章が読みにくくなります。
同じ接続詞が連続して書かれていないかをチェックするための[textlint](https://github.com/textlint/textlint "textlint")ルールです。

## Example

> かな漢字変換により漢字が多用される傾向がある。しかし漢字の多用が読みにくさをもたらす側面は否定できない。しかし、平仮名が多い文は間延びした印象を与える恐れもある。

この例では、「しかし」が2つのセンテンスで連続して使われています。
同じ接続詞が連続して使われていると、文章がくどく感じられ読みにくくなります。

無駄な接続詞をとる、別の接続詞に置き換える、文章を流れを変えて書き直すなどの方法で読みやすくなります。

> かな漢字変換により漢字が多用される傾向があるが、漢字の多用が読みにくさをもたらす側面は否定できない。しかし、平仮名が多い文は間延びした印象を与える恐れもある。

- [「しかし」「だが」を繰り返さない、スラスラ読める文章を書く秘訣（2ページ目） | 日経クロステック（xTECH）](https://xtech.nikkei.com/atcl/nxt/column/18/00931/082600002/?P=2)

## Installation

    npm install textlint-rule-no-doubled-conjunction

### Dependencies

- [azu/kuromojin](https://github.com/azu/kuromojin): a wrapper of [kuromoji.js](https://github.com/takuyaa/kuromoji.js "kuromoji.js")
- [azu/sentence-splitter](https://github.com/azu/sentence-splitter)

## Usage

Via `.textlintrc`(Recommended)

```json
{
  "rules": {
    "no-doubled-conjunction": true
  }
}
```

Via CLI

    textlint --rule no-doubled-conjunction sample.md

### Options

There's no options for this plugin.

## Tests

    npm test

## Reference

- [textlint](https://github.com/textlint/textlint)
- [textlint-rule-no-doubled-joshi](https://github.com/azu/textlint-rule-no-doubled-joshi): this plugin is based on it
- [textlint-rule-no-start-duplicated-conjunction](https://github.com/azu/textlint-rule-no-start-duplicated-conjunction): similar plugin, but it doesn't use part-of-speech but splitting with pointing(comma).

## License

MIT
