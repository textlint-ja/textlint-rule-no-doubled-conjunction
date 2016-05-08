import rule from "../src/no-doubled-conjunction";
import TextLintTester from "textlint-tester";
var tester = new TextLintTester();
tester.run("no-doubled-conjunction", rule, {
    valid: [
        "朝起きた。そして、夜に寝た。",
        "そして朝起きた。けれど昼は仕事をした。そして夜に寝た。",
        "``" // empty Paragraph
    ],
    invalid: [
      {
          text: "朝起きた。そして昼は仕事をした。そして夜に寝た",
          errors: [
              {
                  message: `同じ接続詞が連続して使われています。`,
                  // last match
                  line: 1,
                  column: 17
              }
          ]
      },
      {
          text: "そして朝起きた。昼は仕事をした。そして夜に寝た",
          errors: [
              {
                  message: `同じ接続詞が連続して使われています。`,
                  // last match
                  line: 1,
                  column: 17
              }
          ]
      },
      {
          text: "かな漢字変換により漢字が多用される傾向がある。しかし漢字の多用が読みにくさをもたらす側面は否定できない。しかし、平仮名が多い文は間延びした印象を与える恐れもある。",
          errors: [
              {
                  message: `同じ接続詞が連続して使われています。`,
                  // last match
                  line: 1,
                  column: 53
              }
          ]
      }

    ]
});
