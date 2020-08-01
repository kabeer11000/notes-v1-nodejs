"use strict";
async function smartCompose (data) {
    let getLastWord = (words) => {
        var n = words.split(/[\s,]+/) ;
        return n[n.length - 1];
    },
    ReplaceLastWord = (str, newStr) => {
        return str.replace(/\w*$/, newStr);
    };
    const options1 = {
        composer: (text, callback) => {
            const fuse_options = {
                includeScore: true,
            };
            const fuse = new Fuse(data, fuse_options);
            let p = fuse.search(getLastWord(text));
            try {
                callback(ReplaceLastWord(getLastWord(text),p[0].item));
            }catch (e) {}
        },
        onChange: (text) => {
            document.querySelector('textarea').value = ReplaceLastWord(document.querySelector('textarea').value.slice(0, -text.acceptedSuggestion.length),text.acceptedSuggestion);
        },

    };
        smartCompose = new AutoComposeTextarea (options1, document.querySelector('textarea'));
        smartCompose.addInputs(document.querySelector('textarea'));
        document.querySelector('textarea').addEventListener('onblur', async () =>{
            smartCompose.destroy();
        });
}
export {smartCompose}