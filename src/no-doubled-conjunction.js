// LICENSE : MIT
"use strict";
import { RuleHelper } from "textlint-rule-helper";
import { tokenize } from "kuromojin";
import { splitAST, SentenceSplitterSyntax as SentenceSyntax } from "sentence-splitter";

/*
    1. Paragraph Node -> text
    2. text -> sentences
    3. tokenize sentence
    4. report error if found word that match the rule.

    TODO: need abstraction
 */
/**
 * @param {import("@textlint/types").TextlintRuleContext}context
 * @param {*} options
 * @returns {import("@textlint/types").TextlintRuleReporter}
 */
export default function (context, options = {}) {
    const helper = new RuleHelper(context);
    const { Syntax, report, RuleError, locator } = context;
    return {
        async [Syntax.Paragraph](node) {
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            }
            const isSentenceNode = (node) => node.type === SentenceSyntax.Sentence;
            const sentences = splitAST(node, {
                SeparatorParser: {
                    separatorCharacters: [
                        ".", // period
                        "．", // (ja) zenkaku-period
                        "。", // (ja) 句点
                        "?", // question mark
                        "!", //  exclamation mark
                        "？", // (ja) zenkaku question mark
                        "！" // (ja) zenkaku exclamation mark
                    ]
                }
            }).children.filter(isSentenceNode)
            // if not have a sentence, early return
            // It is for avoiding error of emptyArray.reduce().
            if (sentences.length === 0) {
                return;
            }
            const selectConjenction = async (sentence) => {
                const tokens = await tokenize(sentence.raw);
                const conjunctionTokens = tokens.filter((token, index) => {
                    const prevToken = tokens[index - 1];
                    // スペースが切れ目として認識されてしまう問題を回避
                    // https://github.com/textlint-ja/textlint-rule-no-doubled-conjunction/issues/14
                    if (prevToken && prevToken.pos_detail_1 === "空白" && token.pos === "接続詞") {
                        return false;
                    }
                    return token.pos === "接続詞"
                });
                return [sentence, conjunctionTokens];
            }
            let prev_token = null;
            const result = await Promise.all(sentences.map(selectConjenction));
            result.reduce(((prev, current) => {
                const [sentence, current_tokens] = current;
                const [prev_sentence, prev_tokens] = prev;
                let token = prev_token;
                if (prev_tokens && prev_tokens.length > 0) {
                    token = prev_tokens[0];
                }
                if (current_tokens.length > 0) {
                    if (token && current_tokens[0].surface_form === token.surface_form) {
                        const conjunctionSurface = token.surface_form;
                        // padding position
                        report(sentence,
                            new RuleError(`同じ接続詞（${conjunctionSurface}）が連続して使われています。`, {
                                padding: locator.range([
                                    token.word_position - 1,
                                    token.word_position + conjunctionSurface.length - 1
                                ])
                            }));
                    }
                }
                prev_token = token;
                return current;
            }));
        }
    }
};
