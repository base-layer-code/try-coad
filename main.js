// ファイル読み込み
function loadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        document.getElementById('editor').value = ev.target.result;
        runPreview(); // 読み込んだら即実行
    };
    reader.readAsText(file);
}

// 書き換え（置換）機能
function runReplace() {
    const findVal = document.getElementById('find-in').value;
    const replaceVal = document.getElementById('replace-in').value;
    const editor = document.getElementById('editor');
    
    if (!findVal) return;
    
    const newContent = editor.value.split(findVal).join(replaceVal);
    editor.value = newContent;
    runPreview(); // 書き換えたら即反映
}

// プレビュー実行
function runPreview() {
    const code = document.getElementById('editor').value;
    const previewFrame = document.getElementById('preview');
    const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    
    previewDoc.open();
    previewDoc.write(code);
    previewDoc.close();
}
function openFullPreview() {
    const code = document.getElementById('editor').value;
    
    // 新しいタブ（ウィンドウ）を開く
    const newWindow = window.open();
    
    // その新しいタブのドキュメントにエディタのコードを書き込む
    newWindow.document.open();
    newWindow.document.write(code);
    newWindow.document.close();
}

// ショートカットキー (Ctrl + S で実行)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        runPreview();
    }
});
